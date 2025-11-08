namespace JobHelper.ApiModels;

/// <summary>
/// Represents a skill with proficiency level
/// </summary>
public class Skill
{
    /// <summary>
    /// Name of the skill
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Proficiency level for this skill
    /// </summary>
    public required Level Level { get; set; }
}
