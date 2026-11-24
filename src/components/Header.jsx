import React from 'react';
import { formatCurrency } from '../utils/calculator';

export function Header({ activeWorker, onSwitchWorker, onOpenAddEntry }) {
  return (
    <header className="app-header no-print">
      <div className="header-top">
        <div className="header-brand">
          <div className="brand-icon">📋</div>
          <div>
            <div className="brand-title">મજૂરી ખાતાવહી</div>
            <div className="brand-sub">Daily Labour & Wage Calculator</div>
          </div>
        </div>
        <div className="header-badge">૧૦૦% ફ્રી</div>
      </div>

      {/* Active Worker Quick Pill */}
      <div className="worker-header-bar">
        <div className="worker-chip">
          <div className="worker-avatar">
            {activeWorker ? activeWorker.name.charAt(0) : 'બ'}
          </div>
          <div className="worker-info-text">
            <div className="name">
              {activeWorker ? activeWorker.name : 'બધા મજૂરો (All)'}
            </div>
            <div className="rate">
              {activeWorker
                ? `રોજી: ${formatCurrency(activeWorker.dailyRate)} / દિવસ`
                : 'સામૂહિક હિસાબ'}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="switch-btn"
          onClick={onSwitchWorker}
        >
          મજૂર બદલો ⇄
        </button>
      </div>
    </header>
  );
}
