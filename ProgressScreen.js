import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dummyData = {
  "Pull-Ups": [
    { date: "2025-04-01", reps: 4 },
    { date: "2025-04-10", reps: 5 },
    { date: "2025-05-01", reps: 6 },
    { date: "2025-06-01", reps: 7 },
  ],
  "Dips": [
    { date: "2025-04-01", reps: 6 },
    { date: "2025-04-10", reps: 7 },
    { date: "2025-05-01", reps: 8 },
    { date: "2025-06-01", reps: 10 },
  ]
};

const ProgressScreen = () => {
  const [selectedExercise, setSelectedExercise] = useState("Pull-Ups");
  const [range, setRange] = useState("3M");

  const data = dummyData[selectedExercise];

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: `${selectedExercise} Reps`,
      data: data.map(d => d.reps),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.3
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${selectedExercise} Progress` },
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">📈 Progress Tracker</h2>

      <div className="mb-4 flex gap-2 justify-center flex-wrap">
        {["Pull-Ups", "Dips"].map(ex => (
          <button
            key={ex}
            onClick={() => setSelectedExercise(ex)}
            className={`px-4 py-2 rounded ${selectedExercise === ex ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2 justify-center">
        {["1M", "3M", "6M", "1Y"].map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 text-sm rounded ${range === r ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProgressScreen;
