import React from 'react';
import { 
  X, 
  Trash2, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQty,
    removeFromCart,
    clearCart,
    setCheckoutModalOpen
  } = useApp();

  if (!cartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalProducerCut = Math.round(subtotal * 0.94);
  const shippingFee = subtotal > 1500 || subtotal === 0 ? 0 : 75;
  const grandTotal = subtotal + shippingFee;

  const handleProceed = () => {
    setCartOpen(false);
    setCheckoutModalOpen(true);
  };

  return (
    <div 
      className="modal-overlay" 
      style={{ justifyContent: 'flex-end', padding: 0 }}
      onClick={() => setCartOpen(false)}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: 'white',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="#0f4c3a" />
            <h3 style={{ fontSize: '1.15rem' }}>Your Rural Cart ({cart.length})</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {cart.length > 0 && (
              <button
                id="clear-cart-btn"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                onClick={clearCart}
                title="Clear all items in cart"
              >
                Clear
              </button>
            )}
            <button 
              id="close-cart-drawer-btn"
              className="modal-close-btn" 
              onClick={() => setCartOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧺</div>
              <h4>Your Cart is Empty</h4>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Explore authentic regional crafts and organic forest harvest to support rural village producers.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item) => (
                <div 
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: '#0f4c3a', fontWeight: 600 }}>
                      📍 {item.product.village}
                    </div>
                    <h4 style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                      {item.product.title}
                    </h4>
                    <div style={{ fontWeight: 700, color: '#c85a17', fontSize: '0.95rem' }}>
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px' }}
                          onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px' }}
                          onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="modal-close-btn"
                        style={{ width: '28px', height: '28px', color: '#ef4444' }}
                        onClick={() => removeFromCart(item.product.id)}
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Rural Fair Trade Impact Note */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.85rem', fontSize: '0.8rem', color: '#166534' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, marginBottom: '2px' }}>
                  <Sparkles size={14} /> Direct Rural Impact
                </div>
                <strong>₹{totalProducerCut.toLocaleString()}</strong> will go directly into the Jan Dhan bank accounts of rural artisan women upon delivery.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span>Cluster Logistics Delivery:</span>
              <span>{shippingFee === 0 ? <strong style={{ color: '#15803d' }}>FREE</strong> : `₹${shippingFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              <span>Grand Total:</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>

            <button
              id="proceed-to-checkout-btn"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={handleProceed}
            >
              <ShieldCheck size={18} /> Proceed to Escrow Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
