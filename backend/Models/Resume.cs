namespace JobHelper.Models;

public class Resume
{
    public Guid Id { get; set; }

    public required PersonalDetails PersonalDetails { get; set; }

    public List<Education> Educations { get; set; } = new();

    public List<Employment> Employment { get; set; } = new();

    public List<Skill> Skills { get; set; } = new();

    public List<Language> Languages { get; set; } = new();

    public List<string> Hobbies { get; set; } = new();
}
