// LocationController.cs


using Microsoft.AspNetCore.Mvc;
using RealtyReachApi.Services;

namespace RealtyReachApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;

        public LocationController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        // [HttpGet("suburbs")]
        // public async Task<IActionResult> GetAllSuburbs()
        // {
        //     var suburbs = await _locationService.GetAllSuburbsAsync();
        //     return Ok(suburbs);
        // }

        [HttpGet("regions")]
        public async Task<IActionResult> GetAllRegions()
        {
            var regions = await _locationService.GetAllRegionsAsync();
            return Ok(regions);
        }

        [HttpGet("states")]
        public async Task<IActionResult> GetAllStates()
        {
            var states = await _locationService.GetAllStatesAsync();
            return Ok(states);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchLocations([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query parameter is required.");
            }

            var results = await _locationService.SearchLocationsAsync(query);
            return Ok(results);
        }
    }

}