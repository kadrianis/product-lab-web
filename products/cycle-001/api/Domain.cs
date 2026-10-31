namespace Product;
public sealed record CreateMission(string? Client, string? Title);
public sealed record ChangeStatus(string? Status);
public sealed record Mission(Guid Id, string Client, string Title, string Status, DateTimeOffset CreatedAt);
public static class MissionRules {
    public static Dictionary<string, string[]> Validate(CreateMission input) {
        var errors = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(input.Client) || input.Client.Trim().Length > 120)
            errors["client"] = ["Required; maximum 120 characters."];
        if (string.IsNullOrWhiteSpace(input.Title) || input.Title.Trim().Length > 200)
            errors["title"] = ["Required; maximum 200 characters."];
        return errors;
    }
    public static bool CanTransition(string current, string? target) =>
        (current, target) is ("planned", "active") or ("active", "completed");
}
public sealed class MissionStore {
    private readonly object gate = new();
    private readonly Dictionary<Guid, Mission> items = new();
    public Mission[] All() { lock (gate) return items.Values.OrderByDescending(x => x.CreatedAt).ToArray(); }
    public Mission? Get(Guid id) { lock (gate) return items.GetValueOrDefault(id); }
    public Mission? Create(CreateMission input) {
        lock (gate) {
            if (items.Count >= 500) return null;
            var item = new Mission(Guid.NewGuid(), input.Client!.Trim(), input.Title!.Trim(), "planned", DateTimeOffset.UtcNow);
            items.Add(item.Id, item);
            return item;
        }
    }
    public (int, Mission?) Change(Guid id, string? status) {
        lock (gate) {
            if (!items.TryGetValue(id, out var item)) return (404, null);
            if (!MissionRules.CanTransition(item.Status, status)) return (409, null);
            var changed = item with { Status = status! };
            items[id] = changed;
            return (200, changed);
        }
    }
}
