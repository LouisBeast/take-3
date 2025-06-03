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

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("calisthenics_sessions");
    if (stored) setSessions(JSON.parse(stored));
  }, []);

  // Save to localStorage on sessions change
  useEffect(() => {
    localStorage.setItem("calisthenics_sessions", JSON.stringify(sessions));
  }, [sessions]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.exercise || !form.reps || !form.sets) return alert("Please fill in required fields.");
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

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 16, fontFamily: "sans-serif" }}>
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
