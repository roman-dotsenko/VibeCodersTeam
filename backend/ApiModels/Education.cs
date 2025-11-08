namespace JobHelper.ApiModels;

/// <summary>
/// Represents an educational background entry
/// </summary>
public class Education
{
    /// <summary>
    /// Unique identifier for the education entry
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Name of the degree, course, or qualification
    /// </summary>
    public required string EducationName { get; set; }

    /// <summary>
    /// Name of the educational institution
    /// </summary>
    public required string School { get; set; }

    /// <summary>
    /// City where the institution is located
    /// </summary>
    public string? City { get; set; }

    /// <summary>
    /// Start date of the education
    /// </summary>
    public DateOnly? StartDate { get; set; }

    /// <summary>
    /// End date of the education (null if ongoing)
    /// </summary>
    public DateOnly? EndDate { get; set; }

    /// <summary>
    /// Description of the education, achievements, etc.
    /// </summary>
    public string? Description { get; set; }
}
