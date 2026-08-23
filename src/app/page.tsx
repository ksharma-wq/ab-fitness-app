import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import Footer from "@/components/Footer";
import PricingCards from "@/components/PricingCards";
import { db } from "@/lib/db";
import Link from "next/link";
import { Check } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const plans = await db.plan.findMany({
    where: { active: true },
    orderBy: { price: 'asc' }
  });

  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      
      {/* Pricing Section */}
      <section className="py-20" style={{ padding: "var(--spacing-16) 0", backgroundColor: "rgba(255,255,255,0.02)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "var(--spacing-4)" }}>Membership Plans</h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Choose the perfect tier for your fitness goals. Upgrade, downgrade, or cancel anytime.
            </p>
          </div>

          <PricingCards plans={plans} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
