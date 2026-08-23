import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TipsPage() {
  const faqs = [
    {
      q: "How to avoid injury during deadlifts?",
      a: "Keep your back straight (neutral spine), brace your core, and keep the bar close to your shins throughout the lift. Don't hyperextend at the top."
    },
    {
      q: "What should I eat post-workout?",
      a: "Consume 20-40g of high-quality protein (like whey, chicken, or tofu) along with fast-digesting carbs to replenish glycogen stores within 2 hours of your workout."
    },
    {
      q: "How many rest days do I need?",
      a: "It depends on your intensity, but generally 1-2 rest days per week are recommended to allow muscle fibers to repair and prevent central nervous system fatigue."
    }
  ];

  return (
    <main>
      <Navbar />
      <div className="container" style={{ padding: "var(--spacing-16) var(--spacing-4)", minHeight: "70vh" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "var(--spacing-2)", textAlign: "center" }}>Fitness Tips & FAQ</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-8)", fontSize: "1.25rem", textAlign: "center" }}>
            Expert advice for training, nutrition, and recovery.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {faqs.map((faq, i) => (
              <div key={i} className="card" style={{ padding: "var(--spacing-6)" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--primary)" }}>{faq.q}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
