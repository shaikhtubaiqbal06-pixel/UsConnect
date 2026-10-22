import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MarketplaceView() {
  const {
    products,
    addToCart,
    setSelectedProductModal,
    setCheckoutModalOpen,
    t
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Handloom & Textiles',
    'Organic Farm & Forest Produce',
    'Terracotta & Pottery',
    'Woodcraft & Toys'
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.giTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickBuy = (product) => {
    addToCart(product, 1);
    setCheckoutModalOpen(true);
  };

  return (
    <div>
      {/* Marketplace Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f4c3a 0%, #176f55 100%)',
          color: 'white',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(15, 76, 58, 0.2)'
        }}
      >
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', color: '#a7f3d0' }}>
            <Sparkles size={14} /> 100% Direct-from-Village Fair Trade
          </div>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Empowering India's Heritage Artisans & Organic Farmers
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Every purchase connects you directly with registered Self-Help Groups and GI-tagged clusters. Zero middleman markup, 100% Escrow Protection.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
            <div>
              <strong style={{ fontSize: '1.4rem', display: 'block' }}>94%</strong>
              <span style={{ color: '#a7f3d0' }}>Direct Artisan Realization</span>
            </div>
            <div>
              <strong style={{ fontSize: '1.4rem', display: 'block' }}>100%</strong>
              <span style={{ color: '#a7f3d0' }}>Safe Escrow Protection</span>
            </div>
            <div>
              <strong style={{ fontSize: '1.4rem', display: 'block' }}>First-Mile</strong>
              <span style={{ color: '#a7f3d0' }}>Cluster Aggregation Network</span>
            </div>
          </div>
        </div>

        {/* Decorative background shape */}
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            bottom: '-60px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Search and Category Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Bar */}
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              id="marketplace-search-input"
              type="text"
              placeholder={t('searchPlaceholder')}
              className="form-input"
              style={{ paddingLeft: '42px', borderRadius: '9999px', background: 'white' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            <ShieldCheck size={16} color="#15803d" />
            <span>Escrow Protected Checkout</span>
          </div>
        </div>

        {/* Categories Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '9999px', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div
              className="product-img-wrap"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedProductModal(product)}
            >
              <img src={product.image} alt={product.title} className="product-img" />
              <div className="product-badge-overlay">
                <span className="gi-chip">🏷️ {product.giTag}</span>
                <span className="fair-cut-chip">✨ {product.producerCutPercentage}% to Artisan</span>
              </div>
            </div>

            <div className="product-info">
              <span className="product-village-origin">
                <MapPin size={13} /> {product.village}
              </span>

              <h4
                className="product-title"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedProductModal(product)}
              >
                {product.title}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
                <span style={{ color: '#d97706', display: 'flex', alignItems: 'center' }}>
                  <Star size={14} fill="#d97706" /> {product.rating}
                </span>
                <span>({product.reviewsCount} reviews)</span>
                <span>•</span>
                <span style={{ color: product.stock > 0 ? '#15803d' : '#dc2626' }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                </span>
              </div>

              <div className="product-pricing-row">
                <div>
                  <span className="price-main">₹{product.price.toLocaleString()}</span>
                  <span className="price-market-strike">₹{product.marketPrice.toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    id={`add-to-cart-${product.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.45rem 0.65rem' }}
                    onClick={() => addToCart(product, 1)}
                    title="Add to Cart"
                    disabled={product.stock <= 0}
                  >
                    <ShoppingBag size={15} />
                  </button>

                  <button
                    id={`buy-now-${product.id}`}
                    className="btn btn-primary btn-sm"
                    onClick={() => handleQuickBuy(product)}
                    disabled={product.stock <= 0}
                  >
                    Buy (Escrow)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
