import React, { useState, useEffect } from "react";
import "./App.css"; // Optional if you have global styles

function App() {
  const [screen, setScreen] = useState("welcome");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSplit, setSelectedSplit] = useState("");
  const [sessions, setSessions] = useState(() => {
    const stored = localStorage.getItem("workout_sessions");
    return stored ? JSON.parse(stored) : [];
  });

  const [formData, setFormData] = useState({});

  const splits = {
    Push: [
      { name: "Weighted Dips", recommendation: "4 sets of 6–8 reps" },
      { name: "Pseudo Planche Push-ups", recommendation: "3 sets of 8–12 reps" },
      { name: "Pike Push-ups", recommendation: "3 sets of 6–10 reps" },
      { name: "Incline/Decline Push-ups", recommendation: "3 sets of 10–15 reps" },
      { name: "Diamond Push-ups", recommendation: "2–3 sets of 12–15 reps" },
    ],
    Pull: [
      { name: "Pull-ups", recommendation: "3–4 sets of 5–6 reps" },
      { name: "Assisted Pull-ups", recommendation: "2 sets of 8–10 reps" },
      { name: "Negative Pull-ups", recommendation: "3 sets of 3–5 reps" },
      { name: "Australian Rows", recommendation: "4 sets of 10–12 reps" },
      { name: "Banded Curls", recommendation: "3 sets of 12–15 reps" },
    ],
    "Legs & Core": [
      { name: "Bulgarian Split Squats", recommendation: "4 sets of 8–10 reps" },
      { name: "Wall Sits", recommendation: "3 sets of 30–60 sec" },
      { name: "Glute Bridges", recommendation: "3 sets of 10–15 reps" },
      { name: "Hanging Leg Raises", recommendation: "3 sets of 10–12 reps" },
      { name: "Planks", recommendation: "3 sets of 30–45 sec" },
    ],
    "Skills & Mobility": [
      { name: "Handstand Practice", recommendation: "5–10 min total" },
      { name: "Front Lever Tuck Holds", recommendation: "3–4 sets of 10 sec" },
      { name: "L-Sit Progressions", recommendation: "3–4 sets of 10 sec" },
      { name: "Shoulder Dislocates", recommendation: "3 sets of 10 reps" },
      { name: "Hip Mobility Flow", recommendation: "5–8 min" },
    ],
  };

  const handleBeginWorkout = () => {
    setScreen("workout");
    const initialForm = {};
    splits[selectedSplit].forEach((ex) => {
      initialForm[ex.name] = {
        sets: "",
        reps: "",
        weight: "",
        band: "",
        difficulty: "",
        notes: "",
      };
    });
    setFormData(initialForm);
  };

  const handleInputChange = (exercise, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [field]: value,
      },
    }));
  };

  const handleSaveWorkout = () => {
    const session = {
      date: selectedDate,
      split: selectedSplit,
      exercises: formData,
    };
    setSessions((prev) => [...prev, session]);
    localStorage.setItem("workout_sessions", JSON.stringify([...sessions, session]));
    setScreen("welcome");
    setSelectedSplit("");
  };

  const renderWelcomeScreen = () => (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">CalisTracker</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-full p-2 mb-4 border"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        {["Push", "Pull", "Legs & Core", "Skills & Mobility"].map((split) => (
          <button
            key={split}
            onClick={() => setSelectedSplit(split)}
            className={`p-4 border rounded text-white font-semibold flex flex-col items-center ${
              split === "Skills & Mobility" ? "bg-teal-500" : "bg-orange-500"
            } ${selectedSplit === split ? "ring-4 ring-yellow-300" : ""}`}
          >
            <img src={`./icons/${split.toLowerCase().replace(" & ", "").replace(" ", "")}.svg`} alt={split} className="w-8 h-8 mb-1" />
            {split}
          </button>
        ))}
      </div>
      {selectedSplit && (
        <button
          onClick={handleBeginWorkout}
          className="w-full bg-blue-600 text-white p-3 rounded text-lg"
        >
          Begin Workout
        </button>
      )}
    </div>
  );

  const renderWorkoutScreen = () => (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{selectedSplit} Workout — {selectedDate}</h2>
      {splits[selectedSplit].map((ex) => (
        <div key={ex.name} className="mb-4 border rounded p-3">
          <h3 className="font-semibold">{ex.name}</h3>
          <p className="text-sm text-gray-500 mb-2">Recommendation: {ex.recommendation}</p>
          {ex.name === "Assisted Pull-ups" && (
            <select
              value={formData[ex.name].band}
              onChange={(e) => handleInputChange(ex.name, "band", e.target.value)}
              className="w-full p-2 border mb-2"
            >
              <option value="">Select Band</option>
              <option value="Red">Red</option>
              <option value="Purple">Purple</option>
              <option value="Grey">Grey</option>
            </select>
          )}
          <input
            type="text"
            placeholder="Sets"
            value={formData[ex.name].sets}
            onChange={(e) => handleInputChange(ex.name, "sets", e.target.value)}
            className="w-full p-2 border mb-1"
          />
          <input
            type="text"
            placeholder="Reps"
            value={formData[ex.name].reps}
            onChange={(e) => handleInputChange(ex.name, "reps", e.target.value)}
            className="w-full p-2 border mb-1"
          />
          <input
            type="text"
            placeholder="Weight (kg) / Assist"
            value={formData[ex.name].weight}
            onChange={(e) => handleInputChange(ex.name, "weight", e.target.value)}
            className="w-full p-2 border mb-1"
          />
          <select
            value={formData[ex.name].difficulty}
            onChange={(e) => handleInputChange(ex.name, "difficulty", e.target.value)}
            className="w-full p-2 border mb-1"
          >
            <option value="">Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="OK">OK</option>
            <option value="Hard">Hard</option>
          </select>
          <textarea
            placeholder="Notes"
            value={formData[ex.name].notes}
            onChange={(e) => handleInputChange(ex.name, "notes", e.target.value)}
            className="w-full p-2 border"
          />
        </div>
      ))}
      <button
        onClick={handleSaveWorkout}
        className="w-full bg-green-600 text-white p-3 rounded text-lg"
      >
        Save Workout
      </button>
    </div>
  );

  return screen === "welcome" ? renderWelcomeScreen() : renderWorkoutScreen();
}

export default App;
