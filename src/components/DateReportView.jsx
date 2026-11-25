import React, { useState, useEffect } from 'react';
import {
  calculateStatement,
  formatCurrency,
  getDateRangePreset
} from '../utils/calculator';
import { buildWhatsAppMessage, openWhatsAppChat, shareViaMobile } from '../utils/whatsapp';
import { PrintStatement } from './PrintStatement';
import {
  CalendarIcon,
  FileBarChartIcon,
  PhoneIcon,
  PrinterIcon,
  ShareIcon,
  WalletIcon,
  WhatsAppIcon
} from './Icons';

export function DateReportView({
  workers,
  maliks,
  entries,
  activeWorkerId,
  initialMalikId,
  settings
}) {
  const defaultRange = getDateRangePreset('THIS_MONTH');
  const [startDate, setStartDate] = useState(defaultRange.start);
  const [endDate, setEndDate] = useState(defaultRange.end);
  const [selectedWorkerId, setSelectedWorkerId] = useState(activeWorkerId || 'ALL');
  const [selectedMalikId, setSelectedMalikId] = useState(
    initialMalikId || (maliks.length === 1 ? maliks[0].id : 'ALL')
  );
  const [activePreset, setActivePreset] = useState('THIS_MONTH');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');

  useEffect(() => {
    setSelectedWorkerId(activeWorkerId || 'ALL');
  }, [activeWorkerId]);

  useEffect(() => {
    if (initialMalikId) {
      setSelectedMalikId(initialMalikId);
    }
  }, [initialMalikId]);

  // Auto-fill WhatsApp phone when selectedMalikId changes
  const selectedMalik = maliks.find((m) => m.id === selectedMalikId) || null;
  useEffect(() => {
    if (selectedMalik) {
      setOwnerPhone(selectedMalik.phone || '');
    } else {
      setOwnerPhone('');
    }
  }, [selectedMalikId, selectedMalik]);

  const handlePreset = (preset) => {
    const range = getDateRangePreset(preset);
    setStartDate(range.start);
    setEndDate(range.end);
    setActivePreset(preset);
  };

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId);

  const summary = calculateStatement(
    entries,
    selectedWorkerId,
    startDate,
    endDate,
    selectedMalikId
  );

  const handleSendWhatsApp = () => {
    const message = buildWhatsAppMessage({
      worker: selectedWorker,
      malik: selectedMalik,
      startDate,
      endDate,
      summary
    });

    openWhatsAppChat(ownerPhone, message);
    setShareSuccess('વોટ્સએપ ખોલવામાં આવ્યું છે!');
    setTimeout(() => setShareSuccess(''), 4000);
  };

  const handleMobileShare = async () => {
    const message = buildWhatsAppMessage({
      worker: selectedWorker,
      malik: selectedMalik,
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="date-report-view">
      {/* Step 1: Worker, Malik & Date Filter Card */}
      <div className="card no-print">
        <div className="section-header" style={{ marginBottom: '10px' }}>
          <div className="section-title">
            <CalendarIcon size={18} />
            <span>તારીખ પસંદગી અને હિસાબ</span>
          </div>
        </div>

        {/* Worker & Malik Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="form-group">
            <label className="form-label">મજૂર</label>
            <select
              className="form-control"
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
            >
              <option value="ALL">બધા મજૂરો</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">માલિક (શેઠ)</label>
            <select
              className="form-control"
              value={selectedMalikId}
              onChange={(e) => setSelectedMalikId(e.target.value)}
            >
              <option value="ALL">બધા માલિકો</option>
              {maliks.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Date Presets */}
        <div className="form-group" style={{ marginBottom: '10px' }}>
          <label className="form-label">ઝડપી સમયગાળો</label>
          <div className="quick-date-row" style={{ marginBottom: 0 }}>
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
              ગયો મહિનો
            </button>
          </div>
        </div>

        {/* Two Date Pickers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label className="form-label">શરૂઆત તારીખ</label>
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
            <label className="form-label">અંતિમ તારીખ</label>
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
      </div>

      {/* Step 2: Summary Highlight */}
      <div className="hero-summary-card no-print">
        <div className="hero-top-row">
          <div>
            <div className="hero-label">
              <WalletIcon size={14} />
              <span>
                {selectedMalik
                  ? `${selectedMalik.name} — બાકી રકમ`
                  : 'ચૂકવવાપાત્ર ચોખ્ખી બાકી રકમ'}
              </span>
            </div>
            <div className="hero-amount">{formatCurrency(summary.netPayable)}</div>
          </div>
          <div className="hero-count-pill">
            {summary.count} એન્ટ્રી
          </div>
        </div>

        <div className="hero-stats-row">
          <div className="hero-stat-box">
            <div className="hero-stat-label">કુલ મજૂરી કમાણી</div>
            <div className="hero-stat-val" style={{ color: '#a7f3d0' }}>
              {formatCurrency(summary.totalEarned)}
            </div>
          </div>
          <div className="hero-stat-box">
            <div className="hero-stat-label">કુલ ઉપાડ (એડવાન્સ)</div>
            <div className="hero-stat-val" style={{ color: '#fecaca' }}>
              {formatCurrency(summary.totalAdvance)}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11.5px', color: '#cdeadd', marginTop: '10px', textAlign: 'center' }}>
          પૂરા દિવસ: {summary.fullDays} • અડધા દિવસ: {summary.halfDays} • કામ મુજબ: {summary.customTasksCount}
        </div>
      </div>

      {/* Share & Print Actions Card */}
      <div className="card no-print">
        <div className="form-group">
          <label className="form-label">
            {selectedMalik ? `${selectedMalik.name} નો વોટ્સએપ નંબર` : 'માલિકનો વોટ્સએપ નંબર'}
          </label>
          <div className="input-with-prefix">
            <span className="input-prefix" style={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon size={14} />
            </span>
            <input
              type="tel"
              className="form-control"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              placeholder="દા.ત. 9876543210 (નંબર વગર WhatsApp લિસ્ટ ખુલશે)"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-whatsapp btn-lg"
            onClick={handleSendWhatsApp}
            style={{ width: '100%' }}
          >
            <WhatsAppIcon size={19} />
            <span>વોટ્સએપ કરો</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handlePrint}
            style={{ width: '100%' }}
          >
            <PrinterIcon size={18} />
            <span>PDF પ્રિન્ટ</span>
          </button>
        </div>

        {navigator.share && (
          <button
            type="button"
            className="btn btn-outline btn-block"
            style={{ marginTop: '10px' }}
            onClick={handleMobileShare}
          >
            <ShareIcon size={16} />
            <span>મોબાઇલમાં અન્ય એપમાં શેર કરો</span>
          </button>
        )}

        {shareSuccess && (
          <div style={{ marginTop: '10px', color: '#15803d', fontWeight: '700', fontSize: '13px', textAlign: 'center' }}>
            ✓ {shareSuccess}
          </div>
        )}
      </div>

      {/* Step 3: Statement Preview Header */}
      <div className="preview-card-header no-print">
        <div className="section-title" style={{ fontSize: '14.5px' }}>
          <FileBarChartIcon size={17} />
          <span>હિસાબ સ્લિપ પ્રિવ્યૂ (PDF માટે)</span>
        </div>
      </div>

      {/* Printable Statement */}
      <PrintStatement
        worker={selectedWorker}
        malik={selectedMalik}
        maliks={maliks}
        settings={settings}
        startDate={startDate}
        endDate={endDate}
        summary={summary}
      />
    </div>
  );
}
