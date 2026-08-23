"use client";

import Link from "next/link";
import { Instagram, Twitter, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>AB<span className="text-gradient">Fitness</span></h3>
            <p>
              The premier fitness franchise in India. Uniting a community of champions with state-of-the-art facilities and elite training programs.
            </p>
            <div className="social-icons">
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={20} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/locations">Locations</Link></li>
              <li><Link href="/workouts">Workouts</Link></li>
              <li><Link href="/tips">Fitness Tips</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><Link href="/login">Member Login</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <MapPin size={16} />
                <span>Headquarters, Andheri West, Mumbai, MH</span>
              </li>
              <li>
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <Mail size={16} />
                <span>support@abfitness.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AB Fitness Franchise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
