import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./WelcomeScreen";
import WorkoutScreen from "./WorkoutScreen";
import SummaryScreen from "./SummaryScreen";
import ProgressScreen from "./screens/ProgressScreen"; // Keep this one

function App() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("workoutSessions");
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/workout" element={<WorkoutScreen />} />
        <Route path="/summary" element={<SummaryScreen />} />
        <Route path="/progress" element={<ProgressScreen sessions={sessions} />} />
      </Routes>
    </Router>
  );
}

export default App;
