import React from "react";

import HangManComponent from "./HangMan";
function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <HangManComponent wrongGuesses={5} />
    </div>
  );
}

export default App;