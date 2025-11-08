namespace JobHelper.Models;

public class Education
{
    public Guid Id { get; set; }

    public required string EducationName { get; set; }

    public required string School { get; set; }

    public string? City { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Description { get; set; }
}
