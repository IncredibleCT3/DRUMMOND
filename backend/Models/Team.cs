using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Team
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public string? Conference { get; set; } = string.Empty;
        public string Division { get; set; } = string.Empty;
        public string? City { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Abbreviation { get; set; } = string.Empty;
    }
}