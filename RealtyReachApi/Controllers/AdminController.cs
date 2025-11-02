using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Services;

namespace RealtyReachApi.Controllers;

[ApiController]
[Route("api/admin/")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IProfessionalService _professionalService;
    private readonly IAdminService _adminService;

    public AdminController(IProfessionalService professionalService, IAdminService adminService)
    {
        _professionalService = professionalService;
        _adminService = adminService;
    }

    /// <summary>
    /// Marks a professional as verified (sets VerificationStatus = true).
    /// </summary>
    [HttpPut("professionals/{id}/verify")]
    public async Task<IActionResult> VerifyProfessional([FromRoute] Guid id)
    {
        try
        {
            await _professionalService.VerifyProfessionalAsync(id, null);
            return Ok(new { ProfessionalId = id, VerificationStatus = true });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Error = ex.Message });
        }
    }

    /// <summary>
    /// Marks a professional as unverified/rejected (sets VerificationStatus = false).
    /// </summary>
    [HttpPut("professionals/{id}/reject")]
    public async Task<IActionResult> RejectProfessional([FromRoute] Guid id)
    {
        try
        {
            await _professionalService.UnverifyProfessionalAsync(id, null);
            return Ok(new { ProfessionalId = id, VerificationStatus = false });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Error = ex.Message });
        }
    }
    [HttpGet("professionals")]
    public async Task<IActionResult> GetProfessionals()
    {
        try
        {
            var professionals = await _adminService.GetAllProfessionalsAsync();
            return Ok(professionals);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Error = ex.Message });
        }
    }

    [HttpGet("customers")]
    public async Task<IActionResult> GetCustomers()
    {
        try
        {
            var customers = await _adminService.GetAllCustomersAsync();
            return Ok(customers);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Error = ex.Message });
        }
    }

    [HttpGet("jobs")]
    public async Task<IActionResult> GetJobs()
    {
        try
        {
            var jobs = await _adminService.GetAllJobsAsync();
            return Ok(jobs);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Error = ex.Message });
        }
    }
}


