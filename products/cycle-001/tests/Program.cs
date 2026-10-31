using Product;
static void Check(bool value, string label) { if (!value) throw new Exception(label); Console.WriteLine("PASS " + label); }
Check(MissionRules.Validate(new(null, " ")).Count == 2, "required fields");
Check(MissionRules.Validate(new(new string('a', 121), new string('b', 201))).Count == 2, "length bounds");
Check(MissionRules.Validate(new("Synthétique", "Résumé")).Count == 0, "unicode accepted");
Check(MissionRules.CanTransition("planned", "active"), "forward transition");
Check(!MissionRules.CanTransition("planned", "completed"), "invalid transition");
Check(!MissionRules.CanTransition("completed", "planned"), "terminal state");
var store = new MissionStore();
var item = store.Create(new(" Client ", " Texte "))!;
Check(item.Client == "Client" && item.Title == "Texte", "normalization");
var successes = 0;
Parallel.For(0, 20, _ => { if (store.Change(item.Id, "active").Item1 == 200) Interlocked.Increment(ref successes); });
Check(successes == 1, "atomic concurrent transition");
Check(store.Change(Guid.NewGuid(), "active").Item1 == 404, "missing resource");
Parallel.For(0, 600, _ => store.Create(new("Fixture", "Capacity")));
Check(store.All().Length == 500 && store.Create(new("Fixture", "Overflow")) is null, "capacity enforced atomically");
Console.WriteLine("10 domain checks passed");
