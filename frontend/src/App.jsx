import React, { useEffect, useMemo, useState } from "react"
import HangManComponent from "./HangMan"

const WORDS = [
  "FEDORA",
  "JAVASCRIPT",
  "REACT",
  "COMPUTER",
  "PROGRAM",
  "HANGMAN",
  "TAILWIND",
]

function App() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  const [word, setWord] = useState(WORDS[0])
  const [guessed, setGuessed] = useState([])

  useEffect(() => {
    // pick a random word on mount
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)])
    setGuessed([])
  }, [])

  const normalizedWord = useMemo(() => word.toUpperCase(), [word])

  const handleGuess = (letter) => {
    if (guessed.includes(letter)) return
    setGuessed((g) => [...g, letter])
  }

  const wrongGuesses = guessed.filter((l) => !normalizedWord.includes(l)).length
  const uniqueLetters = Array.from(new Set(normalizedWord.split("")))
  const isWin = uniqueLetters.every((l) => guessed.includes(l))
  const isLose = wrongGuesses >= 5

  const resetGame = () => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)])
    setGuessed([])
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4 font-sans selection:bg-pink-500 selection:text-white">
      <div className="w-full max-w-md bg-pink-200 border border-purple-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r select-none from-pink-600 to-purple-400 uppercase">
            HANGMAN
          </h1>
        </div>

        <div className="w-full bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-800/60 rounded-2xl p-6 flex items-center justify-center shadow-inner h-96">
          <HangManComponent wrongGuesses={wrongGuesses} className="w-full h-full text-pink-50" />
        </div>

        <div className="flex gap-3 justify-center mb-4 w-full">
          {normalizedWord.split("").map((letter, index) => (
            <div key={index} className="flex flex-col items-center w-8">
              <span className="text-2xl font-black font-mono text-pink-50 h-8">
                {guessed.includes(letter) || isLose ? letter : ""}
              </span>
              <div className="w-full h-1 bg-purple-700 rounded-full mt-1 border-t border-purple-800" />
            </div>
          ))}
        </div>

        <div className="w-full mb-4 flex items-center justify-between">
          <div className="text-sm text-pink-200">Wrong: {wrongGuesses} / 5</div>
          <div>
            <button onClick={resetGame} className="px-3 py-1 text-sm rounded bg-pink-600 hover:bg-pink-500 text-white">
              New Game
            </button>
          </div>
        </div>

        {isWin && <div className="text-pink-300 font-bold mb-4">You Win!</div>}
        {isLose && <div className="text-red-400 font-bold mb-4">You Lose — word was {normalizedWord}</div>}

        <div className="grid grid-cols-7 gap-2 w-full">
          {alphabet.map((letter) => {
            const isGuessed = guessed.includes(letter)
            return (
              <button
                key={letter}
                disabled={isGuessed || isWin || isLose}
                onClick={() => handleGuess(letter)}
                className="aspect-square flex items-center justify-center text-sm font-bold rounded-lg border border-purple-800 bg-purple-900/30 text-pink-50 hover:bg-pink-600 hover:text-white hover:border-pink-500 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-pink-200 disabled:hover:border-purple-800 transition cursor-pointer"
              >
                {letter}
              </button>
            )
          })}
        </div>

      </div>
    </div>
  );
}

export default App;