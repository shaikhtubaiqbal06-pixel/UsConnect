import React, { useState } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PRESET_IMAGES = [
  {
    label: 'Madhubani Hand-painted Canvas',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    category: 'Handloom & Textiles',
    defaultTitle: 'Traditional Madhubani Peacock Canvas Wall Art',
    price: 1450,
    marketPrice: 2800,
    giTag: 'GI-Certified Madhubani Painting'
  },
  {
    label: 'Terracotta Sculpted Pot',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    category: 'Terracotta & Pottery',
    defaultTitle: 'Artisan Kiln-Fired Terracotta Planter & Vase',
    price: 520,
    marketPrice: 1100,
    giTag: 'Gramin Clay Craft'
  },
  {
    label: 'Wild Forest Spices / Cardamom',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    category: 'Organic Farm & Forest Produce',
    defaultTitle: 'Aromatic Green Cardamom Pods (Grade-A, 200g)',
    price: 640,
    marketPrice: 1050,
    giTag: 'Certified Organic Agro-Forest'
  },
  {
    label: 'Handcrafted Bamboo Basket',
    url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80',
    category: 'Woodcraft & Toys',
    defaultTitle: 'Natural Woven Bamboo Picnic & Storage Basket',
    price: 480,
    marketPrice: 950,
    giTag: 'Northeastern Bamboo Craft'
  }
];

export default function AddProductModal() {
  const {
    addProductModalOpen,
    setAddProductModalOpen,
    addProduct,
    currentProducer,
    showToast
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Handloom & Textiles');
  const [price, setPrice] = useState(1200);
  const [marketPrice, setMarketPrice] = useState(2400);
  const [stock, setStock] = useState(15);
  const [weightKg, setWeightKg] = useState(0.4);
  const [giTag, setGiTag] = useState('GI-Certified Madhubani Painting');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');

  if (!addProductModalOpen) return null;

  // Voice Listing Simulation & Web Speech Recognition if available
  const handleVoiceListing = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // Simulate voice input for low-bandwidth / unsupported browsers
      setIsListening(true);
      setTimeout(() => {
        const simulatedVoicePrompt = "I have 25 hand-painted Madhubani silk stoles with tree of life design, price is 1650 rupees each.";
        setSpeechTranscript(simulatedVoicePrompt);
        setTitle('Hand-painted Silk Stole with Tree of Life (Voice Listed)');
        setPrice(1650);
        setMarketPrice(2950);
        setStock(25);
        setCategory('Handloom & Textiles');
        setDescription('Authentic hand-painted silk stole created by artisan women using natural bamboo twigs and vegetable inks.');
        setIsListening(false);
        showToast('Voice listing recognized and catalog fields populated!', 'success');
      }, 1800);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSpeechTranscript(transcript);
        setTitle(transcript.slice(0, 50));
        setDescription(transcript);
        setIsListening(false);
        showToast('Voice recorded successfully!', 'success');
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setImage(preset.url);
    setCategory(preset.category);
    setTitle(preset.defaultTitle);
    setPrice(preset.price);
    setMarketPrice(preset.marketPrice);
    setGiTag(preset.giTag);
    setDescription(`Handcrafted with care by rural artisans in ${currentProducer.village}. Made with authentic natural ingredients and certified methods.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a title for the product', 'error');
      return;
    }

    addProduct({
      title,
      category,
      price: Number(price),
      marketPrice: Number(marketPrice),
      stock: Number(stock),
      weightKg: Number(weightKg),
      village: `${currentProducer.village} (${currentProducer.state})`,
      giTag,
      image,
      description: description || `Authentic handcrafted item directly from ${currentProducer.name}.`,
      specs: [
        { label: 'Craft Origin', val: currentProducer.village },
        { label: 'Artisan Lead', val: currentProducer.leadArtisan },
        { label: 'GI Certification', val: giTag },
        { label: 'Weight', val: `${weightKg} kg` }
      ]
    });

    setAddProductModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setAddProductModalOpen(false)}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '720px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.25rem' }}>✨</span>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Rural Product Studio</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Voice-Assisted & Low-Literacy Friendly Cataloging
              </span>
            </div>
          </div>
          <button 
            id="close-add-product-btn"
            className="modal-close-btn" 
            onClick={() => setAddProductModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Voice Input Wizard Box */}
          <div className="voice-assistant-box">
            <button
              type="button"
              id="voice-mic-trigger"
              className={`voice-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceListing}
              title="Click to speak in your local dialect"
            >
              {isListening ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <strong style={{ fontSize: '0.9rem', color: '#9a3412' }}>
                  {isListening ? 'Listening to your voice...' : 'Smart Voice Assistant (बोलकर उत्पाद जोड़ें)'}
                </strong>
                <Sparkles size={14} color="#ea580c" />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#7c2d12', margin: 0 }}>
                {speechTranscript 
                  ? `Heard: "${speechTranscript}"` 
                  : 'Tap the mic and speak in Hindi, Bengali, Telugu or English. (e.g. "I have 20 silk sarees for 1800 each").'}
              </p>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">
              Quick Craft Templates (1-Click Fill):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {PRESET_IMAGES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    border: image === preset.url ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    background: image === preset.url ? 'var(--primary-light)' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>
                    {preset.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Title & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Product Name / Craft Title *</label>
              <input
                id="product-title-input"
                type="text"
                className="form-input"
                placeholder="e.g. Hand-painted Madhubani Silk Stole"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select
                id="product-category-select"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Handloom & Textiles">Handloom & Textiles</option>
                <option value="Organic Farm & Forest Produce">Organic Farm & Forest Produce</option>
                <option value="Terracotta & Pottery">Terracotta & Pottery</option>
                <option value="Woodcraft & Toys">Woodcraft & Toys</option>
                <option value="Bamboo & Cane Craft">Bamboo & Cane Craft</option>
              </select>
            </div>
          </div>

          {/* Pricing & Realization Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Your Selling Price (₹)</label>
              <input
                id="product-price-input"
                type="number"
                className="form-input"
                value={price}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPrice(val);
                  setMarketPrice(Math.round(val * 1.75));
                }}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Urban Market Benchmark (₹)</label>
              <input
                id="product-market-price-input"
                type="number"
                className="form-input"
                value={marketPrice}
                onChange={(e) => setMarketPrice(Number(e.target.value))}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Initial Stock (Units)</label>
              <input
                id="product-stock-input"
                type="number"
                className="form-input"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                min="1"
                required
              />
            </div>
          </div>

          {/* Fair Trade Realization Preview */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.825rem', color: '#166534' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Your Net Payout (94% Direct Realization):</span>
              <span style={{ fontSize: '1rem', color: '#15803d' }}>₹{Math.round(price * 0.94)}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#15803d' }}>
              Cluster logistics (3% ≈ ₹{Math.round(price * 0.03)}) + UsConnect Maintenance (3% ≈ ₹{Math.round(price * 0.03)}).
            </span>
          </div>

          {/* GI Tag & Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">GI Tag / Certification</label>
              <select
                id="product-gitag-select"
                className="form-select"
                value={giTag}
                onChange={(e) => setGiTag(e.target.value)}
              >
                <option value="GI-Certified Madhubani Painting">GI-Certified Madhubani Painting</option>
                <option value="GI-Certified Kachchh Ajrakh">GI-Certified Kachchh Ajrakh</option>
                <option value="GI-Certified Channapatna Toys">GI-Certified Channapatna Toys</option>
                <option value="Certified Organic Agro-Forest">Certified Organic Agro-Forest</option>
                <option value="Gramin Clay Craft">Gramin Clay Craft</option>
                <option value="Self-Help Group Handcrafted">Self-Help Group Handcrafted</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Approx Weight (Kg)</label>
              <input
                id="product-weight-input"
                type="number"
                step="0.05"
                className="form-input"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Artisan Story & Material Details</label>
            <textarea
              id="product-desc-textarea"
              rows={3}
              className="form-textarea"
              placeholder="Describe the craft tradition, natural colors, or heritage process..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddProductModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-product-btn"
              className="btn btn-primary btn-lg"
            >
              <Check size={18} /> Publish to National Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
