import React, { useState } from "react";
import WelcomeScreen from "./WelcomeScreen";
// import your workout logger here

function App() {
  const [sessionInfo, setSessionInfo] = useState(null);

  return (
    <>
      {!sessionInfo ? (
        <WelcomeScreen onStart={setSessionInfo} />
      ) : (
        <WorkoutLogger sessionInfo={sessionInfo} />
      )}
    </>
  );
}

export default App;
