namespace JobHelper.ApiModels;

/// <summary>
/// Represents a quiz with its identifier and score
/// </summary>
public class Quiz
{
    /// <summary>
    /// Unique identifier for the quiz
    /// </summary>
    public Guid QuizId { get; set; }

    /// <summary>
    /// Score achieved in the quiz
    /// </summary>
    public int QuizScore { get; set; }
}
