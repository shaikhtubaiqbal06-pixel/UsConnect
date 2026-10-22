import React from 'react';
import { 
  X, 
  Sparkles, 
  Truck, 
  CreditCard, 
  Mic, 
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GuidedTourModal() {
  const {
    tourOpen,
    setTourOpen,
    tourStep,
    setTourStep,
    setActiveRole,
    setProducerTab,
    setAddProductModalOpen
  } = useApp();

  if (!tourOpen) return null;

  const tourSteps = [
    {
      title: 'Problem: Fragmentation Across Sales, Payments, Logistics & Support',
      icon: <Sparkles size={32} color="#c85a17" />,
      tag: 'Overview & Solution',
      desc: 'Rural entrepreneurs struggle with isolated marketplaces taking 35% commissions, lack of first-mile village pickup, delayed payments, and language barriers. UsConnect combines all four pillars into one unified operating system.',
      actionLabel: 'Step 1: Rural Producer Cataloging →',
      action: () => {
        setTourStep(1);
        setActiveRole('producer');
        setProducerTab('catalog');
      }
    },
    {
      title: 'Pillar 1: Smart Voice & Camera Product Listing',
      icon: <Mic size={32} color="#c85a17" />,
      tag: 'Sales & Market Access',
      desc: 'Rural artisans can list handmade crafts or organic crops simply by speaking in their native dialect or clicking a photo. The system auto-generates fair pricing benchmarks, GI-certifications, and reaches nationwide buyers.',
      actionLabel: 'Launch Voice Product Studio →',
      action: () => {
        setTourStep(2);
        setActiveRole('producer');
        setProducerTab('catalog');
        setAddProductModalOpen(true);
      }
    },
    {
      title: 'Pillar 2: Direct Marketplace & 100% Escrow Payments',
      icon: <CreditCard size={32} color="#0f4c3a" />,
      tag: 'Financial Inclusion & Escrow',
      desc: 'Urban buyers purchase authentic rural crafts. Buyer funds are locked into UsConnect Rural Escrow—guaranteeing 94% net payout to the artisan immediately upon delivery with zero 30-day withholding.',
      actionLabel: 'Explore Buyer Marketplace & Cart →',
      action: () => {
        setTourStep(3);
        setActiveRole('buyer');
      }
    },
    {
      title: 'Pillar 3: Integrated First-Mile Cluster Logistics',
      icon: <Truck size={32} color="#4338ca" />,
      tag: 'First-Mile Aggregation',
      desc: 'No more traveling 30km to a city courier! Artisans print thermal barcode labels and request Village Cluster Van pickup. Dak-Mitra vehicles collect parcels on scheduled routes and sync live telemetry.',
      actionLabel: 'View Logistics Dispatch & Telemetry →',
      action: () => {
        setTourStep(4);
        setActiveRole('logistics');
      }
    },
    {
      title: 'Pillar 4: Instant Bank Withdrawal & AI Gramin Sahayak',
      icon: <ShieldCheck size={32} color="#15803d" />,
      tag: 'Payout & Grievance AI',
      desc: 'Upon delivery, escrow automatically unlocks into the artisan wallet. Sunita Devi can withdraw directly to her Jan Dhan account via IMPS in seconds, or ask the 24/7 AI Gramin Sahayak for packaging advice.',
      actionLabel: 'Open Wallet & AI Sahayak →',
      action: () => {
        setTourStep(0);
        setTourOpen(false);
        setActiveRole('producer');
        setProducerTab('wallet');
      }
    }
  ];

  const current = tourSteps[tourStep];

  return (
    <div className="modal-overlay" onClick={() => setTourOpen(false)}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '640px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🧭</span>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>UsConnect End-to-End Walkthrough</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Solving rural fragmentation step-by-step
              </span>
            </div>
          </div>
          <button 
            id="close-tour-modal-btn"
            className="modal-close-btn" 
            onClick={() => setTourOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="tour-modal-body">
          <div className="tour-step-card">
            <div className="tour-step-icon">
              {current.icon}
            </div>

            <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: '#fef3c7', color: '#92400e', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              {current.tag} • Step {tourStep + 1} of {tourSteps.length}
            </div>

            <h3>{current.title}</h3>
            <p>{current.desc}</p>

            <div className="tour-step-indicators">
              {tourSteps.map((_, i) => (
                <div 
                  key={i} 
                  className={`tour-dot ${i === tourStep ? 'active' : ''}`}
                  onClick={() => setTourStep(i)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              {tourStep > 0 && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => setTourStep(tourStep - 1)}
                >
                  Back
                </button>
              )}
              <button 
                id="tour-action-btn"
                className="btn btn-primary btn-lg"
                onClick={current.action}
              >
                <span>{current.actionLabel}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
