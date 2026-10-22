import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import GuidedTourModal from './components/GuidedTourModal';
import ProducerDashboard from './components/ProducerStudio/ProducerDashboard';
import AddProductModal from './components/ProducerStudio/AddProductModal';
import MarketplaceView from './components/Marketplace/MarketplaceView';
import ProductDetailModal from './components/Marketplace/ProductDetailModal';
import CartDrawer from './components/Marketplace/CartDrawer';
import CheckoutModal from './components/Marketplace/CheckoutModal';
import LogisticsHubView from './components/Logistics/LogisticsHubView';
import ShippingLabelModal from './components/Logistics/ShippingLabelModal';
import SupportAssistantView from './components/Support/SupportAssistantView';
import Footer from './components/Footer';

function MainLayout() {
  const { activeRole, toast } = useApp();

  return (
    <div className="app-container">
      {/* Top Header & Role Switcher */}
      <Header />

      {/* Main Workspace Body */}
      <main className="main-content">
        {activeRole === 'producer' && <ProducerDashboard />}
        {activeRole === 'buyer' && <MarketplaceView />}
        {activeRole === 'logistics' && <LogisticsHubView />}
        {activeRole === 'support' && <SupportAssistantView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <GuidedTourModal />
      <AddProductModal />
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <ShippingLabelModal />

      {/* Toast Notification Container */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
