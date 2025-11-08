namespace JobHelper.Models;

public class User
{
    public Guid Id { get; set; }

    public required string Email { get; set; }

    public List<Resume> Resumes { get; set; } = new();
}
