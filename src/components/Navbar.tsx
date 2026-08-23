"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link href="/" className="navbar-logo">
          AB<span className="text-gradient">Fitness</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links desktop-only">
          <Link href="/locations">Locations</Link>
          <Link href="/workouts">Workouts</Link>
          <Link href="/tips">Fitness Tips</Link>
        </div>

        <div className="navbar-actions desktop-only">
          {session ? (
            <>
              <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
              <button onClick={() => signOut()} className="btn btn-primary">Log Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">Log In</Link>
              <Link href="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <Link href="/locations" onClick={() => setIsOpen(false)}>Locations</Link>
          <Link href="/workouts" onClick={() => setIsOpen(false)}>Workouts</Link>
          <Link href="/tips" onClick={() => setIsOpen(false)}>Fitness Tips</Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <button onClick={() => { signOut(); setIsOpen(false); }}>Log Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)}>Log In</Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
