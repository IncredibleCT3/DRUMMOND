using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Dtos.Team
{
    public class CreateTeamDto
    {
        [JsonPropertyName("id")]
        public int TeamId { get; set; }
        public string? Conference { get; set; } = string.Empty;
        public string? Division { get; set; } = string.Empty;
        public string? City { get; set; } = string.Empty;
        public string? Name { get; set; } = string.Empty;
        [JsonPropertyName("full_name")]
        public string? FullName { get; set; } = string.Empty;
        public string? Abbreviation { get; set; } = string.Empty;
    }
}