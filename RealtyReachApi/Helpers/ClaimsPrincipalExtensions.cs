using Microsoft.IdentityModel.Tokens;

namespace RealtyReachApi.Helpers;

using System.Security.Claims;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier) ??
               throw new SecurityTokenValidationException("UserId Not found");
    }

    public static string GetUserEmail(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.Email) ??
               throw new SecurityTokenValidationException("User Email Not Found");
    }

    public static string GetUserRole(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.Role) ??
               throw new SecurityTokenValidationException("User Role Not Found");
    }
}