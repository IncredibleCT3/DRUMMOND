using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Dapper;

namespace backend.Data.Repositories
{
    public class Leaderboard : ILeaderboard
    {
        private readonly Database _database;

        public Leaderboard(Database database)
        {
            _database = database;
        }

        private async Task<IEnumerable<User>> GetAllUsers()
        {
            var sql = "SELECT * FROM leaderboard";
            using var connection = _database.GetConnection();
            return await connection.QueryAsync<User>(sql);           
        }
}