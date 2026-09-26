import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function createGoal(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return;
  }

  const userId = (session.user as any).id;

  const type = String(formData.get("type") || "GENERAL");
  const title = String(formData.get("title") || "").trim();
  const target = Number(formData.get("target"));
  const unit = String(formData.get("unit") || "").trim();
  const deadlineValue = String(formData.get("deadline") || "");

  if (!title || !unit || !target || target <= 0) {
    return;
  }

  await db.fitnessGoal.create({
    data: {
      userId,
      type,
      title,
      target,
      current: 0,
      unit,
      deadline: deadlineValue ? new Date(deadlineValue) : null,
      status: "ACTIVE",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/goals");
}

async function completeGoal(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return;
  }

  const userId = (session.user as any).id;
  const goalId = String(formData.get("goalId") || "");

  if (!goalId) {
    return;
  }

  await db.fitnessGoal.updateMany({
    where: {
      id: goalId,
      userId,
    },
    data: {
      status: "COMPLETED",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/goals");
}

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const userId = (session.user as any).id;

  const goals = await db.fitnessGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const activeGoals = goals.filter((goal) => goal.status === "ACTIVE");
  const completedGoals = goals.filter((goal) => goal.status === "COMPLETED");

  return (
    <div>
      <div className="dashboard-header">
        <h1>Fitness Goals</h1>
        <p>Set and track your personal fitness goals.</p>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>
            Set a New Goal
          </h3>

          <form
            action={createGoal}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div>
              <label>Goal Title</label>
              <input
                name="title"
                type="text"
                placeholder="Example: Lose 5 kg"
                required
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <div>
              <label>Goal Type</label>
              <select
                name="type"
                defaultValue="WEIGHT_LOSS"
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                <option value="WEIGHT_LOSS">Weight Loss</option>
                <option value="WEIGHT_GAIN">Weight Gain</option>
                <option value="MUSCLE_GAIN">Muscle Gain</option>
                <option value="FITNESS">Fitness</option>
                <option value="STRENGTH">Strength</option>
                <option value="ENDURANCE">Endurance</option>
                <option value="GENERAL">General</option>
              </select>
            </div>

            <div>
              <label>Target</label>
              <input
                name="target"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="5"
                required
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <div>
              <label>Unit</label>
              <select
                name="unit"
                defaultValue="kg"
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="km">km</option>
                <option value="minutes">minutes</option>
                <option value="reps">reps</option>
                <option value="days">days</option>
              </select>
            </div>

            <div>
              <label>Deadline</label>
              <input
                name="deadline"
                type="date"
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create Goal
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>
            Active Goals ({activeGoals.length})
          </h3>

          {activeGoals.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>
              No active goals yet. Create your first goal!
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {activeGoals.map((goal) => {
                const percentage =
                  goal.target > 0
                    ? Math.min((goal.current / goal.target) * 100, 100)
                    : 0;

                return (
                  <div
                    key={goal.id}
                    style={{
                      padding: "1rem",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                    }}
                  >
                    <h4>{goal.title}</h4>

                    <p
                      style={{
                        color: "var(--text-secondary)",
                        margin: "0.5rem 0",
                      }}
                    >
                      {goal.current} / {goal.target} {goal.unit}
                    </p>

                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: "var(--background-secondary)",
                        borderRadius: "10px",
                        overflow: "hidden",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: "var(--primary)",
                        }}
                      />
                    </div>

                    {goal.deadline && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Deadline:{" "}
                        {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    )}

                    <form action={completeGoal} style={{ marginTop: "0.75rem" }}>
                      <input
                        type="hidden"
                        name="goalId"
                        value={goal.id}
                      />
                      <button type="submit" className="btn btn-secondary">
                        Mark Complete
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {completedGoals.length > 0 && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>
            Completed Goals ({completedGoals.length})
          </h3>

          {completedGoals.map((goal) => (
            <div
              key={goal.id}
              style={{
                padding: "0.75rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <strong>{goal.title}</strong>
              <span
                style={{
                  marginLeft: "1rem",
                  color: "var(--success)",
                }}
              >
                Completed
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}