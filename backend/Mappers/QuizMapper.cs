namespace JobHelper.Mappers;

public static class QuizMapper
{
    public static ApiModels.Quiz ToApiModel(this Models.Quiz domain)
    {
        return new ApiModels.Quiz
        {
            QuizId = domain.QuizId,
            QuizScore = domain.QuizScore
        };
    }

    public static Models.Quiz ToDomainModel(this ApiModels.Quiz api)
    {
        return new Models.Quiz
        {
            QuizId = api.QuizId,
            QuizScore = api.QuizScore
        };
    }
}
