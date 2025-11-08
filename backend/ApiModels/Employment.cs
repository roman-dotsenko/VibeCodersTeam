namespace JobHelper.ApiModels;

/// <summary>
/// Represents an employment history entry
/// </summary>
public class Employment
{
    /// <summary>
    /// Unique identifier for the employment entry
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Job title or position name
    /// </summary>
    public required string JobTitle { get; set; }

    /// <summary>
    /// Name of the employer/company
    /// </summary>
    public required string Employer { get; set; }

    /// <summary>
    /// City where the job is/was located
    /// </summary>
    public string? City { get; set; }

    /// <summary>
    /// Start date of employment
    /// </summary>
    public DateOnly? StartDate { get; set; }

    /// <summary>
    /// End date of employment (null if current position)
    /// </summary>
    public DateOnly? EndDate { get; set; }

    /// <summary>
    /// Description of responsibilities and achievements
    /// </summary>
    public string? Description { get; set; }
}
