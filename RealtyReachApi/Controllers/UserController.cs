using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Models;
using RealtyReachApi.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

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

        private string GetUserIdFromToken()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        private string GetUserRoleFromToken()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value;
        }

        private string GetEmailFromToken()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser()
        {
            var role = GetUserRoleFromToken();
            var userId = Guid.Parse(GetUserIdFromToken());
            var email = GetEmailFromToken();
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
                var customer = new Customer();
                customer.Id = userId;
                customer.Email = email;
                await _customerService.CreateCustomerAsync(customer);
                return Ok("Success");
            }
            else if (role == "Professional")
            {
                var professional = new Professional();
                professional.Id = userId;
                professional.Email = email;
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
            var role = GetUserRoleFromToken();
            var userId = Guid.Parse(GetUserIdFromToken());

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
                var professional = await _professionalService.GetProfessionalAsync(userId);
                if (professional == null) return NotFound();
                return Ok(professional);
            }
            else
            {
                return BadRequest("Invalid role.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] object userDto)
        {
            var role = GetUserRoleFromToken();
            var userId = Guid.Parse(GetUserIdFromToken());

            if (role == "Admin")
            {
                var admin = userDto as Admin;
                await _adminService.UpdateAdminAsync(userId, admin);
                return Ok("Admin updated successfully.");
            }
            else if (role == "Customer")
            {
                var customer = userDto as Customer;
                await _customerService.UpdateCustomerAsync(userId, customer);
                return Ok("Customer updated successfully.");
            }
            else if (role == "Professional")
            {
                var professional = userDto as Professional;
                await _professionalService.UpdateProfessionalAsync(userId, professional);
                return Ok("Professional updated successfully.");
            }
            else
            {
                return BadRequest("Invalid role.");
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser()
        {
            var role = GetUserRoleFromToken();
            var userId = Guid.Parse(GetUserIdFromToken());

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