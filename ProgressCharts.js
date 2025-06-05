import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function ProgressCharts({ allWorkoutData }) {
  const [split, setSplit] = useState("Push");
  const [timeframe, setTimeframe] = useState("3M");
  const [exercise, setExercise] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Get list of exercises for the selected split
  const getExercisesForSplit = () => {
    const exercises = new Set();
    allWorkoutData.forEach(session => {
      if (session.split === split) {
        Object.keys(session.log).forEach(ex => exercises.add(ex));
      }
    });
    return Array.from(exercises);
  };

  // Filter workouts by selected timeframe
  useEffect(() => {
    const cutoff = {
      "1M": 30,
      "3M": 90,
      "6M": 180,
      "1Y": 365
    }[timeframe];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - cutoff);

    const data = allWorkoutData
      .filter(session => session.split === split && new Date(session.date) >= cutoffDate)
      .map(session => {
        const sets = session.log[exercise] || [];
        const avgReps = sets.reduce((sum, s) => sum + (s.reps || 0), 0) / (sets.length || 1);
        const avgWeight = sets.reduce((sum, s) => sum + (parseFloat(s.weight) || 0), 0) / (sets.length || 1);
        return {
          date: new Date(session.date).toLocaleDateString(),
          avgReps,
          avgWeight,
        };
      });

    setFilteredData(data);
  }, [split, timeframe, exercise, allWorkoutData]);

  const chartData = {
    labels: filteredData.map(d => d.date),
    datasets: [
      {
        label: "Reps",
        data: filteredData.map(d => d.avgReps),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
      },
      {
        label: "Weight/Assistance",
        data: filteredData.map(d => d.avgWeight),
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.2)",
        tension: 0.3,
      },
    ]
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Progress Tracker</h2>

      <div className="flex gap-2 mb-4">
        {["Push", "Pull", "Legs & Core", "Skills & Mobility"].map(s => (
          <button
            key={s}
            className={`px-4 py-2 rounded ${split === s ? "bg-orange-500 text-white" : "bg-gray-200"}`}
            onClick={() => {
              setSplit(s);
              setExercise("");
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Timeframe:</label>
        <select className="border rounded p-2" value={timeframe} onChange={e => setTimeframe(e.target.value)}>
          <option value="1M">1 Month</option>
          <option value="3M">3 Months</option>
          <option value="6M">6 Months</option>
          <option value="1Y">1 Year</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block font-semibold">Exercise:</label>
        <select
          className="border rounded p-2 w-full"
          value={exercise}
          onChange={e => setExercise(e.target.value)}
        >
          <option value="">Select exercise</option>
          {getExercisesForSplit().map(ex => (
            <option key={ex} value={ex}>{ex}</option>
          ))}
        </select>
      </div>

      {filteredData.length > 0 && (
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' }}}} />
      )}

      {filteredData.length === 0 && exercise && (
        <p className="text-gray-500 mt-4">No data available for this exercise in the selected timeframe.</p>
      )}
    </div>
  );
}

export default ProgressCharts;
