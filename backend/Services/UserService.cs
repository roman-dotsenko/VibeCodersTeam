using JobHelper.Data;
using JobHelper.Models;
using Microsoft.EntityFrameworkCore;

namespace JobHelper.Services;

/// <summary>
/// Service for managing user operations
/// </summary>
public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UserService> _logger;

    public UserService(ApplicationDbContext context, ILogger<UserService> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <inheritdoc/>
    public async Task<User> CreateUserAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("Email cannot be empty", nameof(email));
        }

        // Check if user already exists
        var existingUser = await GetUserByEmailAsync(email);
        if (existingUser != null)
        {
            throw new InvalidOperationException($"User with email {email} already exists");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email.ToLowerInvariant().Trim()
        };

        try
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Created new user with ID {UserId} and email {Email}", user.Id, user.Email);
            
            return user;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error while creating user with email {Email}", email);
            throw new InvalidOperationException("Failed to create user", ex);
        }
    }

    /// <inheritdoc/>
    public async Task<User?> GetUserByEmailAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return null;
        }

        return await _context.Users
            .Include(u => u.Resumes)
                .ThenInclude(r => r.Educations)
            .Include(u => u.Resumes)
                .ThenInclude(r => r.Employment)
            .FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant().Trim());
    }

    /// <inheritdoc/>
    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _context.Users
            .Include(u => u.Resumes)
                .ThenInclude(r => r.Educations)
            .Include(u => u.Resumes)
                .ThenInclude(r => r.Employment)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    /// <inheritdoc/>
    public async Task<User> GetOrCreateUserAsync(string email)
    {
        var user = await GetUserByEmailAsync(email);
        
        if (user != null)
        {
            _logger.LogInformation("Found existing user with email {Email}", email);
            return user;
        }

        _logger.LogInformation("Creating new user with email {Email}", email);
        return await CreateUserAsync(email);
    }
}
