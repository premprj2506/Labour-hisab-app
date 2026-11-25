import React, { useState } from 'react';
import {
  formatCurrency,
  getGujaratiMonthShort,
  getGujaratiWeekdayShort,
  getWorkBadge
} from '../utils/calculator';
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ClipboardIcon,
  EditIcon,
  HalfCircleIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  WalletIcon,
  XCircleIcon
} from './Icons';

export function DailyEntryView({
  workers,
  entries,
  activeWorkerId,
  onOpenAddEntry,
  onEditEntry,
  onDeleteEntry
}) {
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL', 'DAILY', 'CUSTOM', 'ADVANCE'

  // Filter entries for active worker
  const workerEntries = entries.filter((e) => {
    if (activeWorkerId && activeWorkerId !== 'ALL') {
      return e.workerId === activeWorkerId;
    }
    return true;
  });

  // Totals across all entries for active worker
  const totalEarned = workerEntries.reduce((sum, e) => sum + (Number(e.earnedAmount) || 0), 0);
  const totalAdvance = workerEntries.reduce((sum, e) => sum + (Number(e.advanceAmount) || 0), 0);
  const netTotal = totalEarned - totalAdvance;

  // Apply quick filter chip
  const filteredEntries = workerEntries.filter((e) => {
    if (filterMode === 'DAILY') return e.workType !== 'CUSTOM';
    if (filterMode === 'CUSTOM') return e.workType === 'CUSTOM';
    if (filterMode === 'ADVANCE') return Number(e.advanceAmount) > 0;
    return true;
  });

  const getWorkerName = (id) => {
    const w = workers.find((item) => item.id === id);
    return w ? w.name : 'મજૂર';
  };

  const renderBadgeIcon = (type) => {
    if (type === 'CUSTOM') return <BriefcaseIcon size={12} />;
    if (type === 'HALF') return <HalfCircleIcon size={12} />;
    if (type === 'ABSENT') return <XCircleIcon size={12} />;
    return <CheckCircleIcon size={12} />;
  };

  return (
    <div className="daily-entry-view no-print">
      {/* Hero Summary Card */}
      <div className="hero-summary-card">
        <div className="hero-top-row">
          <div>
            <div className="hero-label">
              <WalletIcon size={14} />
              <span>
                {activeWorkerId === 'ALL' ? 'સર્વ મજૂરોનો બાકી હિસાબ' : 'ચોખ્ખી બાકી રકમ'}
              </span>
            </div>
            <div className="hero-amount">{formatCurrency(netTotal)}</div>
          </div>
          <div className="hero-count-pill">{workerEntries.length} એન્ટ્રી</div>
        </div>

        <div className="hero-stats-row">
          <div className="hero-stat-box">
            <div className="hero-stat-label">કુલ મજૂરી (+)</div>
            <div className="hero-stat-val" style={{ color: '#a7f3d0' }}>
              {formatCurrency(totalEarned)}
            </div>
          </div>
          <div className="hero-stat-box">
            <div className="hero-stat-label">કુલ ઉપાડ (-)</div>
            <div className="hero-stat-val" style={{ color: '#fecaca' }}>
              {formatCurrency(totalAdvance)}
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="section-header">
        <div className="section-title">
          <ClipboardIcon size={18} />
          <span>દૈનિક હિસાબ યાદી</span>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onOpenAddEntry()}
        >
          <PlusIcon size={15} />
          <span>નવી એન્ટ્રી</span>
        </button>
      </div>

      {/* Quick Filter Chips */}
      {workerEntries.length > 0 && (
        <div className="quick-date-row">
          <button
            type="button"
            className={`quick-chip ${filterMode === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterMode('ALL')}
          >
            બધી ({workerEntries.length})
          </button>
          <button
            type="button"
            className={`quick-chip ${filterMode === 'DAILY' ? 'active' : ''}`}
            onClick={() => setFilterMode('DAILY')}
          >
            ફિક્સ રોજી
          </button>
          <button
            type="button"
            className={`quick-chip ${filterMode === 'CUSTOM' ? 'active' : ''}`}
            onClick={() => setFilterMode('CUSTOM')}
          >
            કામ મુજબ
          </button>
          <button
            type="button"
            className={`quick-chip ${filterMode === 'ADVANCE' ? 'active' : ''}`}
            onClick={() => setFilterMode('ADVANCE')}
          >
            ઉપાડ વાળી
          </button>
        </div>
      )}

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              margin: '0 auto 12px auto',
              borderRadius: '50%',
              background: '#e6f4ed',
              color: '#145339',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ClipboardIcon size={24} />
          </div>
          <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a', marginBottom: '4px' }}>
            {workerEntries.length === 0 ? 'હજી સુધી કોઈ એન્ટ્રી નથી' : 'આ ફિલ્ટરમાં કોઈ એન્ટ્રી નથી'}
          </div>
          <div style={{ fontSize: '13px', marginBottom: '16px' }}>
            {workerEntries.length === 0
              ? 'આજની હાજરી અથવા કામ મુજબ મજૂરીની એન્ટ્રી ઉમેરો.'
              : 'બધી એન્ટ્રીઓ જોવા માટે "બધી" પસંદ કરો.'}
          </div>
          {workerEntries.length === 0 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onOpenAddEntry()}
            >
              <PlusIcon size={16} />
              <span>પ્રથમ એન્ટ્રી ઉમેરો</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setFilterMode('ALL')}
            >
              બધી એન્ટ્રી બતાવો
            </button>
          )}
        </div>
      ) : (
        <div>
          {filteredEntries.map((item) => {
            const badge = getWorkBadge(item);
            const dateParts = (item.date || '').split('-');
            const dayNum = dateParts[2] || '';
            const monthShort = getGujaratiMonthShort(dateParts[1] || '');
            const weekdayShort = getGujaratiWeekdayShort(item.date);

            return (
              <div key={item.id} className="entry-item">
                <div className="entry-date-badge">
                  <div className="entry-date-day">{dayNum}</div>
                  <div className="entry-date-month">{monthShort}</div>
                  {weekdayShort && <div className="entry-date-week">{weekdayShort}</div>}
                </div>

                <div className="entry-body">
                  <div className="entry-top-meta">
                    <span className={`badge ${badge.badgeClass}`}>
                      {renderBadgeIcon(badge.type)}
                      <span>{badge.label}</span>
                    </span>
                    {activeWorkerId === 'ALL' && (
                      <span className="entry-worker-tag">
                        {getWorkerName(item.workerId)}
                      </span>
                    )}
                  </div>

                  <div className="entry-title">
                    {item.workType === 'CUSTOM' ? item.taskDesc : badge.desc}
                  </div>

                  {item.siteName && (
                    <div className="entry-sub">
                      <MapPinIcon size={12} />
                      <span>{item.siteName}</span>
                    </div>
                  )}

                  {item.notes && (
                    <div className="entry-note">નોંધ: {item.notes}</div>
                  )}
                </div>

                <div className="entry-right-col">
                  <div className="entry-amounts">
                    <div className="entry-earned">
                      +{formatCurrency(item.earnedAmount)}
                    </div>
                    {item.advanceAmount > 0 && (
                      <div className="entry-advance">
                        ઉપાડ -{formatCurrency(item.advanceAmount)}
                      </div>
                    )}
                    <div className="entry-net">
                      {formatCurrency(item.earnedAmount - item.advanceAmount)}
                    </div>
                  </div>

                  <div className="entry-icon-actions">
                    <button
                      type="button"
                      className="icon-action-btn edit"
                      title="એડિટ કરો"
                      aria-label="એડિટ કરો"
                      onClick={() => onEditEntry(item)}
                    >
                      <EditIcon size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-action-btn delete"
                      title="ડિલીટ કરો"
                      aria-label="ડિલીટ કરો"
                      onClick={() => {
                        if (window.confirm('શું તમે આ એન્ટ્રી કાઢી નાખવા માંગો છો?')) {
                          onDeleteEntry(item.id);
                        }
                      }}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        className="fab-btn"
        onClick={() => onOpenAddEntry()}
      >
        <PlusIcon size={18} />
        <span>નવી એન્ટ્રી</span>
      </button>
    </div>
  );
}
