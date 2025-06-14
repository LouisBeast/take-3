import React, { useState, useEffect, useRef } from "react";

// Recommended exercises for each split and their recommended sets/reps
const splitExercises = {
  push: [
    { name: "Push-ups", recommended: "3 sets of 10–15 reps" },
    { name: "Dips", recommended: "4 sets of 8–10 reps" },
    { name: "Pike Push-ups", recommended: "3 sets of 6–8 reps" },
  ],
  pull: [
    { name: "Pull-ups", recommended: "3 sets of 5–8 reps" },
    { name: "Assisted Pull-ups", recommended: "3 sets of 8–10 reps" },
    { name: "Chin-ups", recommended: "3 sets of 6–8 reps" },
  ],
  legs: [
    { name: "Pistol Squats", recommended: "3 sets of 5–6 reps" },
    { name: "Leg Raises", recommended: "4 sets of 10–15 reps" },
    { name: "Glute Bridges", recommended: "3 sets of 12–15 reps" },
  ],
  skills: [
    { name: "Handstands", recommended: "Practice holds 3 x 30 seconds" },
    { name: "Front Lever", recommended: "Practice holds 3 x 10 seconds" },
    { name: "L-Sit", recommended: "Practice holds 3 x 15 seconds" },
  ],
};

// Difficulty options for dropdown
const difficulties = ["Easy", "OK", "Hard"];

// Helper to load previous sessions from localStorage
function loadSessions() {
  const stored = localStorage.getItem("workout_sessions");
  return stored ? JSON.parse(stored) : [];
}

export default function WorkoutScreen({ date, split, onExit }) {
  const exercises = splitExercises[split] || [];
  const [sessions, setSessions] = useState(loadSessions);
  
  // Form state for each exercise by name
  // Structure: { [exerciseName]: { sets, reps, weight, difficulty } }
  const [formData, setFormData] = useState(() => {
    const initial = {};
    exercises.forEach(({ name }) => {
      initial[name] = { sets: "", reps: "", weight: "", difficulty: "" };
    });
    return initial;
  });

  // Load last session data for these exercises, keyed by exercise name
  const lastSession = (() => {
    // Find last session for this date and split — fallback to latest for that split
    const filtered = sessions
      .filter((s) => s.split === split)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filtered.length === 0) return {};
    // For simplicity, return data of most recent session
    return filtered[0].exercises || {};
  })();

  // Rest timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeLeft]);

  // Handlers
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
    // Compose session object
    const sessionObj = {
      date,
      split,
      exercises: {},
    };
    exercises.forEach(({ name }) => {
      sessionObj.exercises[name] = formData[name];
    });

    const updatedSessions = [...sessions, sessionObj];
    setSessions(updatedSessions);
    localStorage.setItem("workout_sessions", JSON.stringify(updatedSessions));

    alert("Workout saved!");
    onExit();
  };

  return (
    <div className="p-4 max-w-xl mx-auto relative">

      <button
        className="mb-4 text-blue-600 underline"
        onClick={onExit}
      >
        ← Back to Welcome Screen
      </button>

      <h2 className="text-xl font-bold mb-4 capitalize">
        {split} workout for {new Date(date).toDateString()}
      </h2>

      <div className="space-y-6">
        {exercises.map(({ name, recommended }) => {
          const last = lastSession[name] || {};
          return (
            <div key={name} className="border p-4 rounded bg-gray-50">
              <h3 className="font-semibold mb-1">{name}</h3>
              <div className="mb-1 text-gray-600 italic text-sm">{recommended}</div>

              <div className="flex flex-wrap gap-3 mb-2">
                <label className="flex flex-col">
                  Sets
                  <input
                    type="number"
                    min="0"
                    value={formData[name].sets}
                    onChange={(e) => handleInputChange(name, "sets", e.target.value)}
                    className="border p-1 w-20"
                  />
                  {last.sets && (
                    <small className="text-gray-400">Last: {last.sets}</small>
                  )}
                </label>

                <label className="flex flex-col">
                  Reps
                  <input
                    type="number"
                    min="0"
                    value={formData[name].reps}
                    onChange={(e) => handleInputChange(name, "reps", e.target.value)}
                    className="border p-1 w-20"
                  />
                  {last.reps && (
                    <small className="text-gray-400">Last: {last.reps}</small>
                  )}
                </label>

                <label className="flex flex-col">
                  Weight (kg)
                  <input
                    type="number"
                    min="0"
                    value={formData[name].weight}
                    onChange={(e) => handleInputChange(name, "weight", e.target.value)}
                    className="border p-1 w-24"
                  />
                  {last.weight && (
                    <small className="text-gray-400">Last: {last.weight}</small>
                  )}
                </label>

                <label className="flex flex-col">
                  Difficulty
                  <select
                    value={formData[name].difficulty}
                    onChange={(e) => handleInputChange(name, "difficulty", e.target.value)}
                    className="border p-1 w-24"
                  >
                    <option value="">Select</option>
                    {difficulties.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Workout Button */}
      <button
        onClick={handleSaveWorkout}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded font-semibold"
      >
        Save Workout
      </button>

      {/* Floating Rest Timer */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#f3f4f6",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "12px",
          width: "160px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <strong>Rest Timer</strong>
          <button
            onClick={() => setTimerActive(false)}
            title="Stop timer"
            className="text-red-600 font-bold"
          >
            ×
          </button>
        </div>

        <div className="text-3xl text-center mb-2 font-mono">{timeLeft}s</div>

        <div className="flex justify-between">
          {[30, 60, 90].map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setTimeLeft(sec);
                setTimerActive(true);
              }}
              className="bg-blue-500 text-white rounded px-2 py-1 text-sm"
            >
              {sec}s
            </button>
          ))}
        </div>

        {!timerActive && (
          <button
            onClick={() => setTimerActive(true)}
            className="mt-2 w-full bg-green-600 text-white rounded py-1 font-semibold"
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}
