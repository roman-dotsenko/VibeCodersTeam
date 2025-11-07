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
        policy.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:3000" })
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
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Require HTTPS (backend is on HTTPS)
    options.Cookie.SameSite = SameSiteMode.None; // Allow cross-site for different ports
    options.ExpireTimeSpan = TimeSpan.FromHours(24);
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
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
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Map OpenAPI endpoint
app.MapOpenApi();

// Add Scalar API documentation UI (modern alternative to Swagger UI)
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Login endpoint - redirects to Google
app.MapGet("/api/auth/login", async (HttpContext context) =>
{
    var properties = new AuthenticationProperties
    {
        RedirectUri = "/api/auth/success"
    };
    
    return Results.Challenge(properties, new[] { GoogleDefaults.AuthenticationScheme });
})
.WithTags("Authentication");

// Success endpoint after login
app.MapGet("/api/auth/success", (HttpContext context) =>
{
    if (!context.User.Identity?.IsAuthenticated ?? true)
    {
        return Results.Redirect("/api/auth/login");
    }
    
    // Redirect to frontend home page after successful login
    var frontendUrl = context.RequestServices.GetRequiredService<IConfiguration>()
        .GetSection("Cors:AllowedOrigins").Get<string[]>()?[0] ?? "http://localhost:3000";
    
    return Results.Redirect(frontendUrl);
})
.WithTags("Authentication")
.ExcludeFromDescription();

// Get current user info endpoint
app.MapGet("/api/auth/me", async (HttpContext context, IUserService userService) =>
{
    // Log authentication status for debugging
    var isAuth = context.User.Identity?.IsAuthenticated ?? false;
    var cookieHeader = context.Request.Headers["Cookie"].ToString();
    Console.WriteLine($"Auth check - IsAuthenticated: {isAuth}");
    Console.WriteLine($"Cookie header: {cookieHeader}");
    Console.WriteLine($"User claims count: {context.User.Claims.Count()}");

    if (!isAuth)
    {
        return Results.Json(new { isAuthenticated = false }, statusCode: 401);
    }

    var email = context.User.FindFirst(ClaimTypes.Email)?.Value;
    var name = context.User.FindFirst(ClaimTypes.Name)?.Value;
    var givenName = context.User.FindFirst(ClaimTypes.GivenName)?.Value;
    var surname = context.User.FindFirst(ClaimTypes.Surname)?.Value;
    var picture = context.User.FindFirst("picture")?.Value;

    Console.WriteLine($"Returning user: {name} ({email})");

    // Get or create user in database
    User? dbUser = null;
    if (!string.IsNullOrEmpty(email))
    {
        try
        {
            dbUser = await userService.GetOrCreateUserAsync(email);
            Console.WriteLine($"Database user ID: {dbUser.Id}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error managing user in database: {ex.Message}");
        }
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

//// Get a specific resume by ID
//app.MapGet("/api/resumes/{resumeId:guid}", async (Guid resumeId, IResumeService resumeService) =>
//{
//    try
//    {
//        var resume = await resumeService.GetResumeByIdAsync(resumeId);
//        return resume is not null 
//            ? Results.Ok(resume) 
//            : Results.NotFound(new { message = $"Resume with ID {resumeId} not found" });
//    }
//    catch (Exception ex)
//    {
//        return Results.Problem(
//            detail: ex.Message,
//            statusCode: 500,
//            title: "Error retrieving resume"
//        );
//    }
//})
//.WithName("GetResume")
//.WithTags("Resumes")
//.WithSummary("Get a specific resume by ID")
//.WithDescription("Retrieves detailed information about a specific resume including all sections (personal details, education, employment, skills, languages, hobbies)")
//.Produces<Resume>(200)
//.Produces(404)
//.Produces(500);

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