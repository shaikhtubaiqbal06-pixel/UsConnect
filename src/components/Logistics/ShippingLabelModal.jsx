import React from 'react';
import { 
  X, 
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ShippingLabelModal() {
  const {
    selectedShippingLabel,
    setSelectedShippingLabel,
    showToast
  } = useApp();

  if (!selectedShippingLabel) return null;
  const order = selectedShippingLabel;

  const handlePrint = () => {
    window.print();
    showToast('Shipping label sent to printer', 'info');
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedShippingLabel(null)}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '520px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={18} color="#0f4c3a" />
            <h3 style={{ fontSize: '1.15rem' }}>Thermal Barcode Shipping Label</h3>
          </div>
          <button 
            id="close-shipping-label-modal"
            className="modal-close-btn" 
            onClick={() => setSelectedShippingLabel(null)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Printable Thermal Label Sheet */}
          <div className="shipping-label-container" id="printable-thermal-label">
            {/* Header */}
            <div className="label-header">
              <div>
                <strong style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', display: 'block' }}>
                  UsConnect DAK-EXPRESS
                </strong>
                <span style={{ fontSize: '0.75rem' }}>RURAL FIRST-MILE AGGREGATION</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>AIR/SURFACE</span>
                <div style={{ fontSize: '0.7rem' }}>HUB: {order.hubId}</div>
              </div>
            </div>

            {/* Tracking Barcode simulation */}
            <div className="label-barcode">
              ||| |||| || | ||||| || ||||
              <div style={{ fontSize: '0.85rem', letterSpacing: '2px', marginTop: '4px' }}>
                {order.trackingNumber}
              </div>
            </div>

            {/* Consignee (Deliver To) */}
            <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', color: '#475569' }}>
                SHIP TO (BUYER):
              </span>
              <strong style={{ fontSize: '1rem', display: 'block' }}>{order.buyerName}</strong>
              <div style={{ fontSize: '0.85rem', lineHeight: 1.3 }}>
                {order.buyerAddress}
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                Phone: {order.buyerPhone}
              </div>
            </div>

            {/* Consignor (Sender) */}
            <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', color: '#475569' }}>
                RETURN TO / PRODUCER (SENDER):
              </span>
              <strong style={{ fontSize: '0.9rem', display: 'block' }}>{order.producerName}</strong>
              <div style={{ fontSize: '0.8rem' }}>
                {order.hubName}, State: Bihar / Rural Origin
              </div>
            </div>

            {/* Item & Escrow Verification Stamp */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.5rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', display: 'block' }}>ITEM: {order.quantity}x {order.productTitle.slice(0, 30)}...</span>
                <span style={{ fontSize: '0.75rem', display: 'block' }}>WEIGHT: 0.35 KG</span>
                <strong style={{ fontSize: '0.85rem', color: '#15803d', display: 'block', marginTop: '2px' }}>
                  ESCROW PRE-PAID (NO COD DUE)
                </strong>
              </div>

              {/* Fragile Craft Stamp */}
              <div style={{ border: '2px solid #0f172a', padding: '4px', textAlign: 'center', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>FRAGILE CRAFT</div>
                <div style={{ fontSize: '0.65rem' }}>GI AUTHENTIC</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              id="print-label-btn"
              className="btn btn-primary"
              onClick={handlePrint}
            >
              <Printer size={16} /> Print Thermal Label (4x6")
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedShippingLabel(null)}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
