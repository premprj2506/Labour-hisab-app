import React, { useState } from 'react';
import {
  calculateStatement,
  formatCurrency,
  getDateRangePreset
} from '../utils/calculator';
import { buildWhatsAppMessage, openWhatsAppChat, shareViaMobile } from '../utils/whatsapp';
import { PrintStatement } from './PrintStatement';

export function DateReportView({
  workers,
  entries,
  activeWorkerId,
  settings,
  onUpdateSettings
}) {
  // Date states: defaults to current month
  const defaultRange = getDateRangePreset('THIS_MONTH');
  const [startDate, setStartDate] = useState(defaultRange.start);
  const [endDate, setEndDate] = useState(defaultRange.end);
  const [selectedWorkerId, setSelectedWorkerId] = useState(activeWorkerId || 'ALL');
  const [activePreset, setActivePreset] = useState('THIS_MONTH');

  // Owner phone for WhatsApp
  const [ownerPhone, setOwnerPhone] = useState(settings?.ownerPhone || '');
  const [shareSuccess, setShareSuccess] = useState('');

  // Handle Preset Clicks
  const handlePreset = (preset) => {
    const range = getDateRangePreset(preset);
    setStartDate(range.start);
    setEndDate(range.end);
    setActivePreset(preset);
  };

  // Find worker details
  const selectedWorker = workers.find((w) => w.id === selectedWorkerId);

  // Calculate live statement
  const summary = calculateStatement(
    entries,
    selectedWorkerId,
    startDate,
    endDate
  );

  // Send via WhatsApp
  const handleSendWhatsApp = () => {
    // Save phone if modified
    if (ownerPhone !== settings?.ownerPhone) {
      onUpdateSettings({ ...settings, ownerPhone });
    }

    const message = buildWhatsAppMessage({
      worker: selectedWorker,
      settings: { ...settings, ownerPhone },
      startDate,
      endDate,
      summary
    });

    openWhatsAppChat(ownerPhone, message);
    setShareSuccess('વોટ્સએપ ખોલવામાં આવ્યું છે!');
    setTimeout(() => setShareSuccess(''), 4000);
  };

  // Native Mobile Share
  const handleMobileShare = async () => {
    const message = buildWhatsAppMessage({
      worker: selectedWorker,
      settings,
      startDate,
      endDate,
      summary
    });

    const shared = await shareViaMobile('મજૂરી હિસાબ પત્રક', message);
    if (shared) {
      setShareSuccess('સફળતાપૂર્વક શેર થયું!');
      setTimeout(() => setShareSuccess(''), 4000);
    }
  };

  // Direct Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="date-report-view">
      {/* Filter Card (No Print) */}
      <div className="card no-print">
        <div className="card-title">
          <span>📅 તારીખ પસંદગી અને હિસાબ</span>
        </div>

        {/* Worker Selector */}
        <div className="form-group">
          <label className="form-label">મજૂર પસંદ કરો:</label>
          <select
            className="form-control"
            value={selectedWorkerId}
            onChange={(e) => setSelectedWorkerId(e.target.value)}
          >
            <option value="ALL">👥 બધા મજૂરો (All Workers)</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.role} - ₹{w.dailyRate})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Date Presets */}
        <div className="form-group">
          <label className="form-label">ઝડપી તારીખ પસંદ કરો:</label>
          <div className="quick-date-row">
            <button
              type="button"
              className={`quick-chip ${activePreset === 'THIS_MONTH' ? 'active' : ''}`}
              onClick={() => handlePreset('THIS_MONTH')}
            >
              આ મહિનો
            </button>
            <button
              type="button"
              className={`quick-chip ${activePreset === 'LAST_15_DAYS' ? 'active' : ''}`}
              onClick={() => handlePreset('LAST_15_DAYS')}
            >
              છેલ્લા ૧૫ દિવસ
            </button>
            <button
              type="button"
              className={`quick-chip ${activePreset === 'LAST_7_DAYS' ? 'active' : ''}`}
              onClick={() => handlePreset('LAST_7_DAYS')}
            >
              છેલ્લા ૭ દિવસ
            </button>
            <button
              type="button"
              className={`quick-chip ${activePreset === 'LAST_MONTH' ? 'active' : ''}`}
              onClick={() => handlePreset('LAST_MONTH')}
            >
              ગયેલ મહિનો
            </button>
          </div>
        </div>

        {/* Two Date Pickers (From Date & To Date) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <div>
            <label className="form-label">શરૂઆત તારીખ:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setActivePreset('CUSTOM');
              }}
            />
          </div>
          <div>
            <label className="form-label">અંતિમ તારીખ:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setActivePreset('CUSTOM');
              }}
            />
          </div>
        </div>

        {/* Owner Phone Input for Direct WhatsApp */}
        <div className="form-group" style={{ marginBottom: '10px' }}>
          <label className="form-label">માલિકનો વોટ્સએપ નંબર:</label>
          <input
            type="tel"
            className="form-control"
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
            placeholder="દા.ત. 9876543210 (નંબર સેવ રહેશે)"
          />
        </div>

        {/* Action Buttons: WhatsApp & Print PDF */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
          <button
            type="button"
            className="btn btn-whatsapp btn-lg"
            onClick={handleSendWhatsApp}
            style={{ width: '100%' }}
          >
            <span>💬 વોટ્સએપ કરો</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handlePrint}
            style={{ width: '100%' }}
          >
            <span>🖨️ PDF પ્રિન્ટ</span>
          </button>
        </div>

        {navigator.share && (
          <button
            type="button"
            className="btn btn-outline btn-block"
            style={{ marginTop: '8px' }}
            onClick={handleMobileShare}
          >
            📤 મોબાઇલમાં અન્ય એપમાં શેર કરો
          </button>
        )}

        {shareSuccess && (
          <div style={{ marginTop: '10px', color: '#15803d', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>
            ✓ {shareSuccess}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="summary-grid no-print">
        <div className="summary-card highlight">
          <div className="summary-label">ચોખ્ખી ચૂકવવાપાત્ર રકમ (બાકી)</div>
          <div className="summary-val">{formatCurrency(summary.netPayable)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">કુલ મજૂરી કમાણી</div>
          <div className="summary-val" style={{ color: '#16a34a' }}>
            {formatCurrency(summary.totalEarned)}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">કુલ ઉપાડ (એડવાન્સ)</div>
          <div className="summary-val" style={{ color: '#dc2626' }}>
            {formatCurrency(summary.totalAdvance)}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">કુલ દિવસો / એન્ટ્રી</div>
          <div className="summary-val">{summary.count} એન્ટ્રી</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">કામની વહેંચણી</div>
          <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>
            પૂરા: {summary.fullDays} | અડધા: {summary.halfDays} | ઉચક: {summary.customTasksCount}
          </div>
        </div>
      </div>

      {/* Printable Statement (Rendered live and styled for print) */}
      <PrintStatement
        worker={selectedWorker}
        settings={settings}
        startDate={startDate}
        endDate={endDate}
        summary={summary}
      />
    </div>
  );
}
