import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreditCard, Activity, Target } from "lucide-react";
import Link from "next/link";

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return null;
  const userId = (session.user as any).id;

  const membership = await db.membership.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { plan: true }
  });

  const activeGoals = await db.fitnessGoal.count({
    where: { userId, status: "ACTIVE" }
  });

  const recentLogs = await db.workoutLog.count({
    where: { userId }
  });

  return (
    <div>
      <div className="dashboard-header">
        <h1>Welcome back, {session.user.name?.split(" ")[0]}!</h1>
        <p>Here's what's happening with your fitness journey today.</p>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-card-icon" style={{ color: "var(--primary)" }}>
            <CreditCard size={24} />
          </div>
          <div className="summary-card-info">
            <h3>{membership ? membership.plan.name : "None"}</h3>
            <p>Active Membership</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-card-icon" style={{ color: "var(--secondary)" }}>
            <Target size={24} />
          </div>
          <div className="summary-card-info">
            <h3>{activeGoals}</h3>
            <p>Active Goals</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-card-icon" style={{ color: "var(--success)" }}>
            <Activity size={24} />
          </div>
          <div className="summary-card-info">
            <h3>{recentLogs}</h3>
            <p>Workouts Logged</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link href="/dashboard/log" className="btn btn-primary" style={{ justifyContent: "flex-start" }}>
              Log a Workout
            </Link>
            <Link href="/dashboard/goals" className="btn btn-secondary" style={{ justifyContent: "flex-start" }}>
              Set a New Goal
            </Link>
            {!membership && (
              <Link href="/#pricing" className="btn btn-accent" style={{ justifyContent: "flex-start" }}>
                Get a Membership
              </Link>
            )}
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>Recent Activity</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            No recent activity found. Start logging your workouts to see them here!
          </p>
        </div>
      </div>
    </div>
  );
}
