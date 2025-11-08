namespace JobHelper.Models;

public class Employment
{
    public Guid Id { get; set; }

    public required string JobTitle { get; set; }

    public required string Employer { get; set; }

    public string? City { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Description { get; set; }
}
