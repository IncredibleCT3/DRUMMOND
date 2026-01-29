using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public String Username { get; set; } = string.Empty;
        public String Score { get; set; } = string.Empty;
        public String? Starting5 { get; set; } = string.Empty;
    }
}