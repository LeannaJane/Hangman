import React, { useState } from "react";
import { WelcomeScreen } from "./WelcomePage";
import GameScreen from "./GameScreen";

function App() {
  const [screen, setScreen] = useState("welcome"); 
  const [difficulty, setDifficulty] = useState("any");
  const [playerName, setPlayerName] = useState("");

  return (
    <>
      {screen === "welcome" && (
        <WelcomeScreen
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          playerName={playerName}
          setPlayerName={setPlayerName}
          onStartGame={() => setScreen("game")}
        />
      )}

      {screen === "game" && (
        <GameScreen
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          playerName={playerName}
          onBackToMenu={() => setScreen("welcome")}
        />
      )}
    </>
  );
}

export default App;