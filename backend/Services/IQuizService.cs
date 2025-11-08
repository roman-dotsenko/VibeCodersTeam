using JobHelper.Models;

namespace JobHelper.Services;

/// <summary>
/// Interface for quiz management operations
/// </summary>
public interface IQuizService
{
    /// <summary>
    /// Gets all quizzes for a specific user
    /// </summary>
    /// <param name="userId">The user's unique identifier</param>
    /// <returns>List of quizzes belonging to the user</returns>
    Task<List<Quiz>> GetQuizzesByUserIdAsync(Guid userId);

    /// <summary>
    /// Creates a new quiz for a user
    /// </summary>
    /// <param name="userId">The user's unique identifier</param>
    /// <param name="quiz">The quiz to create</param>
    /// <returns>The created quiz</returns>
    Task<Quiz> CreateQuizAsync(Guid userId, Quiz quiz);
}
