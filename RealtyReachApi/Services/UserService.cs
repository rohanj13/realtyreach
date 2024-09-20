using RealtyReachApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RealtyReachApi.Data;

namespace RealtyReachApi.Services
{
    public class UserService : IUserService
    {
        private readonly SharedDbContext _context;

        public UserService(SharedDbContext context)
        {
            _context = context;
        }

        // Get a user by their Auth0 user ID
        public async Task<UserDto> GetUser(string userId)
        {
            var user = await _context.Users
                .Include(u => u.Professional)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return null;
            }

            return new UserDto
            {
                UserId = user.UserId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNo = user.PhoneNo,
            };
        }

        // Create a new user
        public async Task<UserDto> CreateUser(string userId, string email, string clientId)
        {
            UserType type;
            if (clientId == "0lkP3nSn1ETZWoWDLKACYtJUfjgXKMKZ")
            {
                type = UserType.Customer;
            }
            else
            {
                type = UserType.Professional;
            }
            var newUser = new User
            {
                UserId = userId,
                Email = email,
                Type = type,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                UserId = newUser.UserId,
                Email = newUser.Email,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                PhoneNo = newUser.PhoneNo,
            };
        }

        // Update an existing user
        public async Task<bool> UpdateUser(string userId, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(updateUserDto.Email))
            {
                user.Email = updateUserDto.Email;
            }

            if (!string.IsNullOrEmpty(updateUserDto.FirstName))
            {
                user.FirstName = updateUserDto.FirstName;
            }

            if (!string.IsNullOrEmpty(updateUserDto.LastName))
            {
                user.LastName = updateUserDto.LastName;
            }

            if (!string.IsNullOrEmpty(updateUserDto.PhoneNo))
            {
                user.PhoneNo = updateUserDto.PhoneNo;
            }

            user.UpdatedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true;
        }

        // Delete a user by their user ID
        public async Task<bool> DeleteUser(string userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
