using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using JobHelper.Data;
using JobHelper.Services;
using JobHelper.Models;
using Microsoft.EntityFrameworkCore;
using JobHelper.ApiModels;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

IConfigurationSection configuration = builder.Configuration.GetSection("Authentication");

// Configure SQL Server Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        // Enable retry on failure for transient errors (Azure SQL best practice)
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
        
        // Command timeout for long-running queries
        sqlOptions.CommandTimeout(30);
        
        // Use split queries for better performance when loading multiple collections
        sqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
    });
});

// Register services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IResumeService, ResumeService>();

// Add OpenAPI services
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
            ?? new[] { "http://localhost:3000" };
        
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.LoginPath = "/api/auth/login";
    options.LogoutPath = "/api/auth/logout";
    options.Cookie.Name = "JobHelper.Auth";
    options.Cookie.HttpOnly = false;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest; // Require HTTPS (backend is on HTTPS)
    options.Cookie.SameSite = SameSiteMode.None; // Allow cross-site for different domains
    options.Cookie.IsEssential = true; // Mark as essential for GDPR compliance
    options.ExpireTimeSpan = TimeSpan.FromHours(24);
    options.SlidingExpiration = true;
    
    options.Events.OnRedirectToLogin = context =>
    {
        var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(
            "Authentication required - redirecting to login. Request Path: {RequestPath}, Reason: Cookie authentication failed or missing",
            context.Request.Path
        );
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
    options.Events.OnValidatePrincipal = async context =>
    {
        var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
        
        if (context.Principal?.Identity?.IsAuthenticated != true)
        {
            logger.LogWarning(
                "Cookie validation failed - user not authenticated. Request Path: {RequestPath}",
                context.Request.Path
            );
            context.RejectPrincipal();
            await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
        else
        {
            logger.LogInformation(
                "Cookie validation successful. User: {Email}, Claims: {ClaimsCount}",
                context.Principal.FindFirst(ClaimTypes.Email)?.Value ?? "Unknown",
                context.Principal.Claims.Count()
            );
        }
    };
})
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = configuration["Google:ClientId"]!;
    googleOptions.ClientSecret = configuration["Google:ClientSecret"]!;
    googleOptions.CallbackPath = "/api/auth/google/callback";
    
    // Request email scope
    googleOptions.Scope.Add("email");
    googleOptions.Scope.Add("profile");
    
    // Save tokens for later use if needed
    googleOptions.SaveTokens = true;
    
    // Map claims from Google to our claims
    googleOptions.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
    googleOptions.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
    googleOptions.ClaimActions.MapJsonKey(ClaimTypes.GivenName, "given_name");
    googleOptions.ClaimActions.MapJsonKey(ClaimTypes.Surname, "family_name");
    googleOptions.ClaimActions.MapJsonKey("picture", "picture");
    
    // Add event handlers for authentication failures
    googleOptions.Events.OnRemoteFailure = context =>
    {
        var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
        var errorMessage = context.Failure?.Message ?? "Unknown error";
        var errorType = context.Failure?.GetType().Name ?? "Unknown";
        
        logger.LogError(
            "Google OAuth authentication failed. Error Type: {ErrorType}, Error Message: {ErrorMessage}, Request Path: {RequestPath}",
            errorType,
            errorMessage,
            context.Request.Path
        );
        
        context.Response.Redirect("/api/auth/login?error=oauth_failed");
        context.HandleResponse();
        return Task.CompletedTask;
    };
    
    googleOptions.Events.OnAccessDenied = context =>
    {
        var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(
            "User denied access during Google OAuth authentication. Request Path: {RequestPath}",
            context.Request.Path
        );
        
        context.Response.Redirect("/api/auth/login?error=access_denied");
        context.HandleResponse();
        return Task.CompletedTask;
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Map OpenAPI endpoint
app.MapOpenApi();

// Add Scalar API documentation UI (modern alternative to Swagger UI)
app.MapScalarApiReference();

// IMPORTANT: CORS must be called before Authentication and Authorization
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Login endpoint - redirects to Google
app.MapGet("/api/auth/login", async (HttpContext context, ILogger<Program> logger) =>
{
    logger.LogInformation(
        "Login initiated. Request Path: {RequestPath}, Query String: {QueryString}, User Agent: {UserAgent}",
        context.Request.Path,
        context.Request.QueryString,
        context.Request.Headers["User-Agent"].ToString()
    );
    
    var properties = new AuthenticationProperties
    {
        RedirectUri = "/api/auth/callback",
        IsPersistent = true,
        AllowRefresh = true
    };
    
    return Results.Challenge(properties, new[] { GoogleDefaults.AuthenticationScheme });
})
.WithTags("Authentication");


// OAuth callback endpoint - handles the redirect from Google
app.MapGet("/api/auth/callback", async (HttpContext context, IUserService userService, ILogger<Program> logger) =>
{
    var config = context.RequestServices.GetRequiredService<IConfiguration>();
    var frontendUrl = config.GetSection("Cors:AllowedOrigins").Get<string[]>()?[0] ?? "http://localhost:3000";
    
    if (!context.User.Identity?.IsAuthenticated ?? true)
    {
        logger.LogWarning(
            "OAuth callback failed - user not authenticated after OAuth callback. Request Path: {RequestPath}",
            context.Request.Path
        );
        
        // Redirect to frontend with error
        return Results.Redirect($"{frontendUrl}/login?error=auth_failed");
    }
    
    var email = context.User.FindFirst(ClaimTypes.Email)?.Value;
    var name = context.User.FindFirst(ClaimTypes.Name)?.Value;
    
    logger.LogInformation(
        "User successfully authenticated via OAuth. Email: {Email}, Name: {Name}, Claims: {Claims}",
        email ?? "Unknown",
        name ?? "Unknown",
        string.Join(", ", context.User.Claims.Select(c => $"{c.Type}={c.Value}"))
    );
    
    // Get or create user in database
    try
    {
        if (!string.IsNullOrEmpty(email))
        {
            var dbUser = await userService.GetOrCreateUserAsync(email);
            logger.LogInformation("User loaded/created in database. User ID: {UserId}", dbUser.Id);
        }
    }
    catch (Exception ex)
    {
        logger.LogError(
            ex,
            "Failed to get or create user in database during OAuth callback. Email: {Email}",
            email
        );
    }
    
    // Redirect to frontend success page
    return Results.Redirect($"{frontendUrl}/auth/callback");
})
.WithTags("Authentication")
.WithSummary("OAuth callback endpoint")
.WithDescription("Handles the redirect from Google OAuth and sets authentication cookie")
.ExcludeFromDescription();

// Success endpoint after login (deprecated - keeping for backward compatibility)
app.MapGet("/api/auth/success", (HttpContext context, ILogger<Program> logger) =>
{
    if (!context.User.Identity?.IsAuthenticated ?? true)
    {
        logger.LogWarning(
            "Login success callback failed - user not authenticated after OAuth callback. Request Path: {RequestPath}",
            context.Request.Path
        );
        return Results.Redirect("/api/auth/login");
    }
    
    var email = context.User.FindFirst(ClaimTypes.Email)?.Value;
    var name = context.User.FindFirst(ClaimTypes.Name)?.Value;
    
    logger.LogInformation(
        "User successfully authenticated via OAuth. Email: {Email}, Name: {Name}",
        email ?? "Unknown",
        name ?? "Unknown"
    );
    
    // Redirect to frontend home page after successful login
    var frontendUrl = context.RequestServices.GetRequiredService<IConfiguration>()
        .GetSection("Cors:AllowedOrigins").Get<string[]>()?[0] ?? "http://localhost:3000";
    
    return Results.Redirect(frontendUrl);
})
.WithTags("Authentication")
.ExcludeFromDescription();

// Get current user info endpoint
app.MapGet("/api/auth/me", async (HttpContext context, IUserService userService, ILogger<Program> logger) =>
{
    // Log authentication status for debugging
    var isAuth = context.User.Identity?.IsAuthenticated ?? false;
    var cookieHeader = context.Request.Headers["Cookie"].ToString();
    var cookieName = "JobHelper.Auth";
    var hasCookie = cookieHeader.Contains(cookieName);
    
    logger.LogInformation(
        "Auth check - IsAuthenticated: {IsAuth}, Cookie Present: {CookiePresent}, Has JobHelper Cookie: {HasCookie}, Claims Count: {ClaimsCount}, Origin: {Origin}, Referer: {Referer}",
        isAuth,
        !string.IsNullOrEmpty(cookieHeader),
        hasCookie,
        context.User.Claims.Count(),
        context.Request.Headers["Origin"].ToString(),
        context.Request.Headers["Referer"].ToString()
    );
    
    if (!isAuth)
    {
        logger.LogWarning(
            "Authentication check failed - user not authenticated. " +
            "Cookie Present: {CookiePresent}, Has JobHelper Cookie: {HasCookie}, Claims Count: {ClaimsCount}, Request Path: {RequestPath}, User Agent: {UserAgent}",
            !string.IsNullOrEmpty(cookieHeader),
            hasCookie,
            context.User.Claims.Count(),
            context.Request.Path,
            context.Request.Headers["User-Agent"].ToString()
        );
        return Results.Json(new { isAuthenticated = false }, statusCode: 401);
    }

    var email = context.User.FindFirst(ClaimTypes.Email)?.Value;
    var name = context.User.FindFirst(ClaimTypes.Name)?.Value;
    var givenName = context.User.FindFirst(ClaimTypes.GivenName)?.Value;
    var surname = context.User.FindFirst(ClaimTypes.Surname)?.Value;
    var picture = context.User.FindFirst("picture")?.Value;

    if (string.IsNullOrEmpty(email))
    {
        logger.LogError(
            "Authentication succeeded but email claim is missing. User Name: {UserName}, Claims: {Claims}",
            name ?? "Unknown",
            string.Join(", ", context.User.Claims.Select(c => $"{c.Type}={c.Value}"))
        );
        return Results.Json(new { 
            isAuthenticated = false, 
            error = "Email claim missing" 
        }, statusCode: 401);
    }

    logger.LogInformation(
        "User authenticated successfully. Email: {Email}, Name: {Name}",
        email,
        name
    );

    // Get or create user in database
    User? dbUser = null;
    try
    {
        dbUser = await userService.GetOrCreateUserAsync(email);
        logger.LogInformation("User loaded from database. User ID: {UserId}", dbUser.Id);
    }
    catch (Exception ex)
    {
        logger.LogError(
            ex,
            "Failed to get or create user in database. Email: {Email}, Error: {ErrorMessage}",
            email,
            ex.Message
        );
        return Results.Problem(
            detail: "Failed to retrieve user information",
            statusCode: 500,
            title: "Database Error"
        );
    }

    return Results.Ok(new
    {
        id = dbUser?.Id,
        email = email,
        name = name,
        givenName = givenName,
        surname = surname,
        picture = picture,
        isAuthenticated = true
    });
})
.WithTags("Authentication")
.WithSummary("Get current authenticated user information")
.WithDescription("Returns information about the currently authenticated user from Google OAuth");

// Logout endpoint
app.MapGet("/api/auth/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.Ok(new { success = true, message = "Logged out successfully" });
})
.WithTags("Authentication")
.WithSummary("Logout current user")
.WithDescription("Logs out the current user by clearing the authentication cookie");

// Get all resumes for a user
app.MapGet("/api/users/{userId:guid}/resumes", async (Guid userId, IResumeService resumeService) =>
{
    try
    {
        var resumes = await resumeService.GetResumesByUserIdAsync(userId);

        return Results.Ok(resumes.Select(r => new LightResumeApiModel
        {
            Id = r.Id,
            Name = r.PersonalDetails.Name,
        }));
    }
    catch (Exception ex)
    {
        return Results.Problem(
            detail: ex.Message,
            statusCode: 500,
            title: "Error retrieving resumes"
        );
    }
})
.WithName("GetUserResumes")
.WithTags("Resumes")
.WithSummary("Get all resumes for a user")
.WithDescription("Retrieves all resumes associated with a specific user ID")
.Produces<List<LightResumeApiModel>>(200)
.Produces(500);

// Get a specific resume by ID
app.MapGet("/api/resumes/{resumeId:guid}", async (Guid resumeId, IResumeService resumeService) =>
{
    try
    {
        var resume = await resumeService.GetResumeByIdAsync(resumeId);
        return resume is not null 
            ? Results.Ok(resume) 
            : Results.NotFound(new { message = $"Resume with ID {resumeId} not found" });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            detail: ex.Message,
            statusCode: 500,
            title: "Error retrieving resume"
        );
    }
})
.WithName("GetResume")
.WithTags("Resumes")
.WithSummary("Get a specific resume by ID")
.WithDescription("Retrieves detailed information about a specific resume including all sections (personal details, education, employment, skills, languages, hobbies)")
.Produces<Resume>(200)
.Produces(404)
.Produces(500);

// Create a new resume for a user
app.MapPost("/api/users/{userId:guid}/resumes", async (Guid userId, Resume resume, IResumeService resumeService) =>
{
    try
    {
        var createdResume = await resumeService.CreateResumeAsync(userId, resume);
        return Results.Created($"/api/resumes/{createdResume.Id}", createdResume);
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(new { message = ex.Message });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            detail: ex.Message,
            statusCode: 500,
            title: "Error creating resume"
        );
    }
})
.WithName("CreateResume")
.WithTags("Resumes")
.WithSummary("Create a new resume")
.WithDescription("Creates a new resume for the specified user with all personal details, education, employment, skills, languages, and hobbies")
.Produces<Resume>(201)
.Produces(400)
.Produces(500);

app.Run();