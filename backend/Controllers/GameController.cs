using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data.Repositories;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GameController : ControllerBase
{
    private readonly IGameRepository _gameRepository;

    public GameController(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    [HttpPost("start")]
    public async Task<IActionResult> StartGame([FromBody] StartGameRequest request)
    {
        try
        {
            // Get or create daily game using the seed (date string like "2026-01-24")
            var dailyGame = await _gameRepository.GetOrCreateTodayGameAsync(request.Seed);
            
            // Return first round criteria AND the full game for cached state restoration
            var criteria = dailyGame.GetCriteriaForRound(1);
            
            return Ok(new
            {
                criteria,
                dailyGame = new
                {
                    round1Category1 = dailyGame.Round1Category1,
                    round1Category2 = dailyGame.Round1Category2,
                    round2Category1 = dailyGame.Round2Category1,
                    round2Category2 = dailyGame.Round2Category2,
                    round3Category1 = dailyGame.Round3Category1,
                    round3Category2 = dailyGame.Round3Category2,
                    round4Category1 = dailyGame.Round4Category1,
                    round4Category2 = dailyGame.Round4Category2,
                    round5Category1 = dailyGame.Round5Category1,
                    round5Category2 = dailyGame.Round5Category2
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("select-player")]
    public async Task<IActionResult> SelectPlayer([FromBody] SelectPlayerRequest request)
    {
        try
        {
            // Client-side already validated criteria match
            // Backend only calculates points
            var points = _gameRepository.CalculatePoints(request.Player);

            // If game is complete, don't return next criteria
            if (request.IsGameComplete)
            {
                return Ok(new 
                { 
                    success = true, 
                    points,
                    gameComplete = true 
                });
            }

            // Get daily game (will use same 1pm EST cutoff logic)
            var dailyGame = await _gameRepository.GetOrCreateTodayGameAsync(request.Seed);
            
            // Calculate next round number
            // FilledPositions has positions already filled BEFORE this selection
            // So if FilledPositions.Count = 0, we just filled round 1, next is round 2
            var nextRound = request.FilledPositions.Count + 2;
            var nextCriteria = dailyGame.GetCriteriaForRound(nextRound);

            return Ok(new 
            { 
                success = true, 
                points, 
                nextCriteria 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

// Request models
public class StartGameRequest
{
    public string Seed { get; set; } = string.Empty;
}

public class SelectPlayerRequest
{
    public PlayerStats Player { get; set; } = new();
    public string Position { get; set; } = string.Empty;
    public bool IsGameComplete { get; set; }
    public GameCriteria Criteria { get; set; } = new();
    public List<string> FilledPositions { get; set; } = new();
    public string Seed { get; set; } = string.Empty;
}