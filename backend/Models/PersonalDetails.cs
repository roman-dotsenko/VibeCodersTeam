namespace JobHelper.Models;

/// <summary>
/// Personal details section of a resume
/// </summary>
public class PersonalDetails
{
    /// <summary>
    /// Full name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Desired job position
    /// </summary>
    public string? DesiredJobPosition { get; set; }

    /// <summary>
    /// Email address
    /// </summary>
    public required string EmailAddress { get; set; }

    /// <summary>
    /// Phone number
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// Street address
    /// </summary>
    public string? Address { get; set; }

    /// <summary>
    /// Post code / ZIP code
    /// </summary>
    public string? PostCode { get; set; }

    /// <summary>
    /// City
    /// </summary>
    public string? City { get; set; }

    /// <summary>
    /// Date of birth
    /// </summary>
    public DateOnly? DateOfBirth { get; set; }

    /// <summary>
    /// Driver's license information
    /// </summary>
    public string? DriverLicense { get; set; }

    /// <summary>
    /// Gender
    /// </summary>
    public string? Gender { get; set; }

    /// <summary>
    /// Nationality
    /// </summary>
    public string? Nationality { get; set; }

    /// <summary>
    /// Civil status (Single, Married, etc.)
    /// </summary>
    public string? CivilStatus { get; set; }

    /// <summary>
    /// Personal or portfolio website URL
    /// </summary>
    public string? Website { get; set; }

    /// <summary>
    /// LinkedIn profile URL
    /// </summary>
    public string? LinkedIn { get; set; }

    /// <summary>
    /// Custom fields for additional information
    /// </summary>
    public List<CustomField> CustomFields { get; set; } = new();
}
