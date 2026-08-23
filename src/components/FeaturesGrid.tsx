import { MapPin, Dumbbell, Users, Activity, Medal, ShieldCheck } from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      icon: <MapPin size={32} className="text-secondary" />,
      title: "All-India Access",
      description: "One membership card grants you access to over 25+ premium locations across major Indian cities."
    },
    {
      icon: <Dumbbell size={32} className="text-secondary" />,
      title: "Modern Equipment",
      description: "Train with top-of-the-line bio-mechanically engineered machines imported globally."
    },
    {
      icon: <Users size={32} className="text-secondary" />,
      title: "Certified Trainers",
      description: "Get personalized guidance from internationally certified fitness experts and nutritionists."
    },
    {
      icon: <Activity size={32} className="text-secondary" />,
      title: "Progress Tracking",
      description: "Log your workouts, track your body metrics, and visualize your fitness journey directly in the app."
    },
    {
      icon: <Medal size={32} className="text-secondary" />,
      title: "Group Classes",
      description: "Join high-energy Zumba, HIIT, Yoga, and CrossFit classes included in your Gold and Platinum tiers."
    },
    {
      icon: <ShieldCheck size={32} className="text-secondary" />,
      title: "Hygiene First",
      description: "We maintain hospital-grade sanitation protocols to ensure a safe and clean workout environment."
    }
  ];

  return (
    <section className="py-20" style={{ padding: "var(--spacing-16) 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "var(--spacing-4)" }}>Why Choose AB Fitness?</h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
            We've redefined the gym experience by blending luxury, technology, and hardcore fitness into one ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="card card-gradient">
              <div style={{ marginBottom: "var(--spacing-4)", color: "var(--secondary)" }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--spacing-2)" }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
