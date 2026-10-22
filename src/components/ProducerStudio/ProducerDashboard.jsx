import React from 'react';
import { 
  Store, 
  Package, 
  Wallet, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Mic, 
  Building2, 
  AlertCircle,
  CheckCircle2,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ProductCatalogManager from './ProductCatalogManager';
import DispatchManager from './DispatchManager';
import WalletLedger from './WalletLedger';

export default function ProducerDashboard() {
  const {
    currentProducer,
    producerTab,
    setProducerTab,
    products,
    orders,
    wallet,
    villageHubs,
    setAddProductModalOpen,
    setSelectedShippingLabel,
    requestClusterPickup
  } = useApp();

  const producerProducts = products.filter((p) => p.producerId === currentProducer.id);
  const pendingOrders = orders.filter(
    (o) => o.producerId === currentProducer.id && o.orderStatus !== 'Delivered'
  );
  const readyToShipOrders = orders.filter(
    (o) => o.producerId === currentProducer.id && o.orderStatus === 'Ready for Dispatch'
  );

  const hubInfo = villageHubs.find((h) => h.id === 'HUB-BR-04') || villageHubs[0];

  return (
    <div>
      {/* Producer Identity Card */}
      <div className="producer-header">
        <div className="producer-profile-group">
          <img
            src={currentProducer.avatar}
            alt={currentProducer.leadArtisan}
            className="producer-avatar"
          />
          <div className="producer-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2>{currentProducer.name}</h2>
              <BadgeCheck size={20} color="#15803d" />
            </div>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Lead Artisan: <strong>{currentProducer.leadArtisan}</strong> • {currentProducer.village}, {currentProducer.state}
            </p>
            <div className="producer-tags">
              <span className="tag-pill gi">🏷️ {currentProducer.craftType}</span>
              <span className="tag-pill shg">🏛️ Reg: {currentProducer.shgRegistration}</span>
              <span className="tag-pill hub">📍 {currentProducer.clusterHub}</span>
              <span className="tag-pill" style={{ background: '#fef3c7', color: '#b45309' }}>
                ⭐ {currentProducer.rating} ({currentProducer.ordersCompleted} orders fulfilled)
              </span>
            </div>
          </div>
        </div>

        {/* Action Group */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            id="producer-add-product-btn"
            className="btn btn-primary"
            onClick={() => setAddProductModalOpen(true)}
          >
            <Mic size={16} />
            <span>+ Add Product (Voice AI)</span>
          </button>

          <button
            id="producer-withdraw-quick-btn"
            className="btn btn-forest"
            onClick={() => setProducerTab('wallet')}
          >
            <Wallet size={16} />
            <span>Wallet (₹{wallet.availableBalance.toLocaleString()})</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="producer-tabs">
        <button
          className={`p-tab-btn ${producerTab === 'overview' ? 'active' : ''}`}
          onClick={() => setProducerTab('overview')}
        >
          <Store size={16} />
          <span>Hub Overview</span>
        </button>

        <button
          id="p-tab-catalog-btn"
          className={`p-tab-btn ${producerTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setProducerTab('catalog')}
        >
          <Package size={16} />
          <span>Catalog & Stock ({producerProducts.length})</span>
        </button>

        <button
          id="p-tab-dispatch-btn"
          className={`p-tab-btn ${producerTab === 'dispatch' ? 'active' : ''}`}
          onClick={() => setProducerTab('dispatch')}
        >
          <Truck size={16} />
          <span>Fulfillment & Dispatch ({pendingOrders.length})</span>
          {readyToShipOrders.length > 0 && (
            <span style={{ background: '#c85a17', color: 'white', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px' }}>
              {readyToShipOrders.length}
            </span>
          )}
        </button>

        <button
          id="p-tab-wallet-btn"
          className={`p-tab-btn ${producerTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setProducerTab('wallet')}
        >
          <Wallet size={16} />
          <span>Escrow & Payout Wallet</span>
        </button>
      </div>

      {/* Tab Content Rendering */}
      {producerTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span>Available Bank Balance</span>
                <div className="metric-icon-box" style={{ background: '#dcfce7', color: '#15803d' }}>
                  <Wallet size={20} />
                </div>
              </div>
              <div className="metric-val">₹{wallet.availableBalance.toLocaleString()}</div>
              <div className="metric-footer" style={{ color: '#15803d' }}>
                <CheckCircle2 size={13} /> Ready for 1-click IMPS transfer
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Locked in Escrow</span>
                <div className="metric-icon-box" style={{ background: '#fef3c7', color: '#b45309' }}>
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div className="metric-val">₹{wallet.pendingEscrow.toLocaleString()}</div>
              <div className="metric-footer" style={{ color: '#b45309' }}>
                <Clock size={13} /> Releases automatically on hub dispatch
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Orders Pending Dispatch</span>
                <div className="metric-icon-box" style={{ background: '#ffedd5', color: '#c85a17' }}>
                  <Package size={20} />
                </div>
              </div>
              <div className="metric-val">{readyToShipOrders.length}</div>
              <div className="metric-footer" style={{ color: '#c85a17' }}>
                <Truck size={13} /> Next cluster pickup: {hubInfo.nextScheduledPickup}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span>Pre-Approved Micro-Credit</span>
                <div className="metric-icon-box" style={{ background: '#e0e7ff', color: '#4338ca' }}>
                  <Building2 size={20} />
                </div>
              </div>
              <div className="metric-val">₹{wallet.microCreditPreApproved.toLocaleString()}</div>
              <div className="metric-footer" style={{ color: '#4338ca' }}>
                <span>NABARD working capital facility (0% interest)</span>
              </div>
            </div>
          </div>

          {/* Actionable Alerts & Cluster Pickup Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Urgent Dispatch Action Card */}
            <div className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #c85a17' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={20} color="#c85a17" />
                  <h4 style={{ fontSize: '1.05rem' }}>Action Required: Order Ready to Pack</h4>
                </div>
                <span style={{ fontSize: '0.75rem', background: '#ffedd5', color: '#c85a17', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  Escrow Verified
                </span>
              </div>

              {readyToShipOrders.length > 0 ? (
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
                    <strong>{readyToShipOrders[0].productTitle}</strong> ordered by <em>{readyToShipOrders[0].buyerName}</em> ({readyToShipOrders[0].buyerCity}).
                    Amount: <strong>₹{readyToShipOrders[0].totalAmount}</strong> (Your share: <strong>₹{readyToShipOrders[0].producerPayout}</strong>).
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedShippingLabel(readyToShipOrders[0])}
                    >
                      <FileText size={15} /> Print Thermal Label
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => requestClusterPickup(readyToShipOrders[0].orderId)}
                    >
                      <Truck size={15} /> Alert Cluster Van
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  All orders have been dispatched to the Village Hub! Good job!
                </p>
              )}
            </div>

            {/* Village Cluster Hub Card */}
            <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={20} color="#15803d" />
                  <h4 style={{ fontSize: '1.05rem' }}>Village Aggregation Hub</h4>
                </div>
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  Live First-Mile Route
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.5rem' }}>
                <strong>{hubInfo.name}</strong> • Coordinator: {hubInfo.coordinator} ({hubInfo.phone})
              </p>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem' }}>
                Vehicle: <strong>{hubInfo.assignedVehicle}</strong> • Scheduled arrival at your cluster:{' '}
                <strong style={{ color: '#0f4c3a' }}>{hubInfo.nextScheduledPickup}</strong>.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setProducerTab('dispatch')}
              >
                View Hub Dispatch Schedule →
              </button>
            </div>
          </div>

          {/* Quick Catalog Preview */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Your Active Catalog Items</h3>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setProducerTab('catalog')}
            >
              Manage Catalog ({producerProducts.length}) →
            </button>
          </div>

          <div className="products-grid">
            {producerProducts.slice(0, 3).map((prod) => (
              <div key={prod.id} className="product-card">
                <div className="product-img-wrap">
                  <img src={prod.image} alt={prod.title} className="product-img" />
                  <div className="product-badge-overlay">
                    <span className="gi-chip">{prod.giTag}</span>
                    <span className="fair-cut-chip">{prod.producerCutPercentage}% Producer Cut</span>
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-village-origin">📍 {prod.village}</span>
                  <h4 className="product-title">{prod.title}</h4>
                  <div className="product-pricing-row">
                    <div>
                      <span className="price-main">₹{prod.price}</span>
                      <span className="price-market-strike">₹{prod.marketPrice}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: prod.stock > 5 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                      Stock: {prod.stock} units
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {producerTab === 'catalog' && <ProductCatalogManager />}
      {producerTab === 'dispatch' && <DispatchManager />}
      {producerTab === 'wallet' && <WalletLedger />}
    </div>
  );
}
