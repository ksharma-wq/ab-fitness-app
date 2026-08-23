import "./auth.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <div className="auth-brand-content animate-float">
          <h1 className="auth-title">AB Fitness</h1>
          <p className="auth-subtitle">
            Join the most elite fitness franchise in India. Unrivaled equipment, expert trainers, and a community of champions.
          </p>
          <div className="auth-stats">
            <div className="stat-item">
              <h4>25+</h4>
              <p>Locations</p>
            </div>
            <div className="stat-item">
              <h4>10k+</h4>
              <p>Members</p>
            </div>
            <div className="stat-item">
              <h4>50+</h4>
              <p>Trainers</p>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-form-container">
        {children}
      </div>
    </div>
  );
}
