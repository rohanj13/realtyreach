using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TypeGen.Core.TypeAnnotations;

namespace RealtyReachApi.Models;
[ExportTsClass]
public class Admin
{
    public Guid Id { get; set; }
    public string userId { get; set; }
    public string Email { get; set; }
}