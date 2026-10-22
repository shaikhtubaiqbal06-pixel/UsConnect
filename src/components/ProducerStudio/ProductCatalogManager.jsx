import React from 'react';
import {
  Mic, 
  TrendingUp, 
  AlertTriangle, 
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProductCatalogManager() {
  const {
    products,
    currentProducer,
    updateProductStock,
    setAddProductModalOpen,
    setSelectedProductModal
  } = useApp();

  const producerProducts = products.filter((p) => p.producerId === currentProducer.id);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem' }}>Rural Craft & Produce Catalog</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Direct-to-consumer and B2B listing with verified GI tags and automatic fair pricing advice.
          </p>
        </div>

        <button
          id="catalog-add-product-btn"
          className="btn btn-primary"
          onClick={() => setAddProductModalOpen(true)}
        >
          <Mic size={16} />
          <span>+ Add Product (Voice or Form)</span>
        </button>
      </div>

      {/* Dynamic Fair Pricing Advisory Banner */}
      <div className="card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '1px solid #fed7aa', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <TrendingUp size={22} color="#c85a17" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#9a3412', marginBottom: '0.25rem' }}>
              💡 UsConnect Fair-Price Intelligence Active
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#7c2d12', lineHeight: 1.5 }}>
              Unlike predatory middle-tier traders who purchase handcrafted silk stoles at ₹600 and resell in metropolitan boutiques for ₹3,500, UsConnect guarantees you earn <strong>94% of the retail realization</strong>. Our price recommendation engine suggests optimal retail pricing to maximize both artisan revenue and customer demand.
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                <th style={{ padding: '1rem 1.25rem' }}>Product & Craft</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Your Price</th>
                <th style={{ padding: '1rem' }}>Urban Retail</th>
                <th style={{ padding: '1rem' }}>Your Cut (94%)</th>
                <th style={{ padding: '1rem' }}>Inventory</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {producerProducts.map((p) => {
                const artisanShare = Math.round(p.price * 0.94);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={p.image}
                          alt={p.title}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
                          <span style={{ fontSize: '0.75rem', color: '#0f4c3a', fontWeight: 600 }}>
                            🏷️ {p.giTag}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#475569' }}>{p.category}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                      ₹{p.price.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      ₹{p.marketPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#15803d' }}>
                      ₹{artisanShare.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px', minWidth: '24px' }}
                          onClick={() => updateProductStock(p.id, -1)}
                          disabled={p.stock <= 0}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                          {p.stock}
                        </span>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '2px 8px', minWidth: '24px' }}
                          onClick={() => updateProductStock(p.id, 5)}
                        >
                          +
                        </button>
                        {p.stock <= 5 && (
                          <span style={{ color: '#b45309', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <AlertTriangle size={12} /> Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setSelectedProductModal(p)}
                      >
                        <ExternalLink size={14} /> Preview Listing
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
