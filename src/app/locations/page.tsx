import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { MapPin } from "lucide-react";

export const revalidate = 3600;

export default async function LocationsPage() {
  const locations = await db.gymLocation.findMany({
    where: { active: true },
    orderBy: { city: 'asc' }
  });

  return (
    <main>
      <Navbar />
      <div className="container" style={{ padding: "var(--spacing-16) var(--spacing-4)", minHeight: "60vh" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "var(--spacing-2)" }}>Our Locations</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-8)", fontSize: "1.25rem" }}>
          Find a premium AB Fitness club near you.
        </p>

        <div className="grid grid-cols-3">
          {locations.map((loc) => {
            const amenities = JSON.parse(loc.amenities) as string[];
            return (
              <div key={loc.id} className="card hover:border-primary transition-all">
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <MapPin style={{ color: "var(--primary)" }} size={24} />
                  <div>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{loc.name}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{loc.address}, {loc.city}, {loc.state}</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                  {amenities.map(amenity => (
                    <span key={amenity} className="badge badge-primary">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
