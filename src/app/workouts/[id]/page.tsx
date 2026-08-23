import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";

export default async function WorkoutDetailPage({ params }: { params: { id: string } }) {
  const plan = await db.workoutPlan.findUnique({
    where: { slug: params.id },
    include: {
      exercises: {
        include: { exercise: true },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!plan) return notFound();

  return (
    <main>
      <Navbar />
      <div className="container" style={{ padding: "var(--spacing-12) var(--spacing-4)", minHeight: "60vh" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--primary)" }}>{plan.name}</h1>
        
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <span className="badge badge-primary">{plan.category}</span>
          <span className="badge badge-success"><Clock size={12} className="inline mr-1" /> {plan.duration} mins</span>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "3rem", maxWidth: "800px" }}>
          {plan.description}
        </p>
        
        <h2 style={{ marginBottom: "1.5rem" }}>Exercises</h2>
        <div className="grid grid-cols-1">
          {plan.exercises.map((we, index) => (
            <div key={we.id} className="card" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-secondary)", width: "40px" }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{we.exercise.name}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{we.exercise.muscleGroup} • {we.exercise.equipment}</p>
                <p style={{ color: "var(--text-primary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>{we.exercise.instructions}</p>
              </div>
              <div style={{ textAlign: "right", minWidth: "100px" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{we.sets}x{we.reps}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Rest: {we.restSeconds}s</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
