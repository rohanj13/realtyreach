using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Models;
using RealtyReachApi.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using RealtyReachApi.Dtos;
using RealtyReachApi.Helpers;

namespace RealtyReachApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ICustomerService _customerService;
        private readonly IProfessionalService _professionalService;

        public UserController(
            IAdminService adminService,
            ICustomerService customerService,
            IProfessionalService professionalService)
        {
            _adminService = adminService;
            _customerService = customerService;
            _professionalService = professionalService;
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateUser()
        {
            var role = User.GetUserRole();
            var userId = Guid.Parse(User.GetUserId());
            var email = User.GetUserEmail();
            if (role == "Admin")
            {
                var admin = new Admin(); //update this to use DTO
                admin.Id = userId;
                admin.Email = email;
                await _adminService.CreateAdminAsync(admin);
                return Ok("Success"); //return a dto object on success
            }
            else if (role == "Customer")
            {
                var customer = new CustomerDto
                {
                    Id = userId,
                    Email = email,
                    FirstLogin = true
                };
                await _customerService.CreateCustomerAsync(customer);
                return Ok("Success");
            }
            else if (role == "Professional")
            {
                var professional = new ProfessionalDto
                {
                    Id = userId,
                    Email = email,
                    ProfessionalType = "Advocate", //TODO: Accept Values from frontend
                    FirstLogin = true
                };
                await _professionalService.CreateProfessionalAsync(professional);
                return Ok("Success");
            }
            else
            {
                return BadRequest("Invalid role.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUser()
        {
            var role = User.GetUserRole();
            var userId = Guid.Parse(User.GetUserId());

            if (role == "Admin")
            {
                var admin = await _adminService.GetAdminAsync(userId);
                if (admin == null) return NotFound();
                return Ok(admin);
            }
            else if (role == "Customer")
            {
                var customer = await _customerService.GetCustomerAsync(userId);
                if (customer == null) return NotFound();
                return Ok(customer);
            }
            else if (role == "Professional")
            {
                var professional = await _professionalService.GetProfessionalByIdAsync(userId);
                if (professional == null) return NotFound();
                return Ok(professional);
            }
            else
            {
                return BadRequest("Invalid role.");
            }
        }
        
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var role = User.GetUserRole();
            var userId = Guid.Parse(User.GetUserId());

            if (role == "Customer")
            {
                var customerProfile = await _customerService.GetCustomerProfileAsync(userId);
                if (customerProfile == null) return NotFound();
                return Ok(customerProfile);
            }

            if (role == "Professional")
            {
                var professionalProfile = await _professionalService.GetProfessionalProfileAsync(userId);
                if (professionalProfile == null) return NotFound();
                return Ok(professionalProfile);
            }

            if (role == "Admin")
            {
                var admin = await _adminService.GetAdminAsync(userId);
                if (admin == null) return NotFound();
                return Ok(admin);
            }

            return BadRequest("Invalid role.");
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCustomer([FromBody] CustomerDto customer)
        {
            var role = User.GetUserRole();
            var userId = Guid.Parse(User.GetUserId());
            
            // if (role == "Admin")
            // {
            //     var admin = userDto as Admin;
            //     await _adminService.UpdateAdminAsync(userId, admin);
            //     return Ok("Admin updated successfully.");
            // }
            // if (role == "Customer")
            // {
            // var customer = userDto as Customer;
            await _customerService.UpdateCustomerAsync(customer, userId);
            return Ok("Customer updated successfully.");
            // }
            // else if (role == "Professional")
            // {
            //     var professional = userDto as Professional;
            //     await _professionalService.UpdateProfessionalAsync(userId, professional);
            //     return Ok("Professional updated successfully.");
            // }
            // else
            // {
            //     return BadRequest("Invalid role.");
            // }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser()
        {
            var role = User.GetUserRole();
            var userId = Guid.Parse(User.GetUserId());

            if (role == "Admin")
            {
                await _adminService.DeleteAdminAsync(userId);
                return Ok("Admin deleted successfully.");
            }
            else if (role == "Customer")
            {
                await _customerService.DeleteCustomerAsync(userId);
                return Ok("Customer deleted successfully.");
            }
            else if (role == "Professional")
            {
                await _professionalService.DeleteProfessionalAsync(userId);
                return Ok("Professional deleted successfully.");
            }
            else
            {
                return BadRequest("Invalid role.");
            }
        }
    }
}