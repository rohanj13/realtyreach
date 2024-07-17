using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;
using RealtyReachApi.Models;

namespace RealtyReachApi.Controllers
{
    [ApiController]
    [Route("api/requests")]
    public class RequestController : ControllerBase
    {
        private readonly SharedDbContext _context;

        public RequestController(SharedDbContext context)
        {
            _context = context;
        }

        // GET: api/requests/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<RequestDto>>> GetAllRequestsForUser(int userId)
        {
            var requests = await _context.Requests
                .Include(r => r.RequestDetails)
                .Where(r => r.UserId == userId)
                .Select(r => new RequestDto
                {
                    RequestId = r.RequestId,
                    UserId = r.UserId,
                    RequestType = r.RequestType,
                    AdditionalDetails = r.AdditionalDetails,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    RequestDetail = new RequestDetailDto
                    {
                        RequestDetailId = r.RequestDetails.RequestDetailId,
                        RequestId = r.RequestId,
                        LocationOrPostCode = r.RequestDetails.LocationOrPostCode,
                        PurchaseType = r.RequestDetails.PurchaseType,
                        PropertyType = r.RequestDetails.PropertyType,
                        JourneyProgress = r.RequestDetails.JourneyProgress,
                        BudgetMin = r.RequestDetails.BudgetMin,
                        BudgetMax = r.RequestDetails.BudgetMax,
                        ContactEmail = r.RequestDetails.ContactEmail,
                        ContactPhone = r.RequestDetails.ContactPhone
                    }
                })
                .ToListAsync();

            if (requests.Count > 0)
            {
                return Ok(requests);
            }

            return NotFound();
        }

        // GET: api/requests/{requestId}
        [HttpGet("{requestId}")]
        public async Task<ActionResult<RequestDto>> GetRequestById(int requestId)
        {
            var request = await _context.Requests
                .Include(r => r.RequestDetails)
                .Where(r => r.RequestId == requestId)
                .Select(r => new RequestDto
                {
                    RequestId = r.RequestId,
                    UserId = r.UserId,
                    RequestType = r.RequestType,
                    AdditionalDetails = r.AdditionalDetails,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    RequestDetail = new RequestDetailDto
                    {
                        RequestDetailId = r.RequestDetails.RequestDetailId,
                        RequestId = r.RequestId,
                        LocationOrPostCode = r.RequestDetails.LocationOrPostCode,
                        PurchaseType = r.RequestDetails.PurchaseType,
                        PropertyType = r.RequestDetails.PropertyType,
                        JourneyProgress = r.RequestDetails.JourneyProgress,
                        BudgetMin = r.RequestDetails.BudgetMin,
                        BudgetMax = r.RequestDetails.BudgetMax,
                        ContactEmail = r.RequestDetails.ContactEmail,
                        ContactPhone = r.RequestDetails.ContactPhone
                    }
                })
                .FirstOrDefaultAsync();

            if (request == null)
            {
                return NotFound();
            }

            return Ok(request);
        }

        // POST: api/requests
        [HttpPost]
        public async Task<ActionResult<RequestDto>> CreateRequest(CreateRequestDto createRequestDto)
        {
            var request = new Request
            {
                UserId = createRequestDto.UserId,
                RequestType = createRequestDto.RequestType,
                AdditionalDetails = createRequestDto.AdditionalDetails,
                Status = createRequestDto.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                RequestDetails = new RequestDetail
                {
                    LocationOrPostCode = createRequestDto.RequestDetail.LocationOrPostCode,
                    PurchaseType = createRequestDto.RequestDetail.PurchaseType,
                    PropertyType = createRequestDto.RequestDetail.PropertyType,
                    JourneyProgress = createRequestDto.RequestDetail.JourneyProgress,
                    BudgetMin = createRequestDto.RequestDetail.BudgetMin,
                    BudgetMax = createRequestDto.RequestDetail.BudgetMax,
                    ContactEmail = createRequestDto.RequestDetail.ContactEmail,
                    ContactPhone = createRequestDto.RequestDetail.ContactPhone
                }
            };

            _context.Requests.Add(request);
            await _context.SaveChangesAsync();

            var requestDto = new RequestDto
            {
                RequestId = request.RequestId,
                UserId = request.UserId,
                RequestType = request.RequestType,
                AdditionalDetails = request.AdditionalDetails,
                Status = request.Status,
                CreatedAt = request.CreatedAt,
                UpdatedAt = request.UpdatedAt,
                RequestDetail = new RequestDetailDto
                {
                    RequestDetailId = request.RequestDetails.RequestDetailId,
                    RequestId = request.RequestId,
                    LocationOrPostCode = request.RequestDetails.LocationOrPostCode,
                    PurchaseType = request.RequestDetails.PurchaseType,
                    PropertyType = request.RequestDetails.PropertyType,
                    JourneyProgress = request.RequestDetails.JourneyProgress,
                    BudgetMin = request.RequestDetails.BudgetMin,
                    BudgetMax = request.RequestDetails.BudgetMax,
                    ContactEmail = request.RequestDetails.ContactEmail,
                    ContactPhone = request.RequestDetails.ContactPhone
                }
            };

            return CreatedAtAction(nameof(GetRequestById), new { requestId = request.RequestId }, requestDto);
        }

        // PUT: api/requests/{requestId}
        [HttpPut("{requestId}")]
        public async Task<IActionResult> UpdateRequest(int requestId, UpdateRequestDto updateRequestDto)
        {
            var request = await _context.Requests.Include(r => r.RequestDetails).FirstOrDefaultAsync(r => r.RequestId == requestId);
            if (request == null)
            {
                return NotFound();
            }

            request.RequestType = updateRequestDto.RequestType;
            request.AdditionalDetails = updateRequestDto.AdditionalDetails;
            request.Status = updateRequestDto.Status;
            request.UpdatedAt = DateTime.UtcNow;

            if (request.RequestDetails != null)
            {
                _context.RequestDetails.Remove(request.RequestDetails);
            }

            request.RequestDetails = new RequestDetail
            {
                RequestId = requestId,
                LocationOrPostCode = updateRequestDto.RequestDetail.LocationOrPostCode,
                PurchaseType = updateRequestDto.RequestDetail.PurchaseType,
                PropertyType = updateRequestDto.RequestDetail.PropertyType,
                JourneyProgress = updateRequestDto.RequestDetail.JourneyProgress,
                BudgetMin = updateRequestDto.RequestDetail.BudgetMin,
                BudgetMax = updateRequestDto.RequestDetail.BudgetMax,
                ContactEmail = updateRequestDto.RequestDetail.ContactEmail,
                ContactPhone = updateRequestDto.RequestDetail.ContactPhone
            };

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateException)
            {
                return BadRequest();
            }
        }

        // DELETE: api/requests/{requestId}
        [HttpDelete("{requestId}")]
        public async Task<IActionResult> DeleteRequest(int requestId)
        {
            var request = await _context.Requests.Include(r => r.RequestDetails).FirstOrDefaultAsync(r => r.RequestId == requestId);
            if (request == null)
            {
                return NotFound();
            }

            if (request.RequestDetails != null)
            {
                _context.RequestDetails.Remove(request.RequestDetails);
            }

            _context.Requests.Remove(request);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}