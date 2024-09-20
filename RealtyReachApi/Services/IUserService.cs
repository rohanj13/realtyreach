using RealtyReachApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RealtyReachApi.Services
{
    public interface IUserService
    {
        Task<UserDto> GetUser(string userId);
        Task<UserDto> CreateUser(string userId, string email, string clientId);
        Task<bool> UpdateUser(string UserId, UpdateUserDto updatedUserDto);
        Task<bool> DeleteUser(string UserId);
    }
}