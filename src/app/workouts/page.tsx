import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

export const revalidate = 3600;

export default async function WorkoutsPage() {
  const plans = await db.workoutPlan.findMany();

  return (
    <main>
      <Navbar />
      <div className="container" style={{ padding: "var(--spacing-16) var(--spacing-4)", minHeight: "60vh" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "var(--spacing-8)" }}>Workout Library</h1>
        
        <div className="grid grid-cols-3">
          {plans.map((p) => (
            <Link href={`/workouts/${p.slug}`} key={p.id}>
              <div className="card hover:border-primary transition-all cursor-pointer h-full">
                <Dumbbell className="text-primary mb-4" size={32} />
                <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{p.name}</h3>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <span className="badge badge-primary">{p.category}</span>
                  <span className="badge" style={{ border: "1px solid var(--border-color)" }}>{p.difficulty}</span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
