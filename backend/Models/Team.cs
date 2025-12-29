using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public List<Player>? Players { get; set; }
    }
}