using Microsoft.EntityFrameworkCore;
using Npgsql;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Npgsql;
using RealtyReachApi.Models;

namespace RealtyReachApi.Data
{
    public class SuburbSeeder
    {
        private static readonly Dictionary<string, AustralianState> StateMapping = new()
        {
            { "NSW", AustralianState.NSW },
            { "VIC", AustralianState.VIC },
            { "QLD", AustralianState.QLD },
            { "WA", AustralianState.WA },
            { "SA", AustralianState.SA },
            { "TAS", AustralianState.TAS },
            { "NT", AustralianState.NT },
            { "ACT", AustralianState.ACT }
        };

        public static void SeedDatabase(SharedDbContext dbContext)
        {
            Console.WriteLine("Checking if postcode data exists...");

            if (dbContext.Suburbs.Any()) 
            {
                Console.WriteLine("Postcode and city data already exist. Skipping import.");
                return;
            }

            Console.WriteLine("Importing suburb data...");

            var lines = File.ReadLines("Data/SeedData/australian_postcodes.csv").Skip(1); // Skip header

            var suburbsToAdd = new List<Suburb>();

            foreach (var line in lines)
            {
                var parts = line.Split(',');

                if (parts.Length < 6)
                    continue; // Skip invalid lines

                var id = int.Parse(parts[0]);
                var postcode = parts[1];
                var locality = parts[2];
                var stateString = parts[3];
                var region = parts[4];
                var latitude = double.Parse(parts[5]);
                var longitude = double.Parse(parts[6]);

                if (!StateMapping.TryGetValue(stateString, out var stateEnum))
                {
                    Console.WriteLine($"Unknown state: {stateString}");
                    continue;
                }

                suburbsToAdd.Add(new Suburb
                {
                    Id = id,
                    Postcode = postcode,
                    Locality = locality,
                    Region = region,
                    State = stateEnum,
                    Latitude = latitude,
                    Longitude = longitude
                });
            }

            dbContext.Suburbs.AddRange(suburbsToAdd);
            dbContext.SaveChanges();

            Console.WriteLine("Suburb data imported successfully.");
        }

    }
}