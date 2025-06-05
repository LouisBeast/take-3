import React, { useState } from "react";

const splits = [
  { id: "push", label: "Push", color: "orange", icon: "💪" },
  { id: "pull", label: "Pull", color: "orange", icon: "🧗" },
  { id: "legsCore", label: "Legs & Core", color: "orange", icon: "🦵" },
  { id: "skillsMobility", label: "Skills & Mobility", color: "turquoise", icon: "🤸" },
];

function formatDate(date) {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = dayNames[date.getDay()];
  const dayNum = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const getSuffix = (n) => {
    if (n >= 11 && n <= 13) return "th";
    const lastDigit = n % 10;
    return lastDigit === 1 ? "st" : lastDigit === 2 ? "nd" : lastDigit === 3 ? "rd" : "th";
  };

  return `${day} ${dayNum}${getSuffix(dayNum)} ${month} ${year}`;
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSplit, setSelectedSplit] = useState(null);

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate)) setSelectedDate(newDate);
  };

  const handleBeginWorkout = () => {
    if (selectedSplit) {
      alert(`Starting ${selectedSplit} workout on ${formatDate(selectedDate)}`);
      // Here you would navigate to the workout screen
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: 20,
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 10 }}>CalisTracker</h1>

      <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: 8 }}>
        {formatDate(selectedDate)}
      </div>

      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
          style={{
            fontSize: 16,
            padding: "6px 10px",
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Split selection in 2x2 grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 15,
          marginBottom: 30,
        }}
      >
        {splits.map(({ id, label, color, icon }) => {
          const isSelected = selectedSplit === id;
          return (
            <button
              key={id}
              onClick={() => setSelectedSplit(id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                fontSize: 18,
                fontWeight: "600",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                color: "#fff",
                backgroundColor: color,
                opacity: isSelected ? 1 : 0.85,
                boxShadow: isSelected
                  ? `0 0 10px ${color}`
                  : "0 2px 6px rgba(0,0,0,0.15)",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 30, marginBottom: 6 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleBeginWorkout}
          disabled={!selectedSplit}
          style={{
            backgroundColor: selectedSplit ? "#e63946" : "#ccc",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: "bold",
            border: "none",
            cursor: selectedSplit ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          Begin Workout
        </button>
      </div>
    </div>
  );
}

  );
}
