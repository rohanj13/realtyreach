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
using RealtyReachApi.Helpers;

namespace RealtyReachApi.Controllers
{
    [ApiController]
    [Route("api/jobs/customer")]
    [Authorize(Roles = "Customer")]
    public class CustomerJobController : ControllerBase
    {
        private readonly ICustomerJobService _customerJobService;
        private readonly IMatchingService _matchingService;

        public CustomerJobController(ICustomerJobService customerJobService, IMatchingService matchingService)
        {
            _customerJobService = customerJobService;
            _matchingService = matchingService;
        }

        // GET: api/jobs/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<JobDto>>> GetAllJobsForCustomer(string userId)
        {
            var jobs = await _customerJobService.GetAllJobsForCustomerAsync(new Guid(userId));

            if (jobs.Count > 0)
            {
                return Ok(jobs);
            }

            return NotFound();
        }

        // GET: api/Jobs/{JobId}
        [HttpGet("{jobId}")]
        public async Task<ActionResult<JobDto>> GetJobById(int jobId)
        {
            var job = await _customerJobService.GetJobByIdAsync(jobId);
            if (job == null)
            {
                return NotFound();
            }

            return Ok(job);
        }

        // POST: api/jobs/customer
        [HttpPost]
        public async Task<ActionResult<JobDto>> CreateJob([FromBody] CreateJobDto createJobDto)
        {
            var jobDto = await _customerJobService.CreateJobAsync(createJobDto, Guid.Parse(User.GetUserId()));
            return Ok();
        }

        [HttpPost("finalise")]
        public async Task<ActionResult<MatchingJobDto>> FinalizeMatch(MatchingJobDto matchingJobDto)
        {
            var jobDto = await _matchingService.FinalizeMatchAsync(matchingJobDto);
            return Ok(jobDto);
        }

        // PUT: api/Jobs/{JobId}
        [HttpPut("{JobId}")]
        /* public async Task<IActionResult> UpdateJob(UpdateJobDto updateJobDto)
        {
            var success = await _customerJobService.UpdateJob(updateJobDto);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
        */

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