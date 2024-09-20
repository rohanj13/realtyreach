using System;
using System.ComponentModel.DataAnnotations;

public class UserDto
{
    [Required]
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
}

// public class CreateUserDto
// {
//     [Required]
//     public string UserId { get; set; } // Auth0 user_id

//     [Required]
//     [EmailAddress]
//     public string Email { get; set; }

//     [Required]
//     public UserType Type { get; set; }
// }

public class UpdateUserDto
{
    [EmailAddress]
    public string Email { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    [Phone]
    public string PhoneNo { get; set; }
}

