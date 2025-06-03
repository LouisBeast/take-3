import React, { useState, useEffect } from "react";

const workoutSplits = {
  Pull: {
    "Pull-ups": "3 sets of 5–6 reps",
    "Assisted Pull-ups": "3 sets of 8 reps (with band)",
  },
  Push: {
    Dips: "4 sets of 8–10 reps",
    "Weighted Dips": "3 sets of 6–7 reps (10kg)",
  },
  Legs: {
    "Bodyweight Squats": "3 sets of 15 reps",
    Lunges: "3 sets of 12 reps each leg",
  },
  "Skills & Mobility": {
    "L-sit Hold": "3 sets of 10–20 seconds",
    "Skin the Cat": "3 sets of 5 reps",
  },
};

export default function App() {
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [split, setSplit] = useState("");
  const [inputs, setInputs] = useState({}); // { exerciseName: { sets, reps, weight, notes } }
  const [sessions, setSessions] = useState([]);

  // Rest timer
  const [restTime, setRestTime] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(restTime);

  // Load sessions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("calisthenics_sessions");
    if (stored) setSessions(JSON.parse(stored));
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem("calisthenics_sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Rest timer effect
  useEffect(() => {
    let timer = null;
    if (timerActive && secondsLeft > 0) {
      timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    } else if (secondsLeft === 0 && timerActive) {
      setTimerActive(false);
      alert("Rest time is over! Ready for next set?");
    }
    return () => clearTimeout(timer);
  }, [timerActive, secondsLeft]);

  // Handle input changes for exercises
  function handleInputChange(exercise, field, value) {
    setInputs((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [field]: value,
      },
    }));
  }

  // Save the session
  function handleSaveSession() {
    if (!date || !split) {
      alert("Please select both date and workout split.");
      return;
    }
    if (Object.keys(inputs).length === 0) {
      alert("Please enter data for at least one exercise.");
      return;
    }

    // Save session
    setSessions((prev) => [
      ...prev,
      {
        date,
        split,
        exercises: inputs,
      },
    ]);

    // Reset inputs & split
    setInputs({});
    setSplit("");
  }

  // Clear all sessions
  function clearAllSessions() {
    if (window.confirm("Clear all workout sessions?")) {
      setSessions([]);
      localStorage.removeItem("calisthenics_sessions");
    }
  }

  // Rest timer controls
  function startRest() {
    if (!timerActive) {
      setSecondsLeft(restTime);
      setTimerActive(true);
    }
  }
  function resetRest() {
    setTimerActive(false);
    setSecondsLeft(restTime);
  }
  function handleRestTimeChange(e) {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      setRestTime(val);
      if (!timerActive) setSecondsLeft(val);
    }
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 16,
        fontFamily: "sans-serif",
      }}
    >
      <h1>Calisthenics Tracker</h1>

      {/* Date & Split Selection */}
      <div style={{ marginBottom: 24 }}>
        <label>
          Date:{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label style={{ marginLeft: 20 }}>
          Workout Split:{" "}
          <select
            value={split}
            onChange={(e) => {
              setSplit(e.target.value);
              setInputs({});
            }}
            required
          >
            <option value="">Select Split</option>
            {Object.keys(workoutSplits).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Exercises for chosen split */}
      {split && (
        <>
          <h2>{split} Exercises</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSession();
            }}
          >
            {Object.entries(workoutSplits[split]).map(
              ([exercise, recommendation]) => {
                const current = inputs[exercise] || {
                  sets: "",
                  reps: "",
                  weight: "",
                  notes: "",
                };
                return (
                  <div
                    key={exercise}
                    style={{
                      border: "1px solid #ddd",
                      padding: 12,
                      marginBottom: 12,
                      borderRadius: 6,
                    }}
                  >
                    <strong>{exercise}</strong>
                    <div
                      style={{
                        fontStyle: "italic",
                        color: "#555",
                        marginBottom: 8,
                      }}
                    >
                      Recommendation: {recommendation}
                    </div>
                    <label>
                      Sets:{" "}
                      <input
                        type="number"
                        min="1"
                        required
                        value={current.sets}
                        onChange={(e) =>
                          handleInputChange(exercise, "sets", e.target.value)
                        }
                        style={{ width: 60, marginRight: 12 }}
                      />
                    </label>
                    <label>
                      Reps:{" "}
                      <input
                        type="number"
                        min="1"
                        required
                        value={current.reps}
                        onChange={(e) =>
                          handleInputChange(exercise, "reps", e.target.value)
                        }
                        style={{ width: 60, marginRight: 12 }}
                      />
                    </label>
                    <label>
                      Weight (kg):{" "}
                      <input
                        type="number"
                        min="0"
                        value={current.weight}
                        onChange={(e) =>
                          handleInputChange(exercise, "weight", e.target.value)
                        }
                        placeholder="Optional"
                        style={{ width: 80, marginRight: 12 }}
                      />
                    </label>
                    <label>
                      Notes:{" "}
                      <input
                        type="text"
                        value={current.notes}
                        onChange={(e) =>
                          handleInputChange(exercise, "notes", e.target.value)
                        }
                        placeholder="Optional"
                        style={{ width: "60%" }}
                      />
                    </label>
                  </div>
                );
              }
            )}

            <button
              type="submit"
              style={{
                padding: "8px 20px",
                fontSize: "1rem",
                cursor: "pointer",
                marginBottom: 24,
              }}
            >
              Save Workout Session
            </button>
          </form>
        </>
      )}

      {/* Rest Timer Section */}
      <div
        style={{
          marginTop: 20,
          padding: 12,
          border: "1px solid #ccc",
          borderRadius: 6,
          maxWidth: 300,
        }}
      >
        <h3>Rest Timer</h3>
        <label>
          Rest duration (seconds):{" "}
          <input
            type="number"
            value={restTime}
            onChange={handleRestTimeChange}
            min="10"
            max="300"
            style={{ width: 60 }}
            disabled={timerActive}
          />
        </label>
        <div style={{ marginTop: 8, fontSize: "1.5rem" }}>
          {timerActive ? (
            <span>Time left: {secondsLeft}s</span>
          ) : (
            <span>Timer is stopped</span>
          )}
        </div>
        <button
          onClick={startRest}
          disabled={timerActive}
          style={{ marginRight: 8 }}
        >
          Start Rest
        </button>
        <button onClick={resetRest} disabled={!timerActive}>
          Reset
        </button>
      </div>

      <hr />

      {/* Display saved sessions */}
      <h2>Saved Workout Sessions</h2>
      {sessions.length === 0 && <p>No sessions logged yet.</p>}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {sessions.map((session, i) => (
          <li
            key={i}
            style={{
              border: "1px solid #ddd",
              borderRadius: 4,
              padding: 8,
              marginBottom: 8,
            }}
          >
            <strong>{session.date}</strong> — <em>{session.split}</em>
            <ul style={{ marginTop: 4 }}>
              {Object.entries(session.exercises).map(
                ([ex, { sets, reps, weight, notes }], idx) => (
                  <li key={idx}>
                    {ex}: {sets} sets × {reps} reps
                    {weight && ` @ ${weight}kg`}
                    {notes && ` (${notes})`}
                  </li>
                )
              )}
            </ul>
          </li>
        ))}
      </ul>

      <button
        onClick={clearAllSessions}
        style={{
          marginTop: 24,
          backgroundColor: "#c33",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          cursor: "pointer",
          borderRadius: 4,
        }}
      >
        Clear All Sessions
      </button>
    </div>
  );
}
