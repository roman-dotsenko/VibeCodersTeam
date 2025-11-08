namespace JobHelper.ApiModels;

public class Resume
{
    /// <summary>
    /// Unique identifier for the resume
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Personal details section of the resume
    /// </summary>
    public required PersonalDetails PersonalDetails { get; set; }

    /// <summary>
    /// Collection of educational background entries
    /// </summary>
    public List<Education> Educations { get; set; } = new();

    /// <summary>
    /// Collection of employment history entries
    /// </summary>
    public List<Employment> Employment { get; set; } = new();

    /// <summary>
    /// Collection of skills
    /// </summary>
    public List<Skill> Skills { get; set; } = new();

    /// <summary>
    /// Collection of languages
    /// </summary>
    public List<Language> Languages { get; set; } = new();

    /// <summary>
    /// Collection of hobbies
    /// </summary>
    public List<string> Hobbies { get; set; } = new();
}
