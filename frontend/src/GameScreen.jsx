import React, { useEffect, useState } from "react";
import HangManComponent from "./HangMan";

const FALLBACK_WORD = "HANGMAN";

function GameScreen({ difficulty, playerName, onBackToMenu }) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [word, setWord] = useState(FALLBACK_WORD);
  const [guessed, setGuessed] = useState([]);
  const [pointsForWord, setPointsForWord] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const scoreKey = `hangman-score-${(playerName || "player").trim().toLowerCase()}`;

  useEffect(() => {
    const savedScore = Number(localStorage.getItem(scoreKey) || 0);
    setScore(Number.isFinite(savedScore) ? savedScore : 0);
  }, [scoreKey]);

  async function loadWord() {
    setIsLoading(true);
    setError("");

    try {
      const url = difficulty && difficulty !== "any" 
        ? `/api/hangman/word?difficulty=${difficulty}` 
        : "/api/hangman/word";
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.json();
      setWord(String(data.word || FALLBACK_WORD).toUpperCase());
      setPointsForWord(Number(data.points || 0));
    } catch (fetchError) {
      setWord(FALLBACK_WORD);
      setError("Backend unavailable, using fallback word.");
      console.error(fetchError);
    } finally {
      setIsLoading(false);
      setGuessed([]); 
    }
  }

  // Load word on initial component mount
  useEffect(() => {
    void loadWord();
  }, []);

  const handleGuess = (letter) => {
    if (!guessed.includes(letter)) {
      setGuessed((g) => [...g, letter]);
    }
  };

  // Derived Values 
  const wrongGuesses = guessed.filter((l) => !word.includes(l)).length;
  const uniqueLetters = Array.from(new Set(word.split("")));
  const isWin = uniqueLetters.every((l) => guessed.includes(l));
  const isLose = wrongGuesses >= 5;

  // Track scoring context changes 
  useEffect(() => {
    if (isWin) {
      const awarded = Math.max(1, pointsForWord - wrongGuesses);
      setScore((s) => s + awarded);
    }
  }, [isWin]);

  useEffect(() => {
    localStorage.setItem(scoreKey, String(score));
  }, [score, scoreKey]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4 font-sans selection:bg-pink-500 selection:text-white">
      <div className="w-full max-w-md bg-pink-200 border border-purple-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center">

        {/* Top Header Controls */}
        <div className="w-full flex justify-between items-center mb-4">
          <button 
            onClick={onBackToMenu}
            className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-900/10 hover:bg-purple-900/20 px-3 py-1.5 rounded-xl transition"
          >
            ← Menu
          </button>
          <div className="text-sm font-bold text-purple-950 bg-white/50 px-3 py-1 rounded-xl shadow-sm">
            {playerName || "Player"}: {score} pts
          </div>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r select-none from-pink-600 to-purple-400 uppercase">
            HANGMAN
          </h1>
        </div>

        {error && <div className="mb-4 text-sm font-medium text-red-500">{error}</div>}

        {/* Canvas Display */}
        <div className="w-full bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-800/60 rounded-2xl p-6 flex items-center justify-center shadow-inner h-64 mb-6">
          <HangManComponent wrongGuesses={wrongGuesses} className="w-full h-full text-pink-50" />
        </div>

        {/* Word Display Blank Slots */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 w-full min-h-[44px]">
          {word.split("").map((letter, index) => (
            <div key={index} className="flex flex-col items-center w-7">
              <span className="text-xl font-black font-mono text-purple-950 h-7">
                {guessed.includes(letter) || isLose ? letter : ""}
              </span>
              <div className="w-full h-1 bg-purple-700 rounded-full mt-1 border-t border-purple-800" />
            </div>
          ))}
        </div>

        {/* Game Stats Information */}
        <div className="w-full mb-4 flex items-center justify-between">
          <div className="text-xs font-bold text-purple-900 uppercase tracking-wider">
            Strikes: <span className="text-red-600 font-black">{wrongGuesses} / 5</span>
          </div>
          <button 
            onClick={loadWord} 
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-pink-600 hover:bg-pink-500 text-white shadow transition disabled:opacity-70" 
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Next Word"}
          </button>
        </div>

        {/* Metadata Breakdown */}
        <div className="w-full mb-4 flex items-center justify-between gap-3 bg-purple-900/10 p-2.5 rounded-xl border border-purple-900/5">
          <div className="text-xs font-bold text-purple-900 uppercase">Diff: <span className="text-pink-600 font-black">{difficulty}</span></div>
          <div className="text-xs font-bold text-purple-900 uppercase">Value: <span className="text-purple-600 font-black">{pointsForWord} pts</span></div>
        </div>

        {/* Game Status Output Banner */}
        <div className="min-h-[28px] flex items-center justify-center mb-2">
          {isWin && <div className="text-green-600 font-black tracking-wide uppercase text-sm animate-bounce">🎉 You Win!</div>}
          {isLose && <div className="text-red-600 font-bold text-xs uppercase text-center">Game Over! Word was <span className="underline font-black">{word}</span></div>}
        </div>

        {/* Alphabet Interface Keys */}
        <div className="grid grid-cols-7 gap-1.5 w-full">
          {alphabet.map((letter) => {
            const isGuessed = guessed.includes(letter);
            return (
              <button
                key={letter}
                disabled={isGuessed || isWin || isLose}
                onClick={() => handleGuess(letter)}
                className="aspect-square flex items-center justify-center text-xs font-bold rounded-lg border border-purple-800/40 bg-purple-900/20 text-purple-950 hover:bg-pink-600 hover:text-white hover:border-pink-500 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-purple-950 disabled:hover:border-purple-800/40 transition cursor-pointer"
              >
                {letter}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default GameScreen;