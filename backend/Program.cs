using System.Data.Common;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using MySqlConnector;
using backend.Data.Repositories;

// Load .env file
Env.Load();

// build connection string from environment variables
var connectionString = new MySqlConnectionStringBuilder
{
    Server = Environment.GetEnvironmentVariable("MYSQL_HOST"),
    Port = uint.Parse(Environment.GetEnvironmentVariable("MYSQL_PORT")),
    Database = Environment.GetEnvironmentVariable("MYSQL_DB"),
    UserID = Environment.GetEnvironmentVariable("MYSQL_USER"),
    Password = Environment.GetEnvironmentVariable("MYSQL_PASSWORD"),
    SslMode = MySqlSslMode.Required,
    SslCa = Environment.GetEnvironmentVariable("MYSQL_SSL_CA")
}.ConnectionString;

var builder = WebApplication.CreateBuilder(args);

// cors bullshit
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddSingleton(sp => new Database(connectionString));
builder.Services.AddScoped<INbaPlayerRepository, NbaPlayerRepository>();
builder.Services.AddScoped<IGameRepository, GameRepository>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    );
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// Only use https redirection if the app is not in development
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}


app.MapControllers();

app.Run();