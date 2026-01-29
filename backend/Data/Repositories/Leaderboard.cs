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

        public async Task<IEnumerable<User>> GetAllUsersData()
        {
            var sql = "SELECT * FROM leaderboard";
            using var connection = _database.GetConnection();
            return await connection.QueryAsync<User>(sql);           
        }

        public async Task<IEnumerable<User>> GetUserData(int id)
        {
            var sql = @$"
            SELECT * FROM leaderboard
            WHERE id = {id}
            ";

            using var connection = _database.GetConnection();
            return (await connection.QueryAsync<User>(sql)).ToList();
        }
    }
}