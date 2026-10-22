import React from 'react';
import { 
  Truck, 
  FileText, 
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DispatchManager() {
  const {
    orders,
    currentProducer,
    villageHubs,
    setSelectedShippingLabel,
    requestClusterPickup,
    progressShipment
  } = useApp();

  const producerOrders = orders.filter((o) => o.producerId === currentProducer.id);
  const hubInfo = villageHubs.find((h) => h.id === 'HUB-BR-04') || villageHubs[0];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem' }}>First-Mile Dispatch & Cluster Pickup Station</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Pack orders, print thermal QR shipping labels, and hand over to your scheduled village cluster van.
          </p>
        </div>

        {/* Hub schedule badge */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.6rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Truck size={20} color="#15803d" />
          <div style={{ fontSize: '0.825rem' }}>
            <span style={{ color: '#166534', fontWeight: 700 }}>Village Cluster Van Route:</span>
            <div style={{ color: '#15803d' }}>Next Stop at Your SHG: {hubInfo.nextScheduledPickup}</div>
          </div>
        </div>
      </div>

      {producerOrders.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Truck size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h4>No Orders in Queue</h4>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            When buyers place an order in the marketplace, it will appear here for packing and dispatch.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {producerOrders.map((order) => {
            const isDelivered = order.orderStatus === 'Delivered';
            const isReady = order.orderStatus === 'Ready for Dispatch';
            const isScheduled = order.orderStatus === 'Cluster Pickup Scheduled';

            return (
              <div key={order.orderId} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                        Order #{order.orderId}
                      </span>
                      <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>
                        {order.date}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          background: isDelivered ? '#dcfce7' : isScheduled ? '#e0e7ff' : '#ffedd5',
                          color: isDelivered ? '#15803d' : isScheduled ? '#4338ca' : '#c85a17'
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1rem', color: '#1e293b' }}>
                      {order.quantity}x {order.productTitle}
                    </h4>
                  </div>

                  {/* Financial & Escrow Pill */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: isDelivered ? '#15803d' : '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                      <ShieldCheck size={14} />
                      {order.escrowStatus}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
                      Your share: <strong>₹{order.producerPayout}</strong> (94%)
                    </div>
                  </div>
                </div>

                {/* Buyer & Delivery Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>RECIPIENT & DESTINATION:</span>
                    <strong style={{ color: '#0f172a' }}>{order.buyerName}</strong>
                    <div style={{ color: '#475569' }}>{order.buyerAddress}</div>
                    <div style={{ color: '#64748b' }}>📞 {order.buyerPhone}</div>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>LOGISTICS ROUTE:</span>
                    <div>Tracking ID: <strong style={{ color: '#0f4c3a' }}>{order.trackingNumber}</strong></div>
                    <div>Local Aggregation Hub: <strong>{order.hubName}</strong></div>
                    <div style={{ color: '#64748b' }}>Assigned Fleet: {hubInfo.assignedVehicle}</div>
                  </div>

                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>LATEST MILESTONE:</span>
                    <div style={{ color: '#334155', fontStyle: 'italic' }}>
                      "{order.history[0]?.event}"
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Timestamp: {order.history[0]?.time}
                    </span>
                  </div>
                </div>

                {/* Action Buttons for this Order */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      id={`print-label-${order.orderId}`}
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedShippingLabel(order)}
                    >
                      <FileText size={15} /> Print Shipping Barcode
                    </button>

                    {isReady && (
                      <button
                        id={`request-pickup-${order.orderId}`}
                        className="btn btn-primary btn-sm"
                        onClick={() => requestClusterPickup(order.orderId)}
                      >
                        <Truck size={15} /> Request Cluster Van Pickup
                      </button>
                    )}
                  </div>

                  {/* Simulator Trigger */}
                  {!isDelivered && (
                    <button
                      id={`simulate-step-${order.orderId}`}
                      className="btn btn-outline btn-sm"
                      onClick={() => progressShipment(order.orderId)}
                      title="Advance to next logistics milestone"
                    >
                      <span>⚡ Fast-Forward Milestone →</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
