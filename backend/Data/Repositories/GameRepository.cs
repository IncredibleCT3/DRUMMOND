using backend.Models;
using MySqlConnector;
using Dapper;

namespace backend.Data.Repositories;

public class GameRepository : IGameRepository
{
    private readonly INbaPlayerRepository _playerRepository;
    private readonly Database _database;
    private List<string> _teamNames = new();

    private readonly List<string> _statCategories = new()
    {
        "All-Stars",
        "MVP Winners",
        "Championship Winners",
        "DPOY Winners",
        "Rookie of the Year Winners",
        "6th Man Award Winners",

        "1+ Championship",
        "2+ Championships",

        "1+ All-Star Selection",
        "3+ All-Star Selections",
        "5+ All-Star Selections",

        "25+ PPG Career",
        "20+ PPG Career",
        "15+ PPG Career",
        "10+ PPG Career",
        "5+ PPG Career",
        "Under 5 PPG Career",

        "10+ RPG Career",
        "8+ RPG Career",
        "5+ RPG Career",
        "3+ RPG Career",
        "Under 3 RPG Career",

        "8+ APG Career",
        "5+ APG Career",
        "3+ APG Career",
        "1+ APG Career",
        "Under 1 APG Career",

        "1.5+ SPG Career",
        "1+ SPG Career",
        "0.5+ SPG Career",

        "1.5+ BPG Career",
        "1+ BPG Career",
        "0.5+ BPG Career",

        "Lottery Pick",
        "Undrafted",

        "Drafted in 2010s",
        "Drafted in 2000s",
        "Drafted in 1990s",
        "Drafted Before 1990",
        "Drafted 2015 or Later",
        "Drafted 2010 or Earlier",

        "10+ Years in League",
        "5-9 Years in League",
        "0-4 Years in League",
        "Rookie (1 Year)",

        "Went to a College with State in its Name",
        "Went to a College with Michigan in its Name",

        "20+ PPG and 5+ APG",
        "10+ RPG and 1+ BPG",
        "5+ APG and 1+ SPG",
        "Champion Without All-Star"
    };

    public GameRepository(INbaPlayerRepository playerRepository, Database database)
    {
        _playerRepository = playerRepository;
        _database = database;
    }

    public async Task InitializeAsync()
    {
        _teamNames = await _playerRepository.GetAllTeamNamesAsync();
    }

    // Get or create today's game from database (based on 1pm EST cutoff)
    public async Task<DailyGame> GetOrCreateTodayGameAsync(string seed)
    {
        var gameDate = GetGameDate();
        
        // Check if game exists for this game date
        var existingGame = await GetGameFromDatabaseAsync(gameDate);
        if (existingGame != null)
        {
            // Validate that the game has all required criteria
            if (IsGameValid(existingGame))
            {
                return existingGame;
            }
            // If game is invalid, delete it and create a new one
            await DeleteGameByDateAsync(gameDate);
        }

        // Generate new game with seed
        var dailyGame = await GenerateDailyGameAsync(seed);
        
        // Save to database
        await SaveDailyGameAsync(dailyGame);
        
        // Clean up old games
        await DeleteOldGamesAsync(gameDate);
        
        return dailyGame;
    }

    // Get the current game date based on 1pm EST cutoff
    private DateTime GetGameDate()
    {
        // Get current time in EST
        var estZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
        var estNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, estZone);
        
        // If it's before 1pm EST, use yesterday's date, otherwise use today's date
        if (estNow.Hour < 13)
        {
            return estNow.AddDays(-1).Date;
        }
        
        return estNow.Date;
    }

    private bool IsGameValid(DailyGame game)
    {
        // Check that all 5 rounds have valid criteria
        return !string.IsNullOrEmpty(game.Round1Category1) && 
               !string.IsNullOrEmpty(game.Round1Category2) &&
               !string.IsNullOrEmpty(game.Round2Category1) && 
               !string.IsNullOrEmpty(game.Round2Category2) &&
               !string.IsNullOrEmpty(game.Round3Category1) && 
               !string.IsNullOrEmpty(game.Round3Category2) &&
               !string.IsNullOrEmpty(game.Round4Category1) && 
               !string.IsNullOrEmpty(game.Round4Category2) &&
               !string.IsNullOrEmpty(game.Round5Category1) && 
               !string.IsNullOrEmpty(game.Round5Category2);
    }

    private async Task<DailyGame?> GetGameFromDatabaseAsync(DateTime date)
    {
        var sql = @"
            SELECT * FROM daily_games 
            WHERE DATE(created_at) = @Date 
            ORDER BY daily_game_id DESC 
            LIMIT 1";

        using var connection = _database.GetConnection();
        var game = await connection.QueryFirstOrDefaultAsync<DailyGame>(sql, new { Date = date.Date });
        return game;
    }

    private async Task DeleteGameByDateAsync(DateTime date)
    {
        var sql = "DELETE FROM daily_games WHERE DATE(created_at) = @Date";
        
        using var connection = _database.GetConnection();
        await connection.ExecuteAsync(sql, new { Date = date.Date });
    }

    private async Task<DailyGame> GenerateDailyGameAsync(string seed)
    {
        // Use seed to create deterministic random
        var random = new Random(GetSeedHash(seed));
        
        if (_teamNames.Count == 0)
        {
            _teamNames = await _playerRepository.GetAllTeamNamesAsync();
        }

        var dailyGame = new DailyGame { CreatedAt = DateTime.Now };
        var allCategories = new List<string>();
        allCategories.AddRange(_teamNames);
        allCategories.AddRange(_statCategories);
        
        var usedCategories = new HashSet<string>();

        // Generate 5 rounds
        for (int round = 1; round <= 5; round++)
        {
            var availableCategories = allCategories.Where(c => !usedCategories.Contains(c)).ToList();
            
            if (availableCategories.Count < 2)
            {
                availableCategories = allCategories; // Reset if needed
                usedCategories.Clear();
            }

            var category1 = availableCategories[random.Next(availableCategories.Count)];
            availableCategories.Remove(category1);
            var category2 = availableCategories[random.Next(availableCategories.Count)];

            usedCategories.Add(category1);
            usedCategories.Add(category2);

            SetRoundCriteria(dailyGame, round, new GameCriteria 
            { 
                Category1 = category1, 
                Category2 = category2 
            });
        }

        return dailyGame;
    }

    private void SetRoundCriteria(DailyGame game, int round, GameCriteria criteria)
    {
        switch (round)
        {
            case 1:
                game.Round1Category1 = criteria.Category1;
                game.Round1Category2 = criteria.Category2;
                break;
            case 2:
                game.Round2Category1 = criteria.Category1;
                game.Round2Category2 = criteria.Category2;
                break;
            case 3:
                game.Round3Category1 = criteria.Category1;
                game.Round3Category2 = criteria.Category2;
                break;
            case 4:
                game.Round4Category1 = criteria.Category1;
                game.Round4Category2 = criteria.Category2;
                break;
            case 5:
                game.Round5Category1 = criteria.Category1;
                game.Round5Category2 = criteria.Category2;
                break;
        }
    }

    private async Task SaveDailyGameAsync(DailyGame game)
    {
        var sql = @"
            INSERT INTO daily_games (
                round1_category1, round1_category2,
                round2_category1, round2_category2,
                round3_category1, round3_category2,
                round4_category1, round4_category2,
                round5_category1, round5_category2,
                created_at
            ) VALUES (
                @Round1Category1, @Round1Category2,
                @Round2Category1, @Round2Category2,
                @Round3Category1, @Round3Category2,
                @Round4Category1, @Round4Category2,
                @Round5Category1, @Round5Category2,
                @CreatedAt
            )";

        using var connection = _database.GetConnection();
        await connection.ExecuteAsync(sql, game);
    }

    private async Task DeleteOldGamesAsync(DateTime keepDate)
    {
        var sql = "DELETE FROM daily_games WHERE DATE(created_at) < @KeepDate";
        
        using var connection = _database.GetConnection();
        await connection.ExecuteAsync(sql, new { KeepDate = keepDate.Date });
    }

    private int GetSeedHash(string seed)
    {
        unchecked
        {
            int hash = 17;
            foreach (char c in seed)
            {
                hash = hash * 31 + c;
            }
            return hash;
        }
    }

    public int CalculatePoints(PlayerStats player)
    {
        // TODO: Implement dynamic point calculation based on player rarity/difficulty
        // For now, everyone gets 500 points
        int points = 500;
        return points;
    }
}