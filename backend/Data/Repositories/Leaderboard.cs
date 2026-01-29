using backend.Models;
using Dapper;
using Microsoft.AspNetCore.Http;

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

        public async Task<User> GetUserData(int id)
        {
            var sql = @$"
            SELECT * FROM leaderboard
            WHERE id = {id}
            ";

            using var connection = _database.GetConnection();
            return (await connection.QueryAsync<User>(sql)).FirstOrDefault();
        }

        public async Task<User> DeleteUserData(int id)
        {
            var sql = @$"
            DELETE FROM leaderboard
            WHERE id = {id}
            ";

            using var connection = _database.GetConnection();
            return (await connection.QueryAsync<User>(sql)).FirstOrDefault();
        }
    }
}