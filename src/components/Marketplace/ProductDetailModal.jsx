import React from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ShoppingBag, 
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProductDetailModal() {
  const {
    selectedProductModal,
    setSelectedProductModal,
    addToCart,
    setCheckoutModalOpen,
    speakText,
    isSpeaking,
    stopSpeaking
  } = useApp();

  if (!selectedProductModal) return null;
  const p = selectedProductModal;

  const handleBuyNow = () => {
    addToCart(p, 1);
    setSelectedProductModal(null);
    setCheckoutModalOpen(true);
  };

  const readStoryAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(`${p.title}. Crafted in ${p.village}. ${p.description}. Certified with ${p.giTag}. Priced at ${p.price} rupees.`);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedProductModal(null)}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '820px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
              🏷️ {p.giTag}
            </span>
          </div>
          <button 
            id="close-product-detail-modal"
            className="modal-close-btn" 
            onClick={() => setSelectedProductModal(null)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Image & Badges */}
          <div>
            <div style={{ borderRadius: '14px', overflow: 'hidden', height: '360px', marginBottom: '1rem', background: '#f1f5f9' }}>
              <img
                src={p.image}
                alt={p.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1rem', fontSize: '0.825rem', color: '#166534' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <ShieldCheck size={18} color="#15803d" /> 100% Escrow Guarantee
              </div>
              <p style={{ margin: 0, lineHeight: 1.4 }}>
                Your payment is held safely by UsConnect Escrow. The artisan only receives release upon verified delivery to your doorstep.
              </p>
            </div>
          </div>

          {/* Details & Buy Action */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#0f4c3a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={15} /> {p.village}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={readStoryAloud}
                title="Listen to story"
              >
                <Volume2 size={14} /> Listen
              </button>
            </div>

            <h2 style={{ fontSize: '1.45rem', lineHeight: 1.3, marginBottom: '0.75rem' }}>
              {p.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                <Star size={15} fill="#d97706" /> {p.rating}
              </span>
              <span style={{ color: '#64748b' }}>({p.reviewsCount} customer reviews)</span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span style={{ color: '#15803d', fontWeight: 600 }}>By {p.producerName}</span>
            </div>

            {/* Pricing Card */}
            <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹{p.price.toLocaleString()}
                </span>
                <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                  ₹{p.marketPrice.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Save 45% vs Boutiques
                </span>
              </div>
              <span style={{ fontSize: '0.775rem', color: '#15803d', display: 'block', marginTop: '4px', fontWeight: 600 }}>
                ✓ {p.producerCutPercentage}% (₹{Math.round(p.price * 0.94)}) goes directly to the village artisan collective.
              </span>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: '#334155' }}>
                Artisan Story & Craft Tradition:
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
                {p.description}
              </p>
            </div>

            {/* Specs Table */}
            {p.specs && (
              <div style={{ marginBottom: '1.5rem', background: '#f8fafc', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem' }}>
                {p.specs.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: idx < p.specs.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                    <span style={{ color: '#64748b' }}>{s.label}:</span>
                    <strong style={{ color: '#1e293b' }}>{s.val}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
              <button
                id="modal-add-to-cart-btn"
                className="btn btn-secondary btn-lg"
                style={{ flex: 1 }}
                onClick={() => {
                  addToCart(p, 1);
                  setSelectedProductModal(null);
                }}
                disabled={p.stock <= 0}
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>

              <button
                id="modal-buy-now-btn"
                className="btn btn-primary btn-lg"
                style={{ flex: 1.2 }}
                onClick={handleBuyNow}
                disabled={p.stock <= 0}
              >
                Buy Now (Escrow) →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
