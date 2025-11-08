namespace JobHelper.ApiModels;

/// <summary>
/// Represents a custom key-value field
/// </summary>
public class CustomField
{
    /// <summary>
    /// Field label/name
    /// </summary>
    public required string Label { get; set; }

    /// <summary>
    /// Field value
    /// </summary>
    public required string Value { get; set; }
}
