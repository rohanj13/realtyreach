// JobController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Models;
using RealtyReachApi.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RealtyReachApi.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<UserDto>> GetUser(string userId)
        {
            var user = await _userService.GetUser(userId);
            // var userId = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value; // Auth0 user ID
            var email = User.Claims.FirstOrDefault(c => c.Type == "email")?.Value; // Auth0 email
            var clientId = User.Claims.FirstOrDefault(c => c.Type == "azp")?.Value; // Auth0 client ID (azp)

            if (user == null)
            {
                var createdUser = await _userService.CreateUser(userId, email, clientId);
                return Ok(createdUser);
            }
            else
            {
                return Ok(user);
            }
        }

        // POST: api/user
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value; // Auth0 user ID
            var email = User.Claims.FirstOrDefault(c => c.Type == "email")?.Value; // Auth0 email
            var clientId = User.Claims.FirstOrDefault(c => c.Type == "azp")?.Value; // Auth0 client ID (azp)
            var userDto = await _userService.CreateUser(userId, email, clientId);
            return Ok(userDto);
        }

        // PUT: api/user/{userId}
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, UpdateUserDto updateUserDto)
        {
            var success = await _userService.UpdateUser(userId, updateUserDto);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/user/{userId}
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var success = await _userService.DeleteUser(userId);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
