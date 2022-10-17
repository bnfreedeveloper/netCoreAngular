using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos
{
    public class StatusInfo
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}