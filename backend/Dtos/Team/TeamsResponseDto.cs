using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Dtos.Team
{
    public class TeamsResponseDto
    {
        public List<CreateTeamDto> Data { get; set; } = new List<CreateTeamDto>();
    }
}
