using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using SharedData.Models;
using SharedData.Data;

public static class RequestEndpoints
{
    public static void RegisterRequestsEndpoints(this WebApplication app)
    {
        var requests = app.MapGroup("/requests").RequireAuthorization();

        requests.MapGet("/{userId}", GetAllRequestsForUser);
        requests.MapGet("/{requestId}", GetRequestById);
        requests.MapPost("/", CreateRequest);
        requests.MapPut("/{requestId}", UpdateRequest);
        requests.MapDelete("/{userId}", DeleteRequest);

    }

    // Get all requests for a specific user
    static async Task<Results<Ok<List<Request>>, NotFound>> GetAllRequestsForUser(int userId, SharedDbContext db)
    {
        var requests = await db.Requests.Where(r => r.UserId == userId).ToListAsync();
        return requests.Count > 0 ? TypedResults.Ok(requests) : TypedResults.NotFound();
    }

    // Get a specific request by requestId
    static async Task<Results<Ok<Request>, NotFound>> GetRequestById(int requestId, SharedDbContext db) =>
        await db.Requests.FindAsync(requestId)
            is Request request
                ? TypedResults.Ok(request)
                : TypedResults.NotFound();

    // Create a new request
    static async Task<Results<Created<Request>, BadRequest>> CreateRequest(Request request, SharedDbContext db)
    {
        db.Requests.Add(request);
        await db.SaveChangesAsync();
        return TypedResults.Created($"/requests/{request.RequestId}", request);
    }

    // Update an existing request by requestId
    static async Task<Results<NoContent, NotFound, BadRequest>> UpdateRequest(int requestId, Request updatedRequest, SharedDbContext db)
    {
        var request = await db.Requests.FindAsync(requestId);
        if (request is null) return TypedResults.NotFound();

        request.UserId = updatedRequest.UserId;
        request.PurchaseType = updatedRequest.PurchaseType;
        request.JourneyProgress = updatedRequest.JourneyProgress;
        request.AdditionalDetails = updatedRequest.AdditionalDetails;
        request.BudgetMin = updatedRequest.BudgetMin;
        request.BudgetMax = updatedRequest.BudgetMax;
        request.Status = updatedRequest.Status;
        request.ContactEmail = updatedRequest.ContactEmail;
        request.ContactPhone = updatedRequest.ContactPhone;
        request.UpdatedAt = DateTime.UtcNow;

        try
        {
            await db.SaveChangesAsync();
            return TypedResults.NoContent();
        }
        catch (DbUpdateException)
        {
            return TypedResults.BadRequest();
        }
    }

    // Delete a request by requestId
    static async Task<Results<NoContent, NotFound>> DeleteRequest(int requestId, SharedDbContext db)
    {
        var request = await db.Requests.FindAsync(requestId);
        if (request is null) return TypedResults.NotFound();

        db.Requests.Remove(request);
        await db.SaveChangesAsync();
        return TypedResults.NoContent();
    }
}