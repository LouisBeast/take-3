import React from "react";

function SessionSummary({ summaryData, goHome }) {
  const { date, split, log } = summaryData;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Session Summary</h2>
      <p className="text-gray-600 mb-4">{new Date(date).toDateString()} — {split}</p>

      {Object.entries(log).map(([exercise, sets], idx) => (
        <div key={idx} className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">{exercise}</h3>
          <div className="space-y-2">
            {sets.map((set, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 text-sm">
                <div>Set {i + 1}: <strong>{set.reps || "-"} reps</strong></div>
                <div>{set.weight || "—"}</div>
                <div className={`font-medium ${set.difficulty === "Hard" ? "text-red-600" : set.difficulty === "Easy" ? "text-green-600" : "text-yellow-600"}`}>
                  {set.difficulty || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={goHome}
        className="mt-4 py-3 w-full rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
      >
        Back to Home
      </button>
    </div>
  );
}

export default SessionSummary;
