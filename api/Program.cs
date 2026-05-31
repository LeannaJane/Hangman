using System.Text.Json;

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

var scoresPath = Path.Combine(app.Environment.ContentRootPath, "player-scores.json");
var scoresLock = new object();
Dictionary<string, int> playerScores = LoadScores();

string NormalizePlayerName(string? playerName)
{
    var value = (playerName ?? "player").Trim();
    return string.IsNullOrWhiteSpace(value) ? "player" : value.ToLowerInvariant();
}

Dictionary<string, int> LoadScores()
{
    if (!File.Exists(scoresPath))
    {
        return new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
    }

    try
    {
        var json = File.ReadAllText(scoresPath);
        var data = JsonSerializer.Deserialize<Dictionary<string, int>>(json);
        return data is null
            ? new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
            : new Dictionary<string, int>(data, StringComparer.OrdinalIgnoreCase);
    }
    catch
    {
        return new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
    }
}

void SaveScores()
{
    var json = JsonSerializer.Serialize(playerScores, new JsonSerializerOptions { WriteIndented = true });
    File.WriteAllText(scoresPath, json);
}

int GetOrCreatePlayerScore(string playerName)
{
    var normalizedName = NormalizePlayerName(playerName);

    lock (scoresLock)
    {
        if (playerScores.TryGetValue(normalizedName, out var existingScore))
        {
            return existingScore;
        }

        playerScores[normalizedName] = 25;
        SaveScores();
        return 25;
    }
}

int SavePlayerScore(string playerName, int score)
{
    var normalizedName = NormalizePlayerName(playerName);
    var safeScore = Math.Max(0, score);

    lock (scoresLock)
    {
        playerScores[normalizedName] = safeScore;
        SaveScores();
        return safeScore;
    }
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

    if (len <= 6 && rare == 0) return "easy";
    if (len <= 8) return rare > 0 ? "hard" : "medium";
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

app.MapGet("/api/hangman/score", (HttpRequest req) =>
{
    var playerName = req.Query["player"].ToString();
    var score = GetOrCreatePlayerScore(playerName);
    return Results.Ok(new { player = NormalizePlayerName(playerName), score });
})
.WithName("GetPlayerScore");

app.MapPost("/api/hangman/score", async (HttpRequest req) =>
{
    var body = await req.ReadFromJsonAsync<PlayerScoreUpdateRequest>();
    if (body is null)
    {
        return Results.BadRequest("Missing score payload");
    }

    var score = SavePlayerScore(body.Player, body.Score);
    return Results.Ok(new { player = NormalizePlayerName(body.Player), score });
})
.WithName("SavePlayerScore");

app.Run();

record HangmanWordResponse(string Word);

record PlayerScoreUpdateRequest(string Player, int Score);
