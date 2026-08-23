"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./SandboxModal.css";

export default function PricingCards({ plans }: { plans: any[] }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [mockOrder, setMockOrder] = useState<any | null>(null);
  const [processingMock, setProcessingMock] = useState(false);

  const handleCheckout = async (plan: any) => {
    if (status === "unauthenticated") {
      router.push(`/register?plan=${plan.slug}`);
      return;
    }
    
    setLoadingPlan(plan.id);
    
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      if (data.isMock) {
        setMockOrder({ ...data, planId: plan.id });
      } else {
        // Here we would load Razorpay checkout
        alert("Real Razorpay checkout not fully implemented in this demo.");
      }
    } catch (err) {
      alert("Failed to initiate checkout");
      console.error(err);
    } finally {
      setLoadingPlan(null);
    }
  };

  const simulateSuccess = async () => {
    if (!mockOrder) return;
    setProcessingMock(true);
    
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: mockOrder.orderId,
          razorpay_payment_id: "pay_mock_12345",
          razorpay_signature: "mock_signature",
          planId: mockOrder.planId
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setMockOrder(null);
      router.push("/dashboard/membership");
      router.refresh();
    } catch (err) {
      alert("Verification failed");
    } finally {
      setProcessingMock(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3" style={{ alignItems: "center" }}>
        {plans.map((plan) => {
          const featuresList = JSON.parse(plan.features) as string[];
          return (
            <div 
              key={plan.id} 
              className={`card ${plan.popular ? 'card-gradient' : ''}`}
              style={{
                transform: plan.popular ? 'scale(1.05)' : 'none',
                zIndex: plan.popular ? 2 : 1,
                borderColor: plan.popular ? 'var(--primary)' : 'var(--border-color)',
                borderWidth: plan.popular ? '2px' : '1px'
              }}
            >
              {plan.popular && (
                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)' }}>
                  <span className="badge badge-primary" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 style={{ fontSize: "1.5rem", marginBottom: "var(--spacing-2)" }}>{plan.name}</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-6)", height: "40px" }}>{plan.description}</p>
              
              <div style={{ marginBottom: "var(--spacing-6)" }}>
                <span style={{ fontSize: "3rem", fontWeight: "800", color: "var(--text-primary)" }}>₹{plan.price}</span>
                <span style={{ color: "var(--text-secondary)" }}>/mo</span>
              </div>
              
              <ul style={{ listStyle: "none", marginBottom: "var(--spacing-8)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {featuresList.map((feature, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                    <Check size={16} className="text-secondary" style={{ flexShrink: 0 }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlan === plan.id}
                className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} 
                style={{ width: "100%" }}
              >
                {loadingPlan === plan.id ? <Loader2 size={16} className="animate-spin" /> : `Choose ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {mockOrder && (
        <div className="sandbox-modal-overlay">
          <div className="sandbox-modal card card-gradient">
            <h3 style={{ marginBottom: "0.5rem" }}>Sandbox Simulator</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
              Testing payment for <strong>{mockOrder.planName}</strong> plan.
            </p>
            
            <div style={{ background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Order ID</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{mockOrder.orderId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Amount</span>
                <span style={{ fontWeight: "bold" }}>₹{(mockOrder.amount / 100).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={simulateSuccess} 
                disabled={processingMock}
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                {processingMock ? <Loader2 size={16} className="animate-spin" /> : "Simulate Success"}
              </button>
              <button 
                onClick={() => setMockOrder(null)} 
                disabled={processingMock}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
