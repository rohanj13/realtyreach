# Use the official .NET 8 SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the .csproj file and restore dependencies
COPY ["RealtyReachApi/RealtyReachApi.csproj", "RealtyReachApi/"]
RUN dotnet restore "RealtyReachApi/RealtyReachApi.csproj"

# Copy the rest of the application files and build the application
COPY . .
WORKDIR "/src/RealtyReachApi"
RUN dotnet build "RealtyReachApi.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "RealtyReachApi.csproj" -c Release -o /app/publish

# Use the official .NET 8 runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port 80
EXPOSE 80

# Set the entry point to run the application
ENTRYPOINT ["dotnet", "RealtyReachApi.dll"]
