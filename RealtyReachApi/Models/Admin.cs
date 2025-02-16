using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtyReachApi.Models;
public class Admin
{
    public Guid Id { get; set; }
    public string userId { get; set; }
    public string Email { get; set; }
}