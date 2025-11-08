namespace JobHelper.Models;

public class PersonalDetails
{
    public required string Name { get; set; }

    public string? DesiredJobPosition { get; set; }

    public required string EmailAddress { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public string? PostCode { get; set; }

    public string? City { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? DriverLicense { get; set; }

    public string? Gender { get; set; }

    public string? Nationality { get; set; }

    public string? CivilStatus { get; set; }

    public string? Website { get; set; }

    public string? LinkedIn { get; set; }

    public List<CustomField> CustomFields { get; set; } = new();
}
