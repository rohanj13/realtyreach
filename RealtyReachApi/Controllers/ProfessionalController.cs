using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Models;
using RealtyReachApi.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace RealtyReachApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfessionalController : ControllerBase
    {
        private readonly IProfessionalService _professionalService;

        public ProfessionalController(
            IProfessionalService professionalService)
        {
            _professionalService = professionalService;
        }
        private string GetUserIdFromToken()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfessional([FromBody] Professional professional)
        {
            var userId = Guid.Parse(GetUserIdFromToken());
            await _professionalService.UpdateProfessionalAsync(userId, professional);
            return Ok("Professional updated successfully.");
        }
    }
}