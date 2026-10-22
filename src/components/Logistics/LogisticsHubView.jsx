import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  FileText,
  Navigation
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LogisticsHubView() {
  const {
    villageHubs,
    orders,
    progressShipment,
    setSelectedShippingLabel
  } = useApp();

  const [selectedHub, setSelectedHub] = useState(villageHubs[0]);
  const [filterTracking, setFilterTracking] = useState('');

  return (
    <div>
      {/* Logistics Overview Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 24px rgba(30, 27, 75, 0.25)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.12)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#c7d2fe', marginBottom: '0.75rem', fontWeight: 600 }}>
          <Truck size={14} /> Gramin First-Mile Aggregation Network
        </div>
        <h2 style={{ fontSize: '1.85rem', color: 'white', marginBottom: '0.5rem' }}>
          Solving the Remote Rural "First-Mile" Bottleneck
        </h2>
        <p style={{ color: '#e0e7ff', fontSize: '0.95rem', maxWidth: '780px', lineHeight: 1.5 }}>
          Traditional couriers do not pick up from remote rural hamlets. UsConnect operates dedicated <strong>Village Cluster Hubs & Dak-Mitra pickup vans</strong> that aggregate handmade goods, scan thermal barcodes, and bridge directly into national postal and express transit.
        </p>
      </div>

      {/* Village Hub Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {villageHubs.map((hub) => {
          const isSelected = selectedHub.id === hub.id;
          return (
            <div
              key={hub.id}
              className="card"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                border: isSelected ? '2px solid #4338ca' : '1px solid #e2e8f0',
                background: isSelected ? 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)' : '#ffffff'
              }}
              onClick={() => setSelectedHub(hub)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {hub.id}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  {hub.status}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                {hub.name}
              </h4>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} /> {hub.village}, {hub.district} ({hub.state})
              </div>

              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.775rem', color: '#475569' }}>
                <div>Assigned Fleet: <strong>{hub.assignedVehicle}</strong></div>
                <div>Next Van Route: <strong style={{ color: '#4338ca' }}>{hub.nextScheduledPickup}</strong></div>
                <div>Coordinator: {hub.coordinator} ({hub.phone})</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Shipments Telemetry & Step-by-Step Simulator */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Live First-Mile to Doorstep Telemetry</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Track parcels in real time and test milestone advancement.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Filter by Tracking:</span>
            <input
              type="text"
              placeholder="e.g. TRK-USC..."
              className="form-input"
              style={{ width: '180px', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              value={filterTracking}
              onChange={(e) => setFilterTracking(e.target.value)}
            />
          </div>
        </div>

        {/* Shipments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders
            .filter((o) => !filterTracking || o.trackingNumber.toLowerCase().includes(filterTracking.toLowerCase()))
            .map((order) => {
              const isDelivered = order.orderStatus === 'Delivered';
              const stages = [
                'Ready for Dispatch',
                'Collected by Village Van',
                'In Transit (Inter-City Express)',
                'Out for Delivery',
                'Delivered'
              ];

              const currentStageIndex = stages.indexOf(order.orderStatus);

              return (
                <div
                  key={order.orderId}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    background: '#f8fafc'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                          Tracking ID: {order.trackingNumber}
                        </strong>
                        <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>
                          Order #{order.orderId}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                        <strong>{order.productTitle}</strong> (Origin: {order.producerName} → Destination: {order.buyerCity})
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedShippingLabel(order)}
                      >
                        <FileText size={14} /> View Label
                      </button>

                      {!isDelivered ? (
                        <button
                          id={`progress-btn-${order.orderId}`}
                          className="btn btn-primary btn-sm"
                          onClick={() => progressShipment(order.orderId)}
                        >
                          <Navigation size={14} /> Advance Next Milestone →
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Delivered & Escrow Released
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stage Progress Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', margin: '1.5rem 0 1rem' }}>
                    <div style={{ position: 'absolute', left: '15px', right: '15px', top: '15px', height: '3px', background: '#e2e8f0', zIndex: 1 }} />
                    <div
                      style={{
                        position: 'absolute',
                        left: '15px',
                        top: '15px',
                        height: '3px',
                        background: '#15803d',
                        zIndex: 1,
                        width: `${Math.max(0, (currentStageIndex / (stages.length - 1)) * 95)}%`,
                        transition: 'width 0.4s ease'
                      }}
                    />

                    {stages.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div key={idx} style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '20%' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: isCompleted ? '#15803d' : '#ffffff',
                              color: isCompleted ? '#ffffff' : '#64748b',
                              border: isCompleted ? '2px solid #15803d' : '2px solid #cbd5e1',
                              margin: '0 auto 6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              boxShadow: isCurrent ? '0 0 0 4px rgba(21, 128, 61, 0.2)' : 'none'
                            }}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              display: 'block',
                              color: isCurrent ? '#0f172a' : '#64748b',
                              fontWeight: isCurrent ? 700 : 500
                            }}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Latest Telemetry History Item */}
                  <div style={{ background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#334155' }}>
                    <span style={{ color: '#15803d', fontWeight: 700 }}>Telemetry Event: </span>
                    {order.history[0]?.event} (<em>{order.history[0]?.time}</em>)
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
