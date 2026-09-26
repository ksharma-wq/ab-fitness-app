import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function addProgress(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return;
  }

  const userId = (session.user as any).id;

  const dateValue = String(formData.get("date") || "");

  const weightValue = String(formData.get("weight") || "");
  const bodyFatValue = String(formData.get("bodyFat") || "");
  const chestValue = String(formData.get("chest") || "");
  const waistValue = String(formData.get("waist") || "");
  const hipsValue = String(formData.get("hips") || "");
  const bicepsValue = String(formData.get("biceps") || "");
  const thighsValue = String(formData.get("thighs") || "");
  const notes = String(formData.get("notes") || "").trim();

  const toNumberOrNull = (value: string) =>
    value === "" ? null : Number(value);

  await db.progressEntry.create({
    data: {
      userId,
      weight: toNumberOrNull(weightValue),
      bodyFat: toNumberOrNull(bodyFatValue),
      chest: toNumberOrNull(chestValue),
      waist: toNumberOrNull(waistValue),
      hips: toNumberOrNull(hipsValue),
      biceps: toNumberOrNull(bicepsValue),
      thighs: toNumberOrNull(thighsValue),
      notes: notes || null,
      date: dateValue ? new Date(dateValue) : new Date(),
    },
  });

  revalidatePath("/dashboard/progress");
}

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const userId = (session.user as any).id;

  const progressEntries = await db.progressEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <div className="dashboard-header">
        <h1>Progress Tracker</h1>
        <p>Track your body measurements and fitness progress.</p>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>
            Add Progress
          </h3>

          <form
            action={addProgress}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div>
              <label>Date</label>
              <input
                name="date"
                type="date"
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <div>
              <label>Weight (kg)</label>
              <input
                name="weight"
                type="number"
                step="0.1"
                placeholder="70"
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <div>
              <label>Body Fat (%)</label>
              <input
                name="bodyFat"
                type="number"
                step="0.1"
                placeholder="18"
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <div>
              <label>Chest (cm)</label>
              <input
                name="chest"
                type="number"
                step="0.1"
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <div>
              <label>Waist (cm)</label>
              <input
                name="waist"
                type="number"
                step="0.1"
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <div>
              <label>Hips (cm)</label>
              <input
                name="hips"
                type="number"
                step="0.1"
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <div>
              <label>Biceps (cm)</label>
              <input
                name="biceps"
                type="number"
                step="0.1"
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <div>
              <label>Thighs (cm)</label>
              <input
                name="thighs"
                type="number"
                step="0.1"
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <div>
              <label>Notes</label>
              <textarea
                name="notes"
                placeholder="How are you feeling today?"
                rows={3}
                style={{ width: "100%", marginTop: "0.5rem" }}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Progress
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>
            Progress History
          </h3>

          {progressEntries.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>
              No progress entries yet. Add your first measurement!
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {progressEntries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    padding: "1rem",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}
                >
                  <strong>
                    {new Date(entry.date).toLocaleDateString()}
                  </strong>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "0.5rem",
                      marginTop: "0.75rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    {entry.weight !== null && (
                      <div>Weight: {entry.weight} kg</div>
                    )}

                    {entry.bodyFat !== null && (
                      <div>Body Fat: {entry.bodyFat}%</div>
                    )}

                    {entry.chest !== null && (
                      <div>Chest: {entry.chest} cm</div>
                    )}

                    {entry.waist !== null && (
                      <div>Waist: {entry.waist} cm</div>
                    )}

                    {entry.hips !== null && (
                      <div>Hips: {entry.hips} cm</div>
                    )}

                    {entry.biceps !== null && (
                      <div>Biceps: {entry.biceps} cm</div>
                    )}

                    {entry.thighs !== null && (
                      <div>Thighs: {entry.thighs} cm</div>
                    )}
                  </div>

                  {entry.notes && (
                    <p
                      style={{
                        marginTop: "0.75rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {entry.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}