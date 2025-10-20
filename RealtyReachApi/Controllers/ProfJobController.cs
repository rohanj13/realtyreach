// ProfessionalController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Models;
using RealtyReachApi.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using RealtyReachApi.Dtos;
using System.Security.Claims;

namespace RealtyReachApi.Controllers
{
    [ApiController]
    [Route("api/jobs/professional")]
    [Authorize(Roles = "Professional")]
    public class ProfJobController : ControllerBase
    {
        private readonly IProfJobService _profJobService;

        public ProfJobController(IProfJobService professionalService)
        {
            _profJobService = professionalService;
        }

        // GET: api/jobs/professional/finalised
        [HttpGet("finalised")]
        public async Task<ActionResult<List<GetFinalisedJobDto>>> GetFinalisedJobsForProfessional()
        {
            var professionalIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(professionalIdStr) || !Guid.TryParse(professionalIdStr, out var professionalId))
            {
                return Unauthorized();
            }
            var jobs = await _profJobService.GetFinalisedJobsForProfessionalAsync(professionalId);
            if (jobs.Count > 0)
            {
                return Ok(jobs);
            }
            return NotFound();
        }
    }
}
