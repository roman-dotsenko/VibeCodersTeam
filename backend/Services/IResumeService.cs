using JobHelper.Models;

namespace JobHelper.Services;

/// <summary>
/// Interface for resume management operations
/// </summary>
public interface IResumeService
{
    /// <summary>
    /// Gets all resumes for a specific user
    /// </summary>
    /// <param name="userId">The user's unique identifier</param>
    /// <returns>List of resumes belonging to the user</returns>
    Task<List<Resume>> GetResumesByUserIdAsync(Guid userId);

    /// <summary>
    /// Gets a specific resume by ID
    /// </summary>
    /// <param name="resumeId">The resume's unique identifier</param>
    /// <returns>The resume if found, null otherwise</returns>
    Task<Resume?> GetResumeByIdAsync(Guid resumeId);

    /// <summary>
    /// Creates a new resume for a user
    /// </summary>
    /// <param name="userId">The user's unique identifier</param>
    /// <param name="resume">The resume to create</param>
    /// <returns>The created resume</returns>
    Task<Resume> CreateResumeAsync(Guid userId, Resume resume);

    /// <summary>
    /// Updates an existing resume
    /// </summary>
    /// <param name="resume">The resume to update</param>
    /// <returns>The updated resume</returns>
    Task<Resume> UpdateResumeAsync(Resume resume);

    /// <summary>
    /// Deletes a resume
    /// </summary>
    /// <param name="resumeId">The resume's unique identifier</param>
    /// <returns>True if deleted, false if not found</returns>
    Task<bool> DeleteResumeAsync(Guid resumeId);
}
