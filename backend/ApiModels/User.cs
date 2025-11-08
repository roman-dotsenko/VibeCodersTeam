namespace JobHelper.ApiModels;

/// <summary>
/// Represents a user in the system
/// </summary>
public class User
{
    /// <summary>
    /// Unique identifier for the user
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User's email address
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Collection of resumes associated with this user
    /// </summary>
    public List<Resume> Resumes { get; set; } = new();

    /// <summary>
    /// Collection of quizzes taken by this user
    /// </summary>
    public List<Quiz> Quizzes { get; set; } = new();
}
