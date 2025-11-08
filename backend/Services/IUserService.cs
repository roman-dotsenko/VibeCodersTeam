using JobHelper.Models;

namespace JobHelper.Services;

/// <summary>
/// Interface for user management operations
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Creates a new user in the database
    /// </summary>
    /// <param name="email">User's email address</param>
    /// <returns>The created user</returns>
    Task<User> CreateUserAsync(string email);

    /// <summary>
    /// Gets a user by their email address
    /// </summary>
    /// <param name="email">User's email address</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> GetUserByEmailAsync(string email);

    /// <summary>
    /// Gets a user by their ID
    /// </summary>
    /// <param name="userId">User's unique identifier</param>
    /// <returns>The user if found, null otherwise</returns>
    Task<User?> GetUserByIdAsync(Guid userId);

    /// <summary>
    /// Gets or creates a user by email
    /// </summary>
    /// <param name="email">User's email address</param>
    /// <returns>Existing or newly created user</returns>
    Task<User> GetOrCreateUserAsync(string email);

    /// <summary>
    /// Deletes a user and all associated data (resumes, quizzes, etc.)
    /// </summary>
    /// <param name="userId">The user's unique identifier</param>
    /// <returns>True if deleted, false if user not found</returns>
    Task<bool> DeleteUserAsync(Guid userId);
}
