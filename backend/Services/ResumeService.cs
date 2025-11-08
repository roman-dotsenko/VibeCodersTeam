using JobHelper.Data;
using JobHelper.Models;
using Microsoft.EntityFrameworkCore;

namespace JobHelper.Services;

/// <summary>
/// Service for managing resume operations
/// </summary>
public class ResumeService : IResumeService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ResumeService> _logger;

    public ResumeService(ApplicationDbContext context, ILogger<ResumeService> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <inheritdoc/>
    public async Task<List<Resume>> GetResumesByUserIdAsync(Guid userId)
    {
        try
        {
            var resumes = await _context.Resumes
                .Include(r => r.Educations)
                .Include(r => r.Employment)
                .Where(r => EF.Property<Guid>(r, "UserId") == userId)
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} resumes for user {UserId}", resumes.Count, userId);
            return resumes;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving resumes for user {UserId}", userId);
            throw;
        }
    }

    /// <inheritdoc/>
    public async Task<Resume?> GetResumeByIdAsync(Guid resumeId)
    {
        try
        {
            var resume = await _context.Resumes
                .Include(r => r.Educations)
                .Include(r => r.Employment)
                .FirstOrDefaultAsync(r => r.Id == resumeId);

            if (resume != null)
            {
                _logger.LogInformation("Retrieved resume {ResumeId}", resumeId);
            }
            else
            {
                _logger.LogWarning("Resume {ResumeId} not found", resumeId);
            }

            return resume;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving resume {ResumeId}", resumeId);
            throw;
        }
    }

    /// <inheritdoc/>
    public async Task<Resume> CreateResumeAsync(Guid userId, Resume resume)
    {
        try
        {
            // Verify user exists
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                throw new InvalidOperationException($"User with ID {userId} does not exist");
            }

            // Set the resume ID and user relationship
            resume.Id = Guid.NewGuid();
            _context.Entry(resume).Property("UserId").CurrentValue = userId;

            _context.Resumes.Add(resume);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created resume {ResumeId} for user {UserId}", resume.Id, userId);
            return resume;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error while creating resume for user {UserId}", userId);
            throw new InvalidOperationException("Failed to create resume", ex);
        }
    }

    /// <inheritdoc/>
    public async Task<Resume> UpdateResumeAsync(Guid resumeId, Resume resume)
    {
        try
        {
            var existingResume = await _context.Resumes
                .Include(r => r.Educations)
                .Include(r => r.Employment)
                .FirstOrDefaultAsync(r => r.Id == resumeId);
                
            if (existingResume == null)
            {
                throw new InvalidOperationException($"Resume with ID {resumeId} does not exist");
            }

            // Direct assignment works for JSON-stored owned types
            existingResume.PersonalDetails = resume.PersonalDetails;

            // Update Skills (owned collection stored as JSON)
            existingResume.Skills = resume.Skills;

            // Update Languages (owned collection stored as JSON)
            existingResume.Languages = resume.Languages;

            // Update Hobbies (primitive collection)
            existingResume.Hobbies = resume.Hobbies;

            // Update Education collection
            existingResume.Educations.Clear();
            foreach (var education in resume.Educations)
            {
                existingResume.Educations.Add(education);
            }

            // Update Employment collection
            existingResume.Employment.Clear();
            foreach (var employment in resume.Employment)
            {
                existingResume.Employment.Add(employment);
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated resume {ResumeId}", resumeId);
            return existingResume;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error while updating resume {ResumeId}", resumeId);
            throw new InvalidOperationException("Failed to update resume", ex);
        }
    }

    /// <inheritdoc/>
    public async Task<bool> DeleteResumeAsync(Guid resumeId)
    {
        try
        {
            var resume = await _context.Resumes.FindAsync(resumeId);
            if (resume == null)
            {
                _logger.LogWarning("Attempted to delete non-existent resume {ResumeId}", resumeId);
                return false;
            }

            _context.Resumes.Remove(resume);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted resume {ResumeId}", resumeId);
            return true;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error while deleting resume {ResumeId}", resumeId);
            throw new InvalidOperationException("Failed to delete resume", ex);
        }
    }
}
