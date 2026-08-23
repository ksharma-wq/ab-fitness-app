"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
    };

    if (!data.name || !data.email || !data.password || !data.city) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.message || "Failed to register");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form" style={{ maxWidth: "500px" }}>
      <h2>Join AB Fitness</h2>
      <p className="desc">Create an account to start your fitness journey.</p>

      {error && (
        <div style={{ padding: "10px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input type="text" id="name" name="name" className="form-control" placeholder="John Doe" disabled={isLoading} />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input type="email" id="email" name="email" className="form-control" placeholder="you@example.com" disabled={isLoading} />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input type="password" id="password" name="password" className="form-control" placeholder="••••••••" disabled={isLoading} />
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" className="form-control" placeholder="+91 9876543210" disabled={isLoading} />
          </div>
          
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <select id="city" name="city" className="form-control" disabled={isLoading}>
              <option value="">Select City</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
        Already a member? <Link href="/login" className="auth-link">Log in</Link>
      </p>
    </div>
  );
}
