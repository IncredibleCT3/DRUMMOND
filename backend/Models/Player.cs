using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int TeamId { get; set; }
        public Team? Team { get; set; }
    }
}