// JobController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Models;
using RealtyReachApi.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RealtyReachApi.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    [Authorize(Roles = "Customer")]
    public class UserJobController : ControllerBase
    {
        private readonly IUserJobService _userJobService;

        public UserJobController(IUserJobService userJobService)
        {
            _userJobService = userJobService;
        }

        // GET: api/jobs/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<JobDto>>> GetAllJobsForUser(string userId)
        {
            var jobs = await _userJobService.GetAllJobsForUser(userId);

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
            var job = await _userJobService.GetJobById(JobId);
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
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var jobDto = await _userJobService.CreateJob(createJobDto, id);
            return Ok();
        }

        // PUT: api/Jobs/{JobId}
        [HttpPut("{JobId}")]
        public async Task<IActionResult> UpdateJob(int JobId, UpdateJobDto updateJobDto)
        {
            var success = await _userJobService.UpdateJob(JobId, updateJobDto);
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
            var success = await _userJobService.DeleteJob(JobId);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
