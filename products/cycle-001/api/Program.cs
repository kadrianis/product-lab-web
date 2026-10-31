using Product;
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = 16384);
builder.Services.AddSingleton<MissionStore>();
builder.Services.AddProblemDetails();

var app = builder.Build();
app.UseExceptionHandler();
app.Use(async (context, next) => {
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["Cache-Control"] = "no-store";
    context.Response.Headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'self'";
    await next();
});
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapGet("/health", () => Results.Ok(new { status = "ok", storage = "volatile-memory" }));
app.MapGet("/api/missions", (MissionStore store) => Results.Ok(store.All()));
app.MapGet("/api/missions/{id:guid}", (Guid id, MissionStore store) =>
    store.Get(id) is { } item ? Results.Ok(item) : Results.NotFound());
app.MapPost("/api/missions", (CreateMission input, MissionStore store) => {
    var errors = MissionRules.Validate(input);
    if (errors.Count > 0) return Results.ValidationProblem(errors);
    var item = store.Create(input);
    return item is null ? Results.Problem(statusCode: 409, title: "Demo capacity reached")
        : Results.Created($"/api/missions/{item.Id}", item);
});
app.MapPatch("/api/missions/{id:guid}/status", (Guid id, ChangeStatus input, MissionStore store) => {
    var result = store.Change(id, input.Status);
    return result.Item1 switch {
        200 => Results.Ok(result.Item2),
        404 => Results.NotFound(),
        _ => Results.Problem(statusCode: 409, title: "Invalid status transition")
    };
});
app.Run();
