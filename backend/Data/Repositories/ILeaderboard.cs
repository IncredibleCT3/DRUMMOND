using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Data.Repositories
{
    public interface ILeaderboard
    {
        Task<IEnumerable<User>> GetAllUsersData();
        Task<IEnumerable<User>> GetUserData(int id);
    }
}