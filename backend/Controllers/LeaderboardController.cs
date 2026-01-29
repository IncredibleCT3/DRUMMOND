using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using backend.Data.Repositories;
using backend.Models;

namespace backend.Controllers
{
    [Route("[controller]")]
    public class LeaderboardController : Controller
    {
        private readonly ILeaderboard _leaderboard;

        public LeaderboardController(ILeaderboard leaderboard)
        {
            _leaderboard = leaderboard;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _leaderboard.GetAllUsersData();
                return Ok(users);
            }
            catch(Exception ex)
            {

                return StatusCode(500, $"Server error: {ex}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                var user = await _leaderboard.GetUserData(id);

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Server error: {ex}");
            }
        }
    }
}