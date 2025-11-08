using JobHelper.Data;
using JobHelper.Models;
using Microsoft.EntityFrameworkCore;

namespace JobHelper.Services;

/// <summary>
/// Service for managing quiz operations
/// </summary>
public class QuizService : IQuizService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<QuizService> _logger;

    public QuizService(ApplicationDbContext context, ILogger<QuizService> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <inheritdoc/>
    public async Task<List<Quiz>> GetQuizzesByUserIdAsync(Guid userId)
    {
        try
        {
            var quizzes = await _context.Quizzes
                .Where(q => EF.Property<Guid>(q, "UserId") == userId)
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} quizzes for user {UserId}", quizzes.Count, userId);
            return quizzes;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving quizzes for user {UserId}", userId);
            throw;
        }
    }

    /// <inheritdoc/>
    public async Task<Quiz> CreateQuizAsync(Guid userId, Quiz quiz)
    {
        try
        {
            // Verify user exists
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                throw new InvalidOperationException($"User with ID {userId} does not exist");
            }

            // Set the quiz ID and user relationship
            quiz.QuizId = Guid.NewGuid();
            _context.Entry(quiz).Property("UserId").CurrentValue = userId;

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created quiz {QuizId} for user {UserId} with score {Score}", 
                quiz.QuizId, userId, quiz.QuizScore);
            return quiz;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Database error while creating quiz for user {UserId}", userId);
            throw new InvalidOperationException("Failed to create quiz", ex);
        }
    }
}
