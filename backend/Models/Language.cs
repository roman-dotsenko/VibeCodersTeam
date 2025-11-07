namespace JobHelper.Models;

/// <summary>
/// Represents a language with proficiency level
/// </summary>
public class Language
{
    /// <summary>
    /// Name of the language
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Proficiency level for this language
    /// </summary>
    public required Level Level { get; set; }
}
