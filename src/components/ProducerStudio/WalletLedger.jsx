import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Download, 
  CreditCard,
  Percent,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WalletLedger() {
  const {
    wallet,
    currentProducer,
    withdrawFunds,
    claimMicroCredit,
    showToast
  } = useApp();

  const [withdrawAmount, setWithdrawAmount] = useState(5000);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (withdrawFunds(Number(withdrawAmount))) {
      setShowWithdrawDialog(false);
    }
  };

  const handleExportStatement = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Transaction ID,Date,Description,Type,Amount\n"
      + wallet.transactions.map(t => `"${t.id}","${t.date}","${t.description}","${t.type}","${t.amount}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `UsConnect_Ledger_${currentProducer.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Transaction statement downloaded successfully.", "success");
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem' }}>Financial Inclusion & Escrow Wallet</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Transparent micro-payouts, instant bank settlement, and working capital credit facility.
          </p>
        </div>

        <button
          id="open-withdraw-modal-btn"
          className="btn btn-forest"
          onClick={() => setShowWithdrawDialog(true)}
          disabled={wallet.availableBalance <= 0}
        >
          <ArrowUpRight size={16} />
          <span>Instant Bank Withdrawal</span>
        </button>
      </div>

      {/* Main Balances */}
      <div className="metrics-grid">
        <div className="metric-card" style={{ borderLeft: '4px solid #15803d' }}>
          <div className="metric-header">
            <span>Available Jan Dhan Balance</span>
            <div className="metric-icon-box" style={{ background: '#dcfce7', color: '#15803d' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div className="metric-val" style={{ color: '#15803d' }}>
            ₹{wallet.availableBalance.toLocaleString()}
          </div>
          <div className="metric-footer" style={{ color: '#475569' }}>
            Linked: {currentProducer.bankAccount}
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #d97706' }}>
          <div className="metric-header">
            <span>Pending In Escrow</span>
            <div className="metric-icon-box" style={{ background: '#fef3c7', color: '#b45309' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="metric-val" style={{ color: '#b45309' }}>
            ₹{wallet.pendingEscrow.toLocaleString()}
          </div>
          <div className="metric-footer" style={{ color: '#b45309' }}>
            <Clock size={13} /> Unlocks automatically on buyer delivery
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: '4px solid #0f4c3a' }}>
          <div className="metric-header">
            <span>Lifetime Payouts Dispatched</span>
            <div className="metric-icon-box" style={{ background: '#e8f5f1', color: '#0f4c3a' }}>
              <Building2 size={20} />
            </div>
          </div>
          <div className="metric-val" style={{ color: '#0f4c3a' }}>
            ₹{wallet.totalWithdrawn.toLocaleString()}
          </div>
          <div className="metric-footer" style={{ color: '#15803d' }}>
            100% verified digital audit trail
          </div>
        </div>
      </div>

      {/* Micro-Credit & Working Capital Card */}
      <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '1px solid #a7f3d0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ width: '44px', height: '44px', background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d', flexShrink: 0 }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h4 style={{ fontSize: '1.05rem', color: '#065f46' }}>
                  Pre-Approved Rural Working Capital Facility (ODOP / NABARD)
                </h4>
                <span style={{ fontSize: '0.75rem', background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  0% Interest
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#047857', maxWidth: '640px', lineHeight: 1.5 }}>
                Based on your flawless delivery track record ({currentProducer.ordersCompleted} orders), you have a pre-approved micro-working capital credit of <strong>₹{wallet.microCreditPreApproved.toLocaleString()}</strong> for purchasing raw silk, natural vegetable dyes, and kiln fuels.
              </p>
            </div>
          </div>

          {wallet.microCreditPreApproved > 0 ? (
            <button
              id="claim-microcredit-btn"
              className="btn btn-forest"
              onClick={() => claimMicroCredit(Math.min(15000, wallet.microCreditPreApproved))}
            >
              <CreditCard size={16} /> Draw ₹15,000 Advance
            </button>
          ) : (
            <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>
              ✓ Credit Line In Active Use
            </span>
          )}
        </div>
      </div>

      {/* Fee Transparency Comparison: UsConnect vs Middlemen */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Percent size={18} color="#c85a17" /> Transparent Realization: How Every ₹100 is Split
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#c85a17' }}>UsConnect Rural Platform</strong>
              <span style={{ fontWeight: 800, color: '#15803d' }}>94% Artisan Realization</span>
            </div>
            <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', display: 'flex', marginBottom: '0.75rem' }}>
              <div style={{ width: '94%', background: '#15803d' }} title="Artisan Share 94%" />
              <div style={{ width: '3%', background: '#c85a17' }} title="Logistics 3%" />
              <div style={{ width: '3%', background: '#4338ca' }} title="Platform 3%" />
            </div>
            <ul style={{ fontSize: '0.8rem', color: '#475569', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>🟢 <strong>₹94.00</strong> direct to Artisan / Self-Help Group</li>
              <li>🟠 <strong>₹3.00</strong> to Village First-Mile Cluster Van</li>
              <li>🔵 <strong>₹3.00</strong> UsConnect platform & payment gateway fee</li>
            </ul>
          </div>

          <div style={{ background: '#fef2f2', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ color: '#b91c1c' }}>Traditional Middleman / Big Tech</strong>
              <span style={{ fontWeight: 800, color: '#b91c1c' }}>Only 30-45% to Artisan</span>
            </div>
            <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', display: 'flex', marginBottom: '0.75rem' }}>
              <div style={{ width: '35%', background: '#ef4444' }} />
              <div style={{ width: '40%', background: '#991b1b' }} />
              <div style={{ width: '25%', background: '#64748b' }} />
            </div>
            <ul style={{ fontSize: '0.8rem', color: '#7f1d1d', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>❌ High trader cuts (35-50% markups)</li>
              <li>❌ 30-45 day payment withholding periods</li>
              <li>❌ Heavy return penalties on rural producers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem' }}>Transaction & Payout Audit Trail</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Updated in real-time</span>
          </div>
          <button
            id="export-ledger-btn"
            className="btn btn-secondary btn-sm"
            onClick={handleExportStatement}
            title="Download CSV Statement"
          >
            <Download size={14} /> Export Statement (CSV)
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Transaction ID</th>
                <th style={{ padding: '0.85rem' }}>Date</th>
                <th style={{ padding: '0.85rem' }}>Description</th>
                <th style={{ padding: '0.85rem' }}>Type</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {wallet.transactions.map((txn) => (
                <tr key={txn.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'monospace', fontWeight: 600 }}>
                    {txn.id}
                  </td>
                  <td style={{ padding: '0.85rem', color: '#64748b' }}>{txn.date}</td>
                  <td style={{ padding: '0.85rem', color: '#1e293b' }}>{txn.description}</td>
                  <td style={{ padding: '0.85rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background:
                          txn.type === 'PAYOUT_CREDIT'
                            ? '#dcfce7'
                            : txn.type === 'ESCROW_HOLD'
                            ? '#fef3c7'
                            : '#e0e7ff',
                        color:
                          txn.type === 'PAYOUT_CREDIT'
                            ? '#15803d'
                            : txn.type === 'ESCROW_HOLD'
                            ? '#b45309'
                            : '#4338ca'
                      }}
                    >
                      {txn.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: 700, color: txn.type === 'BANK_WITHDRAWAL' ? '#dc2626' : '#15803d' }}>
                    {txn.type === 'BANK_WITHDRAWAL' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instant Withdrawal Dialog */}
      {showWithdrawDialog && (
        <div className="modal-overlay" onClick={() => setShowWithdrawDialog(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>Instant Bank / Jan Dhan Withdrawal</h3>
              <button className="modal-close-btn" onClick={() => setShowWithdrawDialog(false)}>✕</button>
            </div>
            <form onSubmit={handleWithdraw} className="modal-body">
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>DESTINATION ACCOUNT:</span>
                <strong>{currentProducer.bankAccount}</strong>
                <div style={{ color: '#15803d', fontSize: '0.75rem', marginTop: '4px' }}>
                  ✓ Instant IMPS (Zero Processing Fee)
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Withdrawal Amount (Available: ₹{wallet.availableBalance.toLocaleString()})
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={withdrawAmount}
                  max={wallet.availableBalance}
                  min="100"
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowWithdrawDialog(false)}>
                  Cancel
                </button>
                <button type="submit" id="confirm-withdrawal-btn" className="btn btn-primary">
                  Confirm Instant IMPS Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
