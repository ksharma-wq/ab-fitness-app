"use client";

import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";

export default function WorkoutLoggerPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    setExercises([
      { id: '1', name: 'Barbell Bench Press' },
      { id: '2', name: 'Squat' },
      { id: '3', name: 'Deadlift' }
    ]);
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Workout Logger</h1>
        <p>Track your sets, reps, and weights to monitor your progress over time.</p>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 style={{ marginBottom: "1rem" }}>Log a Set</h3>
          {/* Static form for demonstration */}
          <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={(e) => { e.preventDefault(); alert("Saved locally! (API not connected)"); }}>
            <div className="form-group">
              <label>Exercise</label>
              <select className="form-control" name="exerciseId" required>
                <option value="">Select Exercise</option>
                {exercises.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Sets</label>
                <input type="number" className="form-control" defaultValue="3" required />
              </div>
              <div className="form-group">
                <label>Reps (per set)</label>
                <input type="number" className="form-control" defaultValue="10" required />
              </div>
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" step="0.5" className="form-control" placeholder="e.g. 60" required />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Log
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: "1rem" }}>Recent Logs</h3>
          <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-secondary)" }}>
            <ClipboardList size={48} style={{ margin: "0 auto", marginBottom: "1rem", opacity: 0.2 }} />
            <p>No workouts logged yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
