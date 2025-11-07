using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

IConfigurationSection configuration = builder.Configuration.GetSection("Authentication");

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
});

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
});

// Get current user info endpoint
app.MapGet("/api/auth/me", (HttpContext context) =>
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
    
    return Results.Ok(new
    {
        email = email,
        name = name,
        givenName = givenName,
        surname = surname,
        picture = picture,
        isAuthenticated = true
    });
});

// Logout endpoint
app.MapGet("/api/auth/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.Ok(new { success = true, message = "Logged out successfully" });
});

app.Run();