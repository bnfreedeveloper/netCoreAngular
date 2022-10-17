using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly AppDbContext _dataContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthenticationController(AppDbContext dataContext, UserManager<ApplicationUser> userManag, RoleManager<IdentityRole> roleManager, IConfiguration config, IMapper mapper)
        {
            this._dataContext = dataContext;
            _roleManager = roleManager;
            _userManager = userManag;
            _config = config;
            _mapper = mapper;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(SignupDto register)
        {
            if (!ModelState.IsValid) return BadRequest(new StatusInfo
            {
                Success = false,
                Message = "infos provided are wrong/incomplete"
            });

            var user = await _userManager.FindByNameAsync(register.Name);
            if (user != null)
            {
                return BadRequest(new StatusInfo
                {
                    Success = false,
                    Message = "user already exists"
                });
            }
            var appUser = _mapper.Map<ApplicationUser>(register);
            appUser.SecurityStamp = Guid.NewGuid().ToString();

            //we save the applicationuser with the corresponding password 
            var result = await _userManager.CreateAsync(appUser, register.PassWord);
            if (!result.Succeeded) return BadRequest(new StatusInfo
            {
                Success = false,
                Message = "something went wrong,please try register again"
            });

            //check role user and create it if not exists
            if (!await _roleManager.RoleExistsAsync(UserRoles.User))
            {
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));
            }
            //we add the role of user for the new registered user
            if (await _roleManager.RoleExistsAsync(UserRoles.User))
            {
                var res = await _userManager.AddToRoleAsync(appUser, UserRoles.User);
                if (!res.Succeeded)
                {
                    await _userManager.DeleteAsync(appUser);
                    return BadRequest(new StatusInfo
                    {
                        Success = false,
                        Message = "something went wrong, try register again"
                    });
                }
                return Ok(new StatusInfo
                {
                    Success = true,
                    Message = "registration successfully done"
                });

            }
            return BadRequest(new StatusInfo
            {
                Success = false,
                Message = "something went wrong,please try register again"
            });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            if (!ModelState.IsValid) return BadRequest(new StatusInfo
            {
                Success = false,
                Message = "infos sent were wrong"
            });
            var user = await _userManager.FindByNameAsync(login.UserName);
            if (user == null) return BadRequest(new StatusInfo
            {
                Success = false,
                Message = "infos given wrong"
            });
            var checkPassword = await _userManager.CheckPasswordAsync(user, login.PassWord);
            if (!checkPassword) return BadRequest(new StatusInfo
            {
                Success = false,
                Message = "infos given wrong"
            });

            //if user found and password confirmed
            var userRoles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>(){
                new Claim(ClaimTypes.Name,user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            //we add the role found for the user to the claims
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]));
            var securityToken = new JwtSecurityToken(issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha512),
            //for demo only
            expires: DateTime.Now.AddSeconds(50));
            var token = new JwtSecurityTokenHandler().WriteToken(securityToken);
            return Ok(new ResponseLogin
            {
                Name = user.Name,
                UserName = user.UserName,
                Token = token,
                Expiration = securityToken.ValidTo,
                Success = true,
                Message = "login successfully"
            });
        }
    }
}