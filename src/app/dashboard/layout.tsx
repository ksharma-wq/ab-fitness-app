"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CreditCard, Target, Activity, ClipboardList, LogOut, Home } from "lucide-react";
import "./dashboard.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Membership", href: "/dashboard/membership", icon: <CreditCard size={20} /> },
    { name: "Fitness Goals", href: "/dashboard/goals", icon: <Target size={20} /> },
    { name: "Progress Tracker", href: "/dashboard/progress", icon: <Activity size={20} /> },
    { name: "Workout Logger", href: "/dashboard/log", icon: <ClipboardList size={20} /> },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/">
            <h2 className="logo">AB<span className="text-gradient">Fitness</span></h2>
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <Link href="/" className="nav-item">
            <Home size={20} />
            <span>Back to Home</span>
          </Link>
          <button className="nav-item btn-logout" onClick={() => signOut()}>
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
      
      <main className="dashboard-content">
        <div className="dashboard-container">
          {children}
        </div>
      </main>
    </div>
  );
}
