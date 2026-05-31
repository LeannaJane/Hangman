var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Load words from `words.txt` in the api folder.
// If the file is missing, use a small fallback list.
var contentRoot = app.Environment.ContentRootPath;
var wordsPath = Path.Combine(contentRoot, "words.txt");
string[] words;
if (File.Exists(wordsPath))
{
    var lines = File.ReadAllLines(wordsPath);
    var list = new List<string>();
    foreach (var line in lines)
    {
        var t = (line ?? "").Trim();
        if (t.Length > 0) list.Add(t.ToUpper());
    }
    words = list.ToArray();
}
else
{
    words = new[] { "HANGMAN", "COMPUTER", "REACT", "JAVASCRIPT" };
}

// Decide difficulty: easy, medium or hard.
string GetDifficulty(string w)
{
    if (string.IsNullOrEmpty(w)) return "easy";
    int len = w.Length;
    int rare = 0;
    for (int i = 0; i < w.Length; i++)
    {
        var c = char.ToUpper(w[i]);
        if ("QZXJ".IndexOf(c) >= 0) rare++;
    }

    if (len <= 4 && rare == 0) return "easy";
    if (len <= 7) return rare > 0 ? "hard" : "medium";
    return "hard";
}

// Points: length * factor + small rare-letter bonus.
int ComputePoints(string w, string difficulty)
{
    if (string.IsNullOrEmpty(w)) return 1;
    int len = w.Length;
    int rare = 0;
    for (int i = 0; i < w.Length; i++)
    {
        var c = char.ToUpper(w[i]);
        if ("QZXJ".IndexOf(c) >= 0) rare++;
    }
    int multiplier = difficulty == "hard" ? 3 : difficulty == "medium" ? 2 : 1;
    int points = len * multiplier + rare * 2;
    return Math.Max(1, points);
}

app.MapGet("/api/hangman/word", (HttpRequest req) =>
{
    if (words.Length == 0)
    {
        return Results.Problem("No words available");
    }

    var q = req.Query["difficulty"].ToString()?.ToLower();
    // words array already contains trimmed upper-case items
    string[] candidateWords = words;

    if (!string.IsNullOrEmpty(q))
    {
        var list = new List<string>();
        foreach (var w in words)
        {
            if (string.IsNullOrEmpty(w)) continue;
            if (GetDifficulty(w) == q) list.Add(w);
        }
        if (list.Count > 0) candidateWords = list.ToArray();
    }

    var word = candidateWords[Random.Shared.Next(candidateWords.Length)];
    var difficulty = GetDifficulty(word);
    var points = ComputePoints(word, difficulty);
    return Results.Ok(new { word, difficulty, points });
})
.WithName("GetHangmanWord");

app.Run();

record HangmanWordResponse(string Word);
