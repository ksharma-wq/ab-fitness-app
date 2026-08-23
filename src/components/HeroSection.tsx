"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import "./HeroSection.css";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function HeroSection() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random particles only on the client side to prevent hydration mismatches
    const newParticles: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 5,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-bg"></div>
      
      <div className="hero-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle animate-float"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-tagline">Premium All-India Franchise</div>
          <h1 className="hero-title">
            Forge Your Legacy at <br />
            <span className="text-gradient">AB Fitness</span>
          </h1>
          <p className="hero-desc">
            Experience world-class equipment, elite personal trainers, and unparalleled community across 25+ premium locations in India.
          </p>
          
          <div className="hero-actions">
            <Link href="/register" className="btn btn-primary btn-lg">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link href="/locations" className="btn btn-secondary btn-lg">
              <Play size={20} fill="currentColor" /> View Locations
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
