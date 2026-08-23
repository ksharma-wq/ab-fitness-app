import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import "./membership.css";
import { QrCode, ShieldCheck } from "lucide-react";

export default async function MembershipPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return null;
  const userId = (session.user as any).id;

  const membership = await db.membership.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { plan: true }
  });

  const payments = await db.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div>
      <div className="dashboard-header">
        <h1>Your Membership</h1>
        <p>Manage your gym card and billing history.</p>
      </div>

      {membership ? (
        <div className="membership-container">
          {/* Virtual Gym Card */}
          <div className={`virtual-card tier-${membership.plan.tier.toLowerCase()}`}>
            <div className="card-top">
              <div className="card-logo">AB<span className="text-gradient">Fitness</span></div>
              <div className="card-tier">{membership.plan.tier}</div>
            </div>
            
            <div className="card-middle">
              <div className="card-chip"></div>
              <div className="card-number">{membership.cardNumber}</div>
            </div>
            
            <div className="card-bottom">
              <div className="card-info">
                <span className="label">MEMBER</span>
                <span className="value">{session.user.name}</span>
              </div>
              <div className="card-info text-right">
                <span className="label">VALID THRU</span>
                <span className="value">
                  {new Date(membership.endDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}
                </span>
              </div>
            </div>
            
            <div className="card-qr">
              <QrCode size={40} />
            </div>
            <div className="card-glow"></div>
          </div>
          
          <div className="membership-details card">
            <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck className="text-success" /> Active Plan Details
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Plan Name</p>
                <p style={{ fontWeight: "600" }}>{membership.plan.name}</p>
              </div>
              <div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Billing Cycle</p>
                <p style={{ fontWeight: "600" }}>Monthly (Auto-renew: {membership.autoRenew ? 'Yes' : 'No'})</p>
              </div>
              <div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Started On</p>
                <p style={{ fontWeight: "600" }}>{new Date(membership.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Valid Until</p>
                <p style={{ fontWeight: "600" }}>{new Date(membership.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <button className="btn btn-secondary">Cancel Auto-Renew</button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "var(--spacing-12)" }}>
          <h3 style={{ marginBottom: "var(--spacing-2)" }}>No Active Membership</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-6)" }}>
            You don't have an active membership plan. Choose a plan to start your fitness journey.
          </p>
          <Link href="/#pricing" className="btn btn-primary">
            View Plans
          </Link>
        </div>
      )}

      <div className="card" style={{ marginTop: "var(--spacing-8)" }}>
        <h3 style={{ marginBottom: "var(--spacing-4)" }}>Payment History</h3>
        
        {payments.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "0.75rem 0" }}>Date</th>
                <th style={{ padding: "0.75rem 0" }}>Description</th>
                <th style={{ padding: "0.75rem 0" }}>Amount</th>
                <th style={{ padding: "0.75rem 0" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "1rem 0" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem 0" }}>{p.description}</td>
                  <td style={{ padding: "1rem 0" }}>₹{p.amount}</td>
                  <td style={{ padding: "1rem 0" }}>
                    <span className={`badge badge-${p.status === 'SUCCESS' ? 'success' : 'primary'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>No past payments found.</p>
        )}
      </div>
    </div>
  );
}
