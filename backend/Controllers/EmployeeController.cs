using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> getAllEmployees()
        {
            var employees = new List<Employee>(){
            new Employee{
                Id=1,Name="jean",Email="j@gmail.com",DepartmentId=2
            },
            new Employee{
                Id=2,Name="pierre",Email="jpier@gmail.com",DepartmentId=1
            },
            new Employee{
                Id=3,Name="dux",Email="duke@gmail.com",DepartmentId=3
            }
         };

            //we simulate a call to the database
            return Ok(await Task.FromResult(employees));
            //for testing
            //return Ok(new List<Employee>());
        }

        [HttpGet("test")]
        [Authorize(Policy = "adminOnly")]
        public IActionResult get()
        {
            return Ok("ok it works just fine!");
        }
    }
}