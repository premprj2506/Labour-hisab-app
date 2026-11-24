import React from 'react';
import { formatCurrency, formatDate, getWorkBadge } from '../utils/calculator';

export function DailyEntryView({
  workers,
  entries,
  activeWorkerId,
  onOpenAddEntry,
  onEditEntry,
  onDeleteEntry
}) {
  // Filter entries for active worker if selected, otherwise show all
  const filteredEntries = entries.filter((e) => {
    if (activeWorkerId && activeWorkerId !== 'ALL') {
      return e.workerId === activeWorkerId;
    }
    return true;
  });

  // Calculate quick totals for displayed entries
  const totalEarned = filteredEntries.reduce((sum, e) => sum + (Number(e.earnedAmount) || 0), 0);
  const totalAdvance = filteredEntries.reduce((sum, e) => sum + (Number(e.advanceAmount) || 0), 0);
  const netTotal = totalEarned - totalAdvance;

  const getWorkerName = (id) => {
    const w = workers.find((item) => item.id === id);
    return w ? w.name : 'મજૂર';
  };

  return (
    <div className="daily-entry-view no-print">
      {/* Quick Summary Banner */}
      <div className="summary-grid">
        <div className="summary-card highlight">
          <div className="summary-label">
            {activeWorkerId === 'ALL' ? 'સર્વ મજૂરોનો બાકી હિસાબ' : 'કુલ ચોખ્ખી બાકી રકમ'}
          </div>
          <div className="summary-val">{formatCurrency(netTotal)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">કુલ મજૂરી</div>
          <div className="summary-val" style={{ color: '#16a34a' }}>
            {formatCurrency(totalEarned)}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">કુલ ઉપાડ (એડવાન્સ)</div>
          <div className="summary-val" style={{ color: '#dc2626' }}>
            {formatCurrency(totalAdvance)}
          </div>
        </div>
      </div>

      {/* Header bar with count and button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}
      >
        <div style={{ fontWeight: '700', fontSize: '16px' }}>
          📝 દૈનિક હિસાબ યાદી ({filteredEntries.length})
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onOpenAddEntry()}
        >
          ➕ નવી એન્ટ્રી
        </button>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
          <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
            હજી સુધી કોઈ એન્ટ્રી નથી
          </div>
          <div style={{ fontSize: '13px', marginBottom: '16px' }}>
            નીચે આપેલા બટનથી આજની હાજરી અથવા મજૂરી એન્ટ્રી ઉમેરો.
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onOpenAddEntry()}
          >
            ➕ પ્રથમ એન્ટ્રી ઉમેરો
          </button>
        </div>
      ) : (
        <div>
          {filteredEntries.map((item) => {
            const badge = getWorkBadge(item);
            const dateParts = (item.date || '').split('-');
            const dayNum = dateParts[2] || '';
            const monthNum = dateParts[1] || '';

            return (
              <div key={item.id} className="entry-item">
                <div className="entry-date-badge">
                  <div className="entry-date-day">{dayNum}</div>
                  <div className="entry-date-month">{monthNum} મો મહિનો</div>
                </div>

                <div className="entry-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span className={`badge ${badge.badgeClass}`}>
                      {badge.label}
                    </span>
                    {activeWorkerId === 'ALL' && (
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>
                        {getWorkerName(item.workerId)}
                      </span>
                    )}
                  </div>

                  <div className="entry-title">
                    {item.workType === 'CUSTOM' ? item.taskDesc : badge.desc}
                  </div>

                  {item.siteName && (
                    <div className="entry-sub">📍 {item.siteName}</div>
                  )}

                  {item.notes && (
                    <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                      નોંધ: {item.notes}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                      onClick={() => onEditEntry(item)}
                    >
                      ✏️ એડિટ
                    </button>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                      onClick={() => {
                        if (window.confirm('શું તમે આ એન્ટ્રી કાઢી નાખવા માંગો છો?')) {
                          onDeleteEntry(item.id);
                        }
                      }}
                    >
                      🗑️ ડિલીટ
                    </button>
                  </div>
                </div>

                <div className="entry-amounts">
                  <div className="entry-earned">
                    +{formatCurrency(item.earnedAmount)}
                  </div>
                  {item.advanceAmount > 0 && (
                    <div className="entry-advance">
                      ઉપાડ: -{formatCurrency(item.advanceAmount)}
                    </div>
                  )}
                  <div className="entry-net">
                    ચોખ્ખા: {formatCurrency(item.earnedAmount - item.advanceAmount)}
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
        <span>➕</span>
        <span>નવી એન્ટ્રી</span>
      </button>
    </div>
  );
}
