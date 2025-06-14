import React, { useState, useEffect } from "react";

const exercisesBySplit = {
  push: [
    { name: "Dips", recommended: "4 sets of 8–10 reps" },
    { name: "Weighted Dips", recommended: "4 sets of 6–8 reps" },
    { name: "Push-ups", recommended: "3 sets of 10–15 reps" },
  ],
  pull: [
    { name: "Pull-ups", recommended: "3 sets of 5–8 reps" },
    { name: "Assisted Pull-ups", recommended: "3 sets of 8–10 reps" },
    { name: "Chin-ups", recommended: "3 sets of 6–10 reps" },
  ],
  legs: [
    { name: "Pistol Squats", recommended: "3 sets of 5 reps per leg" },
    { name: "Leg Raises", recommended: "3 sets of 10–15 reps" },
    { name: "Squats", recommended: "4 sets of 10–15 reps" },
  ],
  skills: [
    { name: "Handstand Hold", recommended: "3 holds of 20-40 seconds" },
    { name: "Front Lever Hold", recommended: "3 holds of 10-20 seconds" },
    { name: "Planche Progression", recommended: "Practice 5 minutes" },
  ],
};

// Retrieve previous sessions from localStorage
function getPreviousSessions() {
  const stored = localStorage.getItem("workout_sessions");
  return stored ? JSON.parse(stored) : [];
}

// Find the most recent session data for an exercise & split
function getLastSession(sessions, split, exerciseName) {
  // Filter by split and exercise and sort by date descending
  const filtered = sessions
    .filter(
      (s) => s.split === split && s.exercise === exerciseName
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return filtered.length > 0 ? filtered[0] : null;
}

function WorkoutScreen({ date, split, onExit }) {
  const [sessions, setSessions] = useState(getPreviousSessions);
  const [inputs, setInputs] = useState({}); // { exerciseName: [{sets, reps, weight, band, difficulty}] }
  const [restTimerVisible, setRestTimerVisible] = useState(false);
  const [restSeconds, setRestSeconds] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(restSeconds);

  const exercises = exercisesBySplit[split] || [];

  // Handle rest timer countdown
  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  // Reset timer if restSeconds changes
  useEffect(() => {
    setTimeLeft(restSeconds);
    setTimerRunning(false);
  }, [restSeconds]);

  const handleInputChange = (exercise, index, field, value) => {
    setInputs((prev) => {
      const exerciseInputs = prev[exercise] ? [...prev[exercise]] : [];
      exerciseInputs[index] = { ...exerciseInputs[index], [field]: value };
      return { ...prev, [exercise]: exerciseInputs };
    });
  };

  const addSet = (exercise) => {
    setInputs((prev) => {
      const exerciseInputs = prev[exercise] ? [...prev[exercise]] : [];
      exerciseInputs.push({ sets: "", reps: "", weight: "", band: "", difficulty: "ok" });
      return { ...prev, [exercise]: exerciseInputs };
    });
  };

  const removeSet = (exercise, index) => {
    setInputs((prev) => {
      const exerciseInputs = prev[exercise] ? [...prev[exercise]] : [];
      exerciseInputs.splice(index, 1);
      return { ...prev, [exercise]: exerciseInputs };
    });
  };

  const handleSave = () => {
    // Flatten inputs into session entries and save to localStorage
    let newSessions = [...sessions];
    Object.entries(inputs).forEach(([exerciseName, sets]) => {
      sets.forEach((set) => {
        if (set.sets && set.reps) {
          newSessions.push({
            date,
            split,
            exercise: exerciseName,
            sets: set.sets,
            reps: set.reps,
            weight: set.weight,
            band: set.band,
            difficulty: set.difficulty,
          });
        }
      });
    });
    setSessions(newSessions);
    localStorage.setItem("workout_sessions", JSON.stringify(newSessions));
    alert("Workout saved!");
    onExit();
  };

  return (
    <div className="p-4 max-w-xl mx-auto relative">
      <h2 className="text-xl font-bold mb-4">
        Workout: {split.charAt(0).toUpperCase() + split.slice(1)} - {new Date(date).toLocaleDateString()}
      </h2>

      {exercises.map((ex) => {
        const previous = getLastSession(sessions, split, ex.name);
        const exerciseInputs = inputs[ex.name] || [];

        return (
          <div key={ex.name} className="mb-6 border p-3 rounded">
            <h3 className="font-semibold">{ex.name}</h3>
            <div className="text-sm italic text-gray-600 mb-1">Recommended: {ex.recommended}</div>

            {exerciseInputs.map((set, idx) => (
              <div key={idx} className="flex flex-wrap gap-2 mb-1 items-center">
                <input
                  type="text"
                  placeholder="Sets"
                  value={set.sets}
                  onChange={(e) => handleInputChange(ex.name, idx, "sets", e.target.value)}
                  className="w-16 p-1 border"
                />
                <input
                  type="text"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => handleInputChange(ex.name, idx, "reps", e.target.value)}
                  className="w-16 p-1 border"
                />
                {/* Weight input only if not Assisted Pull-ups */}
                {ex.name !== "Assisted Pull-ups" && (
                  <input
                    type="text"
                    placeholder="Weight (kg)"
                    value={set.weight}
                    onChange={(e) => handleInputChange(ex.name, idx, "weight", e.target.value)}
                    className="w-20 p-1 border"
                  />
                )}
                {/* Band selector only if Assisted Pull-ups */}
                {ex.name === "Assisted Pull-ups" && (
                  <select
                    value={set.band}
                    onChange={(e) => handleInputChange(ex.name, idx, "band", e.target.value)}
                    className="w-24 p-1 border"
                  >
                    <option value="">Band</option>
                    <option value="Red">Red</option>
                    <option value="Purple">Purple</option>
                    <option value="Grey">Grey</option>
                  </select>
                )}

                <select
                  value={set.difficulty}
                  onChange={(e) => handleInputChange(ex.name, idx, "difficulty", e.target.value)}
                  className="w-20 p-1 border"
                >
                  <option value="easy">Easy</option>
                  <option value="ok">Ok</option>
                  <option value="hard">Hard</option>
                </select>

                <button
                  type="button"
                  onClick={() => removeSet(ex.name, idx)}
                  className="text-red-600 font-bold px-2"
                >
                  &times;
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addSet(ex.name)}
              className="text-blue-600 font-semibold text-sm"
            >
              + Add Set
            </button>

            {/* Previous session info in grey */}
            {previous && (
              <div className="mt-2 text-xs text-gray-500 italic">
                Last session: {previous.sets} sets, {previous.reps} reps
                {previous.weight && `, ${previous.weight}kg`}
                {previous.band && `, band: ${previous.band}`}
                , difficulty: {previous.difficulty}
              </div>
            )}
          </div>
        );
      })}

      {/* Rest Timer Toggle and Display */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#eee",
          padding: 10,
          borderRadius: 8,
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          width: 160,
          userSelect: "none",
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <strong>Rest Timer</strong>
          <button
            onClick={() => setRestTimerVisible(!restTimerVisible)}
            className="text-sm text-blue-600"
          >
            {restTimerVisible ? "Hide" : "Show"}
          </button>
        </div>

        {restTimerVisible && (
          <>
            <div className="flex justify-between mb-2">
              {[30, 60, 90].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setRestSeconds(sec)}
                  className={`px-2 py-1 rounded ${
                    restSeconds === sec ? "bg-blue-600 text-white" : "bg-gray-300"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            <div className="text-center text-2xl mb-2">{timeLeft}s</div>

            {!timerRunning && (
              <button
                onClick={() => setTimerRunning(true)}
                className="w-full bg-green-600 text-white py-1 rounded"
              >
                Start
              </button>
            )}
            {timerRunning && (
              <button
                onClick={() => setTimerRunning(false)}
                className="w-full bg-red-600 text-white py-1 rounded"
              >
                Stop
              </button>
            )}
            <button
              onClick={() => {
                setTimerRunning(false);
                setTimeLeft(restSeconds);
              }}
              className="w-full bg-gray-400 text-white py-1 rounded mt-1"
            >
              Reset
            </button>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={onExit} className="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
        <button onClick={handleSave} className="bg-red-600 text-white px-4 py-2 rounded">
          Save Workout
        </button>
      </div>
    </div>
  );
}

export default WorkoutScreen;
