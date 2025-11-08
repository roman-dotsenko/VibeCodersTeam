namespace JobHelper.Mappers;

public static class UserMapper
{
    public static ApiModels.User ToApiModel(this Models.User domain)
    {
        return new ApiModels.User
        {
            Id = domain.Id,
            Email = domain.Email,
            Resumes = domain.Resumes.Select(r => r.ToApiModel()).ToList()
        };
    }

    public static Models.User ToDomainModel(this ApiModels.User api)
    {
        return new Models.User
        {
            Id = api.Id,
            Email = api.Email,
            Resumes = api.Resumes.Select(r => r.ToDomainModel()).ToList()
        };
    }
}
