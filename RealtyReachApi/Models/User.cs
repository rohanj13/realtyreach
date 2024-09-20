using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public enum UserType
{
    Customer,    // Regular user
    Professional // Professional user
}

public class User
{
    [Key]
    public string UserId { get; set; } // Auth0 user_id

    [Required]
    [EmailAddress]
    public string Email { get; set; } // Auth0 email

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Phone]
    public string PhoneNo { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public UserType Type { get; set; }

    // Navigation property for Professionals (1-to-1 relationship)
    public Professional Professional { get; set; }
}
