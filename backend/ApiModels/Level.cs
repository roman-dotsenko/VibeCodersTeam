namespace JobHelper.ApiModels;

/// <summary>
/// Represents a proficiency level (e.g., for skills or languages)
/// </summary>
public class Level
{
    /// <summary>
    /// Numeric representation of the level (e.g., 1-5, 1-10)
    /// </summary>
    public int Value { get; set; }

    /// <summary>
    /// Optional textual description of the level (e.g., "Beginner", "Advanced", "Native")
    /// </summary>
    public string? Description { get; set; }
}
