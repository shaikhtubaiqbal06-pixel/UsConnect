import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Headphones
} from 'lucide-react';

export default function Footer() {

  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', borderTop: '1px solid #1e293b', paddingTop: '3.5rem', paddingBottom: '2.5rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Pillars Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', paddingBottom: '2.5rem', borderBottom: '1px solid #1e293b', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🌾</span>
              <span>1. Direct Sales & Marketplace</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#94a3b8' }}>
              Eliminating predatory middlemen with verified GI tagging and voice-assisted cataloging for rural artisans.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem' }}>
              <ShieldCheck size={20} color="#22c55e" />
              <span>2. 100% Escrow Payments</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#94a3b8' }}>
              Instant release upon delivery directly to rural Jan Dhan bank accounts without 30-day corporate holds.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Truck size={20} color="#60a5fa" />
              <span>3. Village First-Mile Logistics</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#94a3b8' }}>
              Cluster aggregation hubs with scheduled Dak-Mitra pickup vans operating straight from village panchayats.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Headphones size={20} color="#f59e0b" />
              <span>4. AI Multilingual Sahayak</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#94a3b8' }}>
              24/7 conversational voice assistant, fair return arbitration, and zero-collateral working capital credit.
            </p>
          </div>
        </div>

        {/* Brand & Copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.825rem' }}>
          <div>
            <strong style={{ color: '#ffffff', fontSize: '1.05rem', display: 'block', marginBottom: '2px' }}>
              UsConnect (ग्रामीण सेतु)
            </strong>
            <span>Bridging rural Bharat with global conscious commerce.</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ color: '#22c55e' }}>✓ Aligned with ODOP & NABARD</span>
            <span style={{ color: '#60a5fa' }}>✓ Digital India & UPI Escrow</span>
            <span style={{ color: '#f59e0b' }}>✓ TRIFED Verified Clusters</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
