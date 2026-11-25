import React from 'react';
import { formatCurrency } from '../utils/calculator';
import { ClipboardIcon, PlusIcon, SwitchIcon } from './Icons';

export function Header({ activeWorker, onSwitchWorker, onOpenAddEntry }) {
  return (
    <header className="app-header no-print">
      <div className="header-top">
        <div className="header-brand">
          <div className="brand-icon">
            <ClipboardIcon size={20} />
          </div>
          <div>
            <div className="brand-title">મજૂરી ખાતાવહી</div>
            <div className="brand-sub">દૈનિક મજૂરી અને હાજરી હિસાબ</div>
          </div>
        </div>

        <button
          type="button"
          className="header-add-btn"
          onClick={onOpenAddEntry}
          aria-label="નવી એન્ટ્રી ઉમેરો"
        >
          <PlusIcon size={15} />
          <span>ઉમેરો</span>
        </button>
      </div>

      {/* Clickable Active Worker Switcher Bar */}
      <button
        type="button"
        className="worker-header-bar"
        onClick={onSwitchWorker}
      >
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
                : 'સામૂહિક હિસાબ ચાલુ છે'}
            </div>
          </div>
        </div>
        <span className="switch-pill">
          <span>બદલો</span>
          <SwitchIcon size={14} />
        </span>
      </button>
    </header>
  );
}
