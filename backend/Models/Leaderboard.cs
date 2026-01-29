using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;

namespace backend.Models
{
    public class Leaderboard
    {
        public int Starting5 { get; set; }
        public List<String> Users { get; set; } = new();
    }
}