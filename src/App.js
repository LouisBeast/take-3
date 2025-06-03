import React, { useState, useEffect } from "react";

const recommendations = {
  "Pull-ups": "3 sets of 5–6 reps",
  "Assisted Pull-ups": "3 sets of 8 reps (with band)",
  "Dips": "4 sets of 8–10 reps",
  "Weighted Dips": "3 sets of 6–7 reps (10kg)",
};

export default function App() {
  const [form, setForm] = useState({
    exercise: "",
    reps: "",
    sets: "",
    weight: "",
    notes: "",
    date: new Date().toISOString().substring(0, 10),
  });

  const [sessions, setSessions] = useState([]);

  // Rest timer states
  const [restTime, setRestTime] = useState(60); // seconds
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(restTime);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("calisthenics_sessions");
    if (stored) setSessions(JSON.parse(stored));
  }, []);

  // Save to localStorage on sessions change
  useEffect(() => {
    localStorage.setItem("calisthenics_sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Timer effect
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

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.exercise || !form.reps || !form.sets)
      return alert("Please fill in required fields.");
    setSessions((prev) => [...prev, form]);
    setForm({
      exercise: "",
      reps: "",
      sets: "",
      weight: "",
      notes: "",
      date: new Date().toISOString().substring(0, 10),
    });
  }

  function handleClear() {
    if (window.confirm("Clear all sessions?")) {
      setSessions([]);
      localStorage.removeItem("calisthenics_sessions");
    }
  }

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
        maxWidth: 500,
        margin: "auto",
        padding: 16,
        fontFamily: "sans-serif",
      }}
    >
      <h1>Calisthenics Tracker</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <label>
          Date:{" "}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Exercise:{" "}
          <select
            name="exercise"
            value={form.exercise}
            onChange={handleChange}
            required
          >
            <option value="">Select Exercise</option>
            {Object.keys(recommendations).map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </label>

        {form.exercise && recommendations[form.exercise] && (
          <div
            style={{
              marginTop: 6,
              fontStyle: "italic",
              color: "#555",
              fontSize: "0.9rem",
            }}
          >
            Recommendation: {recommendations[form.exercise]}
          </div>
        )}

        <label style={{ display: "block", marginTop: 12 }}>
          Sets:{" "}
          <input
            type="number"
            name="sets"
            min="1"
            value={form.sets}
            onChange={handleChange}
            required
          />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Reps:{" "}
          <input
            type="number"
            name="reps"
            min="1"
            value={form.reps}
            onChange={handleChange}
            required
          />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Weight (kg):{" "}
          <input
            type="number"
            name="weight"
            min="0"
            value={form.weight}
            onChange={handleChange}
            placeholder="Optional"
          />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Notes:{" "}
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional"
            rows={3}
          />
        </label>

        <button
          type="submit"
          style={{
            marginTop: 16,
            padding: "8px 16px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Add Session
        </button>
      </form>

      {/* Rest Timer Section */}
      <div
        style={{
          marginTop: 20,
          padding: 12,
          border: "1px solid #ccc",
          borderRadius: 6,
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

      <h2>Workout Sessions</h2>
      {sessions.length === 0 && <p>No sessions logged yet.</p>}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {sessions.map((s, i) => (
          <li
            key={i}
            style={{
              border: "1px solid #ddd",
              borderRadius: 4,
              padding: 8,
              marginBottom: 8,
            }}
          >
            <strong>{s.date}</strong> - {s.exercise} - {s.sets} sets × {s.reps} reps{" "}
            {s.weight && `@ ${s.weight}kg`} <br />
            {s.notes && <em>Notes: {s.notes}</em>}
          </li>
        ))}
      </ul>

      <button
        onClick={handleClear}
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
        Clear All
      </button>
    </div>
  );
}
