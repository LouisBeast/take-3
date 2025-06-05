import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const splits = {
  Push: ["Dips", "Weighted Dips", "Pseudo Planche Push-up"],
  Pull: ["Pull-ups", "Assisted Pull-ups", "Australian Rows"],
  "Legs & Core": ["Pistol Squats", "Hanging Leg Raises"],
  "Skills & Mobility": ["Handstand", "Front Lever", "L-sit"]
};

const timeRanges = {
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365
};

export default function ProgressChart({ allSessions }) {
  const [selectedSplit, setSelectedSplit] = useState("Push");
  const [timeRange, setTimeRange] = useState("3M");

  const filteredSessions = useMemo(() => {
    const now = new Date();
    const daysBack = timeRanges[timeRange];
    return allSessions.filter((s) => {
      const date = new Date(s.date);
      const diff = (now - date) / (1000 * 60 * 60 * 24);
      return diff <= daysBack && splits[selectedSplit].includes(s.exercise);
    });
  }, [selectedSplit, timeRange, allSessions]);

  const groupedByExercise = useMemo(() => {
    const grouped = {};
    filteredSessions.forEach((s) => {
      const date = s.date;
      if (!grouped[s.exercise]) grouped[s.exercise] = [];
      grouped[s.exercise].push({
        date,
        reps: parseInt(s.reps) || 0,
        weight: parseFloat(s.weight) || 0,
        difficulty: s.difficulty || "",
      });
    });
    return grouped;
  }, [filteredSessions]);

  const chartData = {
    labels: [...new Set(filteredSessions.map((s) => s.date))].sort(),
    datasets: Object.entries(groupedByExercise).map(([exercise, records], index) => ({
      label: exercise,
      data: records.map((r) => r.reps),
      borderColor: `hsl(${index * 80}, 70%, 50%)`,
      fill: false,
      tension: 0.2,
    })),
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Progress Tracker</h2>

      <div className="flex gap-2 mb-4">
        {Object.keys(splits).map((split) => (
          <button
            key={split}
            onClick={() => setSelectedSplit(split)}
            className={`px-3 py-1 rounded ${
              split === selectedSplit ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}
          >
            {split}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {Object.keys(timeRanges).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-2 py-1 rounded border ${
              range === timeRange ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {filteredSessions.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p className="text-gray-500">No data available for this selection yet.</p>
      )}
    </div>
  );
}
