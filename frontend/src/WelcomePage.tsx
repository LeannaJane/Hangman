import React from "react";

type Difficulty = "any" | "easy" | "medium" | "hard";

type WelcomeScreenProps = {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  onStartGame: () => void;
};

export function WelcomeScreen({
  difficulty,
  setDifficulty,
  playerName,
  setPlayerName,
  onStartGame,
}: WelcomeScreenProps) {
  const difficulties: Difficulty[] = ["any", "easy", "medium", "hard"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4 font-sans selection:bg-pink-500 selection:text-white">
      <div className="w-full max-w-md bg-pink-200 border border-purple-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
        
        <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-500 uppercase mb-2 drop-shadow-sm select-none">
          HANGMAN
        </h1>
        <p className="text-sm text-purple-900/60 font-medium mb-8">
          Test your vocabulary. Guess the hidden word before it's too late.
        </p>

        <div className="w-full bg-purple-900/5 border border-purple-800/20 rounded-2xl p-5 mb-8">
          <label className="block text-sm font-bold text-purple-900 mb-2 uppercase tracking-wider">
            Player Name
          </label>
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter name"
            className="w-full mb-4 px-3 py-2 rounded-xl border border-purple-200 bg-white text-purple-900"
          />

          <label className="block text-sm font-bold text-purple-900 mb-3 uppercase tracking-wider">
            Select Difficulty
          </label>
          <div className="grid grid-cols-2 gap-2 w-full">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`py-2.5 px-4 text-sm font-bold rounded-xl transition-all duration-200 border ${
                  difficulty === d
                    ? "bg-pink-600 text-white border-pink-700 shadow-md transform scale-[1.02]"
                    : "bg-white text-purple-900 border-purple-200 hover:bg-pink-50 hover:border-pink-300"
                }`}
              >
                {d === "any" ? "Any Difficulty" : d[0].toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onStartGame}
          className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl transition duration-200 tracking-wider uppercase active:scale-[0.98]"
        >
          Play Game
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;