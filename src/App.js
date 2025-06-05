import React, { useState } from "react";

const splits = [
  {
    id: "push",
    label: "Push",
    color: "orange",
    icon: "💪", // You can replace with SVG or icon component
  },
  {
    id: "pull",
    label: "Pull",
    color: "orange",
    icon: "🤸‍♂️",
  },
  {
    id: "legsCore",
    label: "Legs & Core",
    color: "orange",
    icon: "🦵",
  },
  {
    id: "skillsMobility",
    label: "Skills & Mobility",
    color: "turquoise",
    icon: "🤸",
  },
];

function formatDate(date) {
  // e.g. Thursday 5th June 2025
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = dayNames[date.getDay()];

  const dateNum = date.getDate();
  let suffix = "th";
  if (dateNum === 1 || dateNum === 21 || dateNum === 31) suffix = "st";
  else if (dateNum === 2 || dateNum === 22) suffix = "nd";
  else if (dateNum === 3 || dateNum === 23) suffix = "rd";

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${dateNum}${suffix} ${month} ${year}`;
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [selectedSplit, setSelectedSplit] = useState(null);

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

      <div style={{ marginBottom: 20, textAlign: "center", fontWeight: "bold" }}>
        {formatDate(selectedDate)}
      </div>

      {/* Date Picker */}
      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <input
          type="date"
          value={selectedDate.toISOString().slice(0, 10)}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
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
                opacity: isSelected ? 1 : 0.8,
                boxShadow: isSelected
                  ? `0 0 10px ${color}`
                  : "0 2px 6px rgba(0,0,0,0.15)",
                transition: "opacity 0.2s, box-shadow 0.2s",
                userSelect: "none",
              }}
            >
              <span style={{ fontSize: 28, marginBottom: 6 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
