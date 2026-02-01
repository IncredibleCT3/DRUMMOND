using backend.Models;

namespace backend.Data.Repositories;

public interface IGameRepository
{
    Task InitializeAsync();
    Task<DailyGame> GetOrCreateTodayGameAsync(string seed);
    int CalculatePoints(PlayerStats player);
}