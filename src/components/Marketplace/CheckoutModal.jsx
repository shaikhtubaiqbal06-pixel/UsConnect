import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CheckoutModal() {
  const {
    checkoutModalOpen,
    setCheckoutModalOpen,
    cart,
    placeOrder,
    showToast
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, COD
  const [buyerName, setBuyerName] = useState('Dr. Radhika Sen');
  const [phone, setPhone] = useState('+91 98451 99201');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560103');
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Bellandur');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!checkoutModalOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      placeOrder({
        buyerInfo: {
          name: buyerName,
          phone,
          city,
          state,
          pincode,
          address
        },
        paymentMethod: paymentMethod === 'UPI' ? 'Instant UPI (QR Escrow)' : paymentMethod === 'CARD' ? 'RuPay Card' : 'Guaranteed COD',
        paymentRef: `PAY-USC-${Date.now().toString().slice(-8)}`
      });

      setIsProcessing(false);
      setCheckoutModalOpen(false);
      showToast('Payment successful! ₹' + totalAmount.toLocaleString() + ' locked in Rural Escrow.', 'success');
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={() => setCheckoutModalOpen(false)}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '680px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🛡️</span>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>UsConnect Escrow-Protected Checkout</h3>
              <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
                ✓ Guaranteed Protection for Buyer & Rural Artisan
              </span>
            </div>
          </div>
          <button 
            id="close-checkout-modal-btn"
            className="modal-close-btn" 
            onClick={() => setCheckoutModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleCompleteOrder} className="modal-body">
          {/* How Escrow Works Banner */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.825rem', color: '#166534' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', color: '#15803d' }}>
              <ShieldCheck size={18} /> How Rural Escrow Protects You:
            </strong>
            <p style={{ margin: 0, lineHeight: 1.4 }}>
              Your money (₹{totalAmount.toLocaleString()}) does not go to middlemen. It is placed in an automated escrow vault. The rural artisan collective is notified to dispatch via the nearest Village Cluster Van, and funds are automatically transferred to their Jan Dhan account upon your verified delivery.
            </p>
          </div>

          {/* Shipping Address */}
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: '#334155' }}>
            1. Shipping & Contact Details
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                id="checkout-name-input"
                type="text"
                className="form-input"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number (For OTP Delivery)</label>
              <input
                id="checkout-phone-input"
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Street Address</label>
            <input
              id="checkout-address-input"
              type="text"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-input"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Postal Pincode</label>
              <input
                type="text"
                className="form-input"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: '#334155' }}>
            2. Escrow Payment Method
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              id="pay-method-upi"
              style={{
                border: paymentMethod === 'UPI' ? '2px solid var(--forest)' : '1px solid #e2e8f0',
                background: paymentMethod === 'UPI' ? 'var(--forest-light)' : '#ffffff',
                borderRadius: '10px',
                padding: '0.85rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onClick={() => setPaymentMethod('UPI')}
            >
              <QrCode size={22} color={paymentMethod === 'UPI' ? '#0f4c3a' : '#64748b'} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Instant UPI</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>GPay, PhonePe, Paytm</span>
            </div>

            <div
              id="pay-method-card"
              style={{
                border: paymentMethod === 'CARD' ? '2px solid var(--forest)' : '1px solid #e2e8f0',
                background: paymentMethod === 'CARD' ? 'var(--forest-light)' : '#ffffff',
                borderRadius: '10px',
                padding: '0.85rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onClick={() => setPaymentMethod('CARD')}
            >
              <CreditCard size={22} color={paymentMethod === 'CARD' ? '#0f4c3a' : '#64748b'} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>RuPay / Cards</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Zero Merchant Surcharge</span>
            </div>

            <div
              id="pay-method-cod"
              style={{
                border: paymentMethod === 'COD' ? '2px solid var(--forest)' : '1px solid #e2e8f0',
                background: paymentMethod === 'COD' ? 'var(--forest-light)' : '#ffffff',
                borderRadius: '10px',
                padding: '0.85rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onClick={() => setPaymentMethod('COD')}
            >
              <Truck size={22} color={paymentMethod === 'COD' ? '#0f4c3a' : '#64748b'} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Verified COD</div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Pay on Delivery</span>
            </div>
          </div>

          {/* Interactive UPI QR Simulator */}
          {paymentMethod === 'UPI' && (
            <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-block', background: 'white', padding: '0.75rem', borderRadius: '10px', boxShadow: 'var(--shadow-sm)', marginBottom: '0.75rem' }}>
                {/* Simulated high-clarity QR code */}
                <div style={{ width: '130px', height: '130px', background: 'repeating-conic-gradient(#0f172a 0% 25%, #ffffff 0% 50%) 50% / 10px 10px', border: '4px solid #0f172a', borderRadius: '6px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, color: '#0f4c3a' }}>
                    UPI ESCROW
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                Scan with any UPI App or click below to simulate instant payment
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                UPI ID: escrow.usconnect@rbi.npci • Amount: ₹{totalAmount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Footer Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>TOTAL ESCROW AMOUNT:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>

            <button
              id="confirm-order-escrow-btn"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isProcessing}
            >
              {isProcessing ? 'Verifying Escrow Lock...' : `Lock ₹${totalAmount.toLocaleString()} in Escrow & Order →`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
