// ProfessionalController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Models;
using RealtyReachApi.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RealtyReachApi.Controllers
{
    [ApiController]
    [Route("api/professionals")]
    [Authorize(Roles = "Professional")]
    public class ProfJobController : ControllerBase
    {
        private readonly IProfJobService _profJobService;

        public ProfJobController(IProfJobService professionalService)
        {
            _profJobService = professionalService;
        }

        // GET: api/professionals/{professionalId}/applicable-jobs
        [HttpGet("{professionalId}/availablejobs")]
        public async Task<ActionResult<List<JobDto>>> GetApplicableJobsForProfessional(int professionalId)
        {
            var jobs = await _profJobService.GetApplicableJobsForProfessional(professionalId);

            if (jobs.Count > 0)
            {
                return Ok(jobs);
            }

            return NotFound();
        }
    }
}
