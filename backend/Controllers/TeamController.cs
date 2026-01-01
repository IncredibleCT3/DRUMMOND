using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using System.Net.Http;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Dtos.Team;

namespace backend.Controllers
{
    [Route("api/team")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TeamController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var teams = await _context.Team.ToListAsync();

            return Ok(teams);
        }

        [HttpPost("insert")]
        public async Task<IActionResult> InsertTeams()
        {
            var client = new HttpClient();

            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue(
                    "Bearer",
                    $"{Environment.GetEnvironmentVariable("API_Key")}"
                );
            var json = await client.GetStringAsync("https://api.balldontlie.io/v1/teams");

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var teamsResponse = JsonSerializer.Deserialize<TeamsResponseDto>(json, options);

            if (teamsResponse == null)
            {
                return NotFound();
            }

            foreach (var teamDto in teamsResponse.Data)
            {
                var team = new Team
                {
                    TeamId = teamDto.TeamId,
                    Conference = teamDto.Conference,
                    Division = teamDto.Division,
                    City = teamDto.City,
                    Name = teamDto.Name,
                    FullName = teamDto.FullName,
                    Abbreviation = teamDto.Abbreviation
                };
                await _context.Team.AddAsync(team);
            }
            await _context.SaveChangesAsync();
            return Ok(teamsResponse);
        }

        [HttpDelete("delete-all")]
        public async Task<IActionResult> DeleteAll()
        {
            var players = await _context.Player.ToListAsync();
            _context.Player.RemoveRange(players);

            var teams = await _context.Team.ToListAsync();
            _context.Team.RemoveRange(teams);

            await _context.SaveChangesAsync();

            await _context.Database.ExecuteSqlRawAsync("ALTER TABLE Player AUTO_INCREMENT = 1");
            await _context.Database.ExecuteSqlRawAsync("ALTER TABLE Team AUTO_INCREMENT = 1");

            return Ok(new { message = "All teams and players deleted successfully", teamsDeleted = teams.Count, playersDeleted = players.Count });
        }

    }
}