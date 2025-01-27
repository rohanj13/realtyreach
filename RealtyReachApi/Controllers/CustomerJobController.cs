// JobController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Models;
using RealtyReachApi.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using RealtyReachApi.Dtos;

namespace RealtyReachApi.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    [Authorize(Roles = "Customer")]
    public class CustomerJobController : ControllerBase
    {
        private readonly ICustomerJobService _customerJobService;

        public CustomerJobController(ICustomerJobService customerJobService)
        {
            _customerJobService = customerJobService;
        }

        // GET: api/jobs/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<JobDto>>> GetAllJobsForCustomer(string userId)
        {
            var jobs = await _customerJobService.GetAllJobsForCustomer(new Guid(userId));

            if (jobs.Count > 0)
            {
                return Ok(jobs);
            }

            return NotFound();
        }

        // GET: api/Jobs/{JobId}
        [HttpGet("{JobId}")]
        public async Task<ActionResult<JobDto>> GetJobById(int JobId)
        {
            var job = await _customerJobService.GetJobById(JobId);
            if (job == null)
            {
                return NotFound();
            }

            return Ok(job);
        }

        // POST: api/Jobs
        [HttpPost]
        public async Task<ActionResult<JobDto>> CreateJob(CreateJobDto createJobDto)
        {
            // var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var jobDto = await _customerJobService.CreateJobAsync(createJobDto);
            return Ok();
        }

        // PUT: api/Jobs/{JobId}
        [HttpPut("{JobId}")]
        public async Task<IActionResult> UpdateJob(UpdateJobDto updateJobDto)
        {
            var success = await _customerJobService.UpdateJob(updateJobDto);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        // // PUT: api/Jobs/{JobId}/NextStage
        // [HttpPut("{JobId}/nextstage")]
        // public async Task<IActionResult> ProgressJob(int JobId, UpdateJobDto updateJobDto, string newJourneyProgress)
        // {
        //     var success = await _userJobService.ProgressJob(JobId, updateJobDto, newJourneyProgress);
        //     if (!success)
        //     {
        //         return NotFound();
        //     }

        //     return NoContent();
        // }

        // DELETE: api/Jobs/{JobId}
        [HttpDelete("{JobId}")]
        public async Task<IActionResult> DeleteJob(int JobId)
        {
            var success = await _customerJobService.DeleteJob(JobId);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
