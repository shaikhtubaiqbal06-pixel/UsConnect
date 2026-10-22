import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_PRODUCERS,
  INITIAL_PRODUCTS,
  VILLAGE_HUBS,
  INITIAL_ORDERS,
  INITIAL_WALLET,
  TRANSLATIONS,
  AI_KNOWLEDGE_BASE
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Persistence with localStorage fallback
  const [language, setLanguage] = useState(() => localStorage.getItem('usc_lang') || 'en');
  const [activeRole, setActiveRole] = useState(() => localStorage.getItem('usc_role') || 'producer');
  const [producerTab, setProducerTab] = useState('overview'); // overview, catalog, dispatch, wallet
  
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('usc_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [producers] = useState(INITIAL_PRODUCERS);
  const currentProducer = producers[0]; // Sunita Devi / Mithila Mahila Kala Samiti

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('usc_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('usc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem('usc_wallet');
    return saved ? JSON.parse(saved) : INITIAL_WALLET;
  });

  const [villageHubs, setVillageHubs] = useState(VILLAGE_HUBS);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toast, setToast] = useState(null);

  // Guided Simulation Tour state
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Modals state
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [selectedShippingLabel, setSelectedShippingLabel] = useState(null);
  const [selectedShipmentDetail, setSelectedShipmentDetail] = useState(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('usc_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('usc_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('usc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('usc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('usc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('usc_wallet', JSON.stringify(wallet));
  }, [wallet]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Translation helper
  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Text-To-Speech engine (Web Speech API)
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported on this browser.', 'warning');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language
    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      bn: 'bn-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      ta: 'ta-IN'
    };
    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 0.95; // Clear natural pace for rural comprehension

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Product management
  const addProduct = (newProd) => {
    const product = {
      ...newProd,
      id: 'p_' + Date.now(),
      producerId: currentProducer.id,
      producerName: currentProducer.name,
      rating: 5.0,
      reviewsCount: 1,
      readyForPickup: true,
      fairTradeScore: '98%',
      producerCutPercentage: 94
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`"${product.title}" has been listed on the national marketplace!`, 'success');
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    return product;
  };

  const updateProductStock = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  // Cart operations
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added ${product.title} to Cart`, 'success');
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  // Checkout and Order Placement with Escrow Guarantee
  const placeOrder = ({ buyerInfo, paymentMethod, paymentRef }) => {
    const newOrders = cart.map((item) => {
      const totalAmount = item.product.price * item.quantity;
      const producerPayout = Math.round(totalAmount * 0.94);
      const logisticsFee = Math.round(totalAmount * 0.03) || 40;
      const platformFee = totalAmount - producerPayout - logisticsFee;

      return {
        orderId: `USC-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        productId: item.product.id,
        productTitle: item.product.title,
        producerId: item.product.producerId,
        producerName: item.product.producerName,
        buyerName: buyerInfo.name,
        buyerCity: `${buyerInfo.city}, ${buyerInfo.state}`,
        buyerAddress: `${buyerInfo.address}, PIN: ${buyerInfo.pincode}`,
        buyerPhone: buyerInfo.phone,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalAmount,
        paymentMethod,
        paymentRef: paymentRef || `UPI/${Date.now().toString().slice(-8)}`,
        escrowStatus: 'Funds Held in Escrow',
        escrowAmount: totalAmount,
        producerPayout,
        logisticsFee,
        platformFee,
        orderStatus: 'Ready for Dispatch',
        trackingNumber: `TRK-USC-${item.product.producerId.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        hubId: 'HUB-BR-04',
        hubName: 'Madhubani North Rural Hub',
        history: [
          {
            time: 'Just now',
            event: `Order placed by ${buyerInfo.name}. ₹${totalAmount.toLocaleString()} securely locked in UsConnect Rural Escrow.`
          },
          {
            time: 'Just now',
            event: 'Artisan notification dispatched via SMS & App. Label ready for generation.'
          }
        ]
      };
    });

    // Deduct stock
    cart.forEach((item) => {
      updateProductStock(item.product.id, -item.quantity);
    });

    // Update wallet pending escrow
    const addedProducerPayout = newOrders
      .filter((o) => o.producerId === currentProducer.id)
      .reduce((sum, o) => sum + o.producerPayout, 0);

    if (addedProducerPayout > 0) {
      setWallet((prev) => ({
        ...prev,
        pendingEscrow: prev.pendingEscrow + addedProducerPayout,
        transactions: [
          {
            id: `TXN-ESC-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'ESCROW_HOLD',
            description: `Escrow hold for ${newOrders.length} order(s) - awaiting dispatch`,
            amount: addedProducerPayout,
            status: 'HELD_IN_ESCROW'
          },
          ...prev.transactions
        ]
      }));
    }

    setOrders((prev) => [...newOrders, ...prev]);
    clearCart();
    setCheckoutModalOpen(false);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 }
    });

    showToast('Payment Verified! Funds safely placed into Rural Escrow.', 'success');
    return newOrders;
  };

  // Request Cluster Pickup from Village Hub
  const requestClusterPickup = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          return {
            ...ord,
            orderStatus: 'Cluster Pickup Scheduled',
            history: [
              {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                event: 'Artisan requested batch pickup. Village Aggregation Van route alerted.'
              },
              ...ord.history
            ]
          };
        }
        return ord;
      })
    );
    showToast('Cluster Van pickup scheduled for this afternoon!', 'success');
  };

  // Progress Shipment Telemetry step-by-step
  const progressShipment = (orderId) => {
    let orderToUpdate = null;
    let nextStatus = '';
    let eventText = '';
    let shouldReleaseEscrow = false;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        orderToUpdate = ord;

        if (ord.orderStatus === 'Ready for Dispatch' || ord.orderStatus === 'Cluster Pickup Scheduled') {
          nextStatus = 'Collected by Village Van';
          eventText = 'Scanned by Dak-Mitra Van at village cluster hub. En route to District Distribution Depot.';
        } else if (ord.orderStatus === 'Collected by Village Van') {
          nextStatus = 'In Transit (Inter-City Express)';
          eventText = 'Arrived at State Hub sort facility. Dispatched on high-speed postal freight line.';
        } else if (ord.orderStatus === 'In Transit (Inter-City Express)') {
          nextStatus = 'Out for Delivery';
          eventText = 'Package reached buyer local delivery center. Courier out for doorstep delivery.';
        } else if (ord.orderStatus === 'Out for Delivery') {
          nextStatus = 'Delivered';
          eventText = 'Delivered to buyer doorstep. OTP verified. Instant Escrow Release triggered.';
          shouldReleaseEscrow = true;
        } else {
          return ord;
        }

        return {
          ...ord,
          orderStatus: nextStatus,
          escrowStatus: shouldReleaseEscrow ? 'Released to Artisan Wallet' : ord.escrowStatus,
          history: [
            {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              event: eventText
            },
            ...ord.history
          ]
        };
      })
    );

    if (shouldReleaseEscrow && orderToUpdate) {
      // Release payout to artisan wallet
      const payoutAmount = orderToUpdate.producerPayout;
      setWallet((prev) => ({
        ...prev,
        availableBalance: prev.availableBalance + payoutAmount,
        pendingEscrow: Math.max(0, prev.pendingEscrow - payoutAmount),
        transactions: [
          {
            id: `TXN-REL-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'PAYOUT_CREDIT',
            description: `Escrow Released for Order #${orderId} upon verified delivery`,
            amount: payoutAmount,
            status: 'COMPLETED'
          },
          ...prev.transactions
        ]
      }));

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      showToast(`🎉 Order #${orderId} Delivered! ₹${payoutAmount} credited to Artisan Wallet.`, 'success');
    } else {
      showToast(`Shipment #${orderId} updated to: ${nextStatus}`, 'info');
    }
  };

  // Instant Bank Withdrawal for Artisan
  const withdrawFunds = (amount) => {
    if (amount <= 0 || amount > wallet.availableBalance) {
      showToast('Insufficient available balance to withdraw', 'error');
      return false;
    }

    setWallet((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      totalWithdrawn: prev.totalWithdrawn + amount,
      transactions: [
        {
          id: `TXN-WTH-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'BANK_WITHDRAWAL',
          description: `Direct IMPS Transfer to ${currentProducer.bankAccount} (Ref: IMPS${Math.floor(10000000 + Math.random() * 90000000)})`,
          amount,
          status: 'COMPLETED'
        },
        ...prev.transactions
      ]
    }));

    showToast(`₹${amount.toLocaleString()} transferred instantly to your bank account via IMPS!`, 'success');
    confetti({ particleCount: 50, spread: 50 });
    return true;
  };

  // Pre-approved working capital micro-credit
  const claimMicroCredit = (amount) => {
    setWallet((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance + amount,
      microCreditPreApproved: Math.max(0, prev.microCreditPreApproved - amount),
      transactions: [
        {
          id: `TXN-CRD-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'MICRO_CREDIT',
          description: `NABARD-Backed Working Capital Advance (0% interest for 30 days)`,
          amount,
          status: 'COMPLETED'
        },
        ...prev.transactions
      ]
    }));
    showToast(`₹${amount.toLocaleString()} Working Capital credited to wallet!`, 'success');
    confetti({ particleCount: 60, spread: 60 });
  };

  // AI Gramin Sahayak chatbot responder
  const askGraminSahayak = (query) => {
    const qLower = query.toLowerCase();
    for (const kb of AI_KNOWLEDGE_BASE) {
      if (kb.keywords.some((kw) => qLower.includes(kw))) {
        return kb.answer;
      }
    }
    return `Namaste! I am your 24/7 UsConnect Gramin Sahayak. Regarding "${query}", you can connect with your local Village Cluster Coordinator or post a direct grievance in this chat. UsConnect protects rural producers with 100% Escrow and first-mile cluster pickup guarantee.`;
  };

  // Reset demo data
  const resetDemo = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setWallet(INITIAL_WALLET);
    setCart([]);
    showToast('Platform data reset to initial demo state', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeRole,
        setActiveRole,
        producerTab,
        setProducerTab,
        producers,
        currentProducer,
        products,
        addProduct,
        updateProductStock,
        orders,
        placeOrder,
        requestClusterPickup,
        progressShipment,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        wallet,
        withdrawFunds,
        claimMicroCredit,
        villageHubs,
        setVillageHubs,
        isSpeaking,
        speakText,
        stopSpeaking,
        toast,
        showToast,
        askGraminSahayak,
        resetDemo,
        // Modals
        addProductModalOpen,
        setAddProductModalOpen,
        checkoutModalOpen,
        setCheckoutModalOpen,
        cartOpen,
        setCartOpen,
        selectedProductModal,
        setSelectedProductModal,
        selectedShippingLabel,
        setSelectedShippingLabel,
        selectedShipmentDetail,
        setSelectedShipmentDetail,
        // Guided Tour
        tourOpen,
        setTourOpen,
        tourStep,
        setTourStep
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
