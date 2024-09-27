using Microsoft.AspNetCore.Identity;
namespace Identity.Api.Data;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Ensure roles are created
        string[] roleNames = { "Admin", "Proffessional", "Customer" }; // Add any other roles you need
        foreach (var roleName in roleNames)
        {
            var roleExist = await roleManager.RoleExistsAsync(roleName);
            if (!roleExist)
            {
                // Create the roles and seed them to the database
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }
    }

}
