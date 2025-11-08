namespace JobHelper.Mappers;

public static class ResumeMapper
{
    public static ApiModels.Resume ToApiModel(this Models.Resume domain)
    {
        return new ApiModels.Resume
        {
            Id = domain.Id,
            PersonalDetails = domain.PersonalDetails.ToApiModel(),
            Educations = domain.Educations.Select(e => e.ToApiModel()).ToList(),
            Employment = domain.Employment.Select(e => e.ToApiModel()).ToList(),
            Skills = domain.Skills.Select(s => s.ToApiModel()).ToList(),
            Languages = domain.Languages.Select(l => l.ToApiModel()).ToList(),
            Hobbies = new List<string>(domain.Hobbies)
        };
    }

    public static Models.Resume ToDomainModel(this ApiModels.Resume api)
    {
        return new Models.Resume
        {
            Id = api.Id,
            PersonalDetails = api.PersonalDetails.ToDomainModel(),
            Educations = api.Educations.Select(e => e.ToDomainModel()).ToList(),
            Employment = api.Employment.Select(e => e.ToDomainModel()).ToList(),
            Skills = api.Skills.Select(s => s.ToDomainModel()).ToList(),
            Languages = api.Languages.Select(l => l.ToDomainModel()).ToList(),
            Hobbies = new List<string>(api.Hobbies)
        };
    }

    public static ApiModels.PersonalDetails ToApiModel(this Models.PersonalDetails domain)
    {
        return new ApiModels.PersonalDetails
        {
            Name = domain.Name,
            DesiredJobPosition = domain.DesiredJobPosition,
            EmailAddress = domain.EmailAddress,
            PhoneNumber = domain.PhoneNumber,
            Address = domain.Address,
            PostCode = domain.PostCode,
            City = domain.City,
            DateOfBirth = domain.DateOfBirth,
            DriverLicense = domain.DriverLicense,
            Gender = domain.Gender,
            Nationality = domain.Nationality,
            CivilStatus = domain.CivilStatus,
            Website = domain.Website,
            LinkedIn = domain.LinkedIn,
            CustomFields = domain.CustomFields.Select(cf => cf.ToApiModel()).ToList()
        };
    }

    public static Models.PersonalDetails ToDomainModel(this ApiModels.PersonalDetails api)
    {
        return new Models.PersonalDetails
        {
            Name = api.Name,
            DesiredJobPosition = api.DesiredJobPosition,
            EmailAddress = api.EmailAddress,
            PhoneNumber = api.PhoneNumber,
            Address = api.Address,
            PostCode = api.PostCode,
            City = api.City,
            DateOfBirth = api.DateOfBirth,
            DriverLicense = api.DriverLicense,
            Gender = api.Gender,
            Nationality = api.Nationality,
            CivilStatus = api.CivilStatus,
            Website = api.Website,
            LinkedIn = api.LinkedIn,
            CustomFields = api.CustomFields.Select(cf => cf.ToDomainModel()).ToList()
        };
    }

    public static ApiModels.Education ToApiModel(this Models.Education domain)
    {
        return new ApiModels.Education
        {
            Id = domain.Id,
            EducationName = domain.EducationName,
            School = domain.School,
            City = domain.City,
            StartDate = domain.StartDate,
            EndDate = domain.EndDate,
            Description = domain.Description
        };
    }

    public static Models.Education ToDomainModel(this ApiModels.Education api)
    {
        return new Models.Education
        {
            Id = api.Id,
            EducationName = api.EducationName,
            School = api.School,
            City = api.City,
            StartDate = api.StartDate,
            EndDate = api.EndDate,
            Description = api.Description
        };
    }

    public static ApiModels.Employment ToApiModel(this Models.Employment domain)
    {
        return new ApiModels.Employment
        {
            Id = domain.Id,
            JobTitle = domain.JobTitle,
            Employer = domain.Employer,
            City = domain.City,
            StartDate = domain.StartDate,
            EndDate = domain.EndDate,
            Description = domain.Description
        };
    }

    public static Models.Employment ToDomainModel(this ApiModels.Employment api)
    {
        return new Models.Employment
        {
            Id = api.Id,
            JobTitle = api.JobTitle,
            Employer = api.Employer,
            City = api.City,
            StartDate = api.StartDate,
            EndDate = api.EndDate,
            Description = api.Description
        };
    }

    public static ApiModels.Skill ToApiModel(this Models.Skill domain)
    {
        return new ApiModels.Skill
        {
            Name = domain.Name,
            Level = domain.Level.ToApiModel()
        };
    }

    public static Models.Skill ToDomainModel(this ApiModels.Skill api)
    {
        return new Models.Skill
        {
            Name = api.Name,
            Level = api.Level.ToDomainModel()
        };
    }

    public static ApiModels.Language ToApiModel(this Models.Language domain)
    {
        return new ApiModels.Language
        {
            Name = domain.Name,
            Level = domain.Level.ToApiModel()
        };
    }

    public static Models.Language ToDomainModel(this ApiModels.Language api)
    {
        return new Models.Language
        {
            Name = api.Name,
            Level = api.Level.ToDomainModel()
        };
    }

    public static ApiModels.Level ToApiModel(this Models.Level domain)
    {
        return new ApiModels.Level
        {
            Value = domain.Value,
            Description = domain.Description
        };
    }

    public static Models.Level ToDomainModel(this ApiModels.Level api)
    {
        return new Models.Level
        {
            Value = api.Value,
            Description = api.Description
        };
    }

    public static ApiModels.CustomField ToApiModel(this Models.CustomField domain)
    {
        return new ApiModels.CustomField
        {
            Label = domain.Label,
            Value = domain.Value
        };
    }

    public static Models.CustomField ToDomainModel(this ApiModels.CustomField api)
    {
        return new Models.CustomField
        {
            Label = api.Label,
            Value = api.Value
        };
    }
}
