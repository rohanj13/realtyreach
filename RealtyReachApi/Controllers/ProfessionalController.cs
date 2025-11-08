using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Dtos;
using RealtyReachApi.Services;
using System.Security.Claims;

namespace RealtyReachApi.Controllers
{
    [Authorize(Roles = "Professional")]
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

        /// <summary>
        /// Gets the authenticated professional's profile data.
        /// Used to pre-populate edit forms and display profile information.
        /// </summary>
        /// <returns>Professional profile DTO</returns>
        /// <response code="200">Profile retrieved successfully</response>
        /// <response code="404">Professional not found</response>
        /// <response code="500">Internal server error</response>
        [HttpGet]
        [ProducesResponseType(typeof(ProfessionalDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetProfessional()
        {
            var userId = Guid.Parse(GetUserIdFromToken());
            
            try
            {
                var professional = await _professionalService.GetProfessionalByIdAsync(userId);
                
                return Ok(professional);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { Error = "An error occurred while retrieving the professional profile.", Details = ex.Message });
            }
        }

        /// <summary>
        /// Updates professional profile with partial data.
        /// Used during profile completion and profile editing.
        /// Supports professional type changes for Feature 4.5.
        /// </summary>
        /// <param name="updateDto">DTO containing fields to update (all optional)</param>
        /// <returns>Success message with updated professional data</returns>
        /// <response code="200">Profile updated successfully</response>
        /// <response code="400">Invalid professional type or validation error</response>
        /// <response code="404">Professional not found</response>
        /// <response code="500">Internal server error during update</response>
        [HttpPut]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateProfessional([FromBody] UpdateProfessionalDto updateDto)
        {
            var userId = Guid.Parse(GetUserIdFromToken());
            
            try
            {
                await _professionalService.UpdateProfessionalAsync(userId, updateDto);
                
                // Fetch updated profile to return to client
                var updatedProfile = await _professionalService.GetProfessionalByIdAsync(userId);
                
                return Ok(new 
                { 
                    Message = "Professional profile updated successfully.",
                    Professional = updatedProfile
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception (if logging is configured)
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { Error = "An error occurred while updating the professional profile.", Details = ex.Message });
            }
        }

        /// <summary>
        /// Gets the authenticated professional's full profile data including professional type details.
        /// Used for comprehensive profile display page (Feature 4.2.5).
        /// </summary>
        /// <returns>Full professional profile DTO with type information</returns>
        /// <response code="200">Full profile retrieved successfully</response>
        /// <response code="404">Professional not found</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("profile")]
        [ProducesResponseType(typeof(ProfessionalProfileDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetProfessionalProfile()
        {
            var userId = Guid.Parse(GetUserIdFromToken());
            
            try
            {
                var professionalProfile = await _professionalService.GetProfessionalProfileAsync(userId);
                
                if (professionalProfile == null)
                {
                    return NotFound(new { Error = "Professional profile not found." });
                }
                
                return Ok(professionalProfile);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { Error = "An error occurred while retrieving the professional profile.", Details = ex.Message });
            }
        }

        /// <summary>
        /// Gets a professional's profile by ID.
        /// Used by customers to view professional profiles when matching jobs.
        /// Requires authentication - accessible to customers, professionals, and admins.
        /// </summary>
        /// <param name="id">The professional's unique identifier</param>
        /// <returns>Full professional profile DTO with type information</returns>
        /// <response code="200">Profile retrieved successfully</response>
        /// <response code="401">Unauthorized - user must be authenticated</response>
        /// <response code="404">Professional not found</response>
        /// <response code="500">Internal server error</response>
        [HttpGet("{id}")]
        [AllowAnonymous]
        [Authorize(Roles = "Customer,Professional,Admin")]
        [ProducesResponseType(typeof(ProfessionalProfileDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetProfessionalById(Guid id)
        {
            try
            {
                var professionalProfile = await _professionalService.GetProfessionalProfileAsync(id);
                
                if (professionalProfile == null)
                {
                    return NotFound(new { Error = "Professional profile not found." });
                }
                
                return Ok(professionalProfile);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { Error = "An error occurred while retrieving the professional profile.", Details = ex.Message });
            }
        }
    }
}