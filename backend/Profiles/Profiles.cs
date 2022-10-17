using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using backend.Dtos;
using backend.Models;

namespace backend.Profiles
{
    public class Profiles : Profile
    {
        public Profiles()
        {
            CreateMap<SignupDto, ApplicationUser>();
            // CreateMap<LoginDto, ApplicationUser>();
        }
    }
}