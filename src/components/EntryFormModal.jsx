import React, { useState, useEffect } from 'react';
import {
  formatCurrency,
  getLocalTodayStr,
  getLocalYesterdayStr
} from '../utils/calculator';
import {
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  CloseIcon,
  HalfCircleIcon,
  PlusIcon,
  SaveIcon,
  XCircleIcon
} from './Icons';

export function EntryFormModal({
  isOpen,
  onClose,
  onSave,
  workers,
  maliks,
  onQuickAddMalik,
  activeWorkerId,
  initialData = null,
  settings
}) {
  if (!isOpen) return null;

  const todayStr = getLocalTodayStr();
  const yesterdayStr = getLocalYesterdayStr();

  const [workerId, setWorkerId] = useState(
    initialData?.workerId || (activeWorkerId !== 'ALL' ? activeWorkerId : workers[0]?.id || '')
  );
  const validDefaultMalik = maliks.some((m) => m.id === settings?.defaultMalikId)
    ? settings.defaultMalikId
    : maliks[0]?.id || '';

  const [malikId, setMalikId] = useState(
    initialData?.malikId || validDefaultMalik
  );

  // Quick inline new Malik creation inside modal
  const [showNewMalikBox, setShowNewMalikBox] = useState(false);
  const [newMalikName, setNewMalikName] = useState('');
  const [newMalikPhone, setNewMalikPhone] = useState('');

  const [date, setDate] = useState(initialData?.date || todayStr);
  const [workType, setWorkType] = useState(initialData?.workType || 'DAILY');
  const [status, setStatus] = useState(initialData?.status || 'FULL');

  // Custom work fields
  const [taskDesc, setTaskDesc] = useState(initialData?.taskDesc || '');
  const [customAmount, setCustomAmount] = useState(
    initialData?.workType === 'CUSTOM' ? initialData?.earnedAmount : ''
  );
  const [useUnitCalc, setUseUnitCalc] = useState(false);
  const [units, setUnits] = useState('');
  const [unitRate, setUnitRate] = useState('');

  // Daily rate snapshot
  const selectedWorker = workers.find((w) => w.id === workerId);
  const defaultDailyRate = selectedWorker?.dailyRate || 500;
  const [dailyRate, setDailyRate] = useState(initialData?.rate || defaultDailyRate);

  // Advance & Optional meta
  const [advanceAmount, setAdvanceAmount] = useState(initialData?.advanceAmount || '');
  const [siteName, setSiteName] = useState(initialData?.siteName || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  useEffect(() => {
    if (selectedWorker && !initialData) {
      setDailyRate(selectedWorker.dailyRate);
    }
  }, [workerId, selectedWorker, initialData]);

  useEffect(() => {
    if (useUnitCalc && units && unitRate) {
      const total = Number(units) * Number(unitRate);
      if (!isNaN(total)) {
        setCustomAmount(total);
      }
    }
  }, [units, unitRate, useUnitCalc]);

  const handleCreateQuickMalik = () => {
    if (!newMalikName.trim()) {
      alert('કૃપા કરીને માલિકનું નામ લખો');
      return;
    }
    const created = onQuickAddMalik({
      name: newMalikName,
      phone: newMalikPhone,
      businessName: ''
    });
    if (created?.id) {
      setMalikId(created.id);
    }
    setNewMalikName('');
    setNewMalikPhone('');
    setShowNewMalikBox(false);
  };

  let calculatedEarned = 0;
  if (workType === 'DAILY') {
    if (status === 'FULL') calculatedEarned = Number(dailyRate) || 0;
    else if (status === 'HALF') calculatedEarned = (Number(dailyRate) || 0) * 0.5;
    else calculatedEarned = 0;
  } else {
    calculatedEarned = Number(customAmount) || 0;
  }

  const advanceVal = Number(advanceAmount) || 0;
  const netCalculated = calculatedEarned - advanceVal;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workerId) {
      alert('કૃપા કરીને મજૂર પસંદ કરો');
      return;
    }

    if (workType === 'CUSTOM' && (!customAmount || Number(customAmount) <= 0)) {
      alert('કૃપા કરીને મજૂરીની રકમ દાખલ કરો');
      return;
    }

    onSave({
      id: initialData?.id,
      workerId,
      malikId,
      date,
      workType,
      status: workType === 'DAILY' ? status : 'FULL',
      rate: Number(dailyRate) || 0,
      earnedAmount: calculatedEarned,
      advanceAmount: advanceVal,
      taskDesc:
        workType === 'CUSTOM'
          ? taskDesc
          : status === 'HALF'
          ? 'અડધો દિવસ'
          : status === 'ABSENT'
          ? 'ગેરહાજર'
          : 'આખો દિવસ રોજી',
      siteName,
      notes
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-header">
          <div className="modal-title">
            <PlusIcon size={18} />
            <span>{initialData ? 'હિસાબ એડિટ કરો' : 'નવી મજૂરી એન્ટ્રી'}</span>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="બંધ કરો">
            <CloseIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Worker & Malik Selection */}
          <div className="form-group">
            <label className="form-label">મજૂરનું નામ</label>
            <select
              className="form-control"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              required
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role} - ₹{w.dailyRate})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>માલિક / કોના ત્યાં કામ કર્યું</label>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#145339',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
                onClick={() => setShowNewMalikBox(!showNewMalikBox)}
              >
                <PlusIcon size={13} />
                <span>{showNewMalikBox ? 'બંધ કરો' : 'નવો માલિક ઉમેરો'}</span>
              </button>
            </div>

            {showNewMalikBox ? (
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '10px',
                  marginBottom: '8px'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#145339', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <BuildingIcon size={14} />
                  <span>નવા માલિકની વિગત</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="માલિકનું નામ"
                    value={newMalikName}
                    onChange={(e) => setNewMalikName(e.target.value)}
                  />
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="વોટ્સએપ નંબર"
                    value={newMalikPhone}
                    onChange={(e) => setNewMalikPhone(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm btn-block"
                  onClick={handleCreateQuickMalik}
                >
                  માલિક ઉમેરો અને પસંદ કરો
                </button>
              </div>
            ) : (
              <select
                className="form-control"
                value={malikId}
                onChange={(e) => setMalikId(e.target.value)}
              >
                <option value="">-- માલિક પસંદ કરો --</option>
                {maliks.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}{m.businessName ? ` (${m.businessName})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date Picker + Quick Buttons */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>તારીખ</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`quick-chip ${date === todayStr ? 'active' : ''}`}
                  onClick={() => setDate(todayStr)}
                >
                  આજે
                </button>
                <button
                  type="button"
                  className={`quick-chip ${date === yesterdayStr ? 'active' : ''}`}
                  onClick={() => setDate(yesterdayStr)}
                >
                  ગઈકાલે
                </button>
              </div>
            </div>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Work Type: DAILY vs CUSTOM */}
          <div className="form-group">
            <label className="form-label">મજૂરીનો પ્રકાર</label>
            <div className="segment-switcher">
              <button
                type="button"
                className={`segment-btn ${workType === 'DAILY' ? 'active' : ''}`}
                onClick={() => setWorkType('DAILY')}
              >
                <CalendarIcon size={15} />
                <span>ફિક્સ રોજી</span>
              </button>
              <button
                type="button"
                className={`segment-btn ${workType === 'CUSTOM' ? 'active' : ''}`}
                onClick={() => setWorkType('CUSTOM')}
              >
                <BriefcaseIcon size={15} />
                <span>કામ મુજબ</span>
              </button>
            </div>
          </div>

          {/* Option A: DAILY WAGE */}
          {workType === 'DAILY' && (
            <div className="card" style={{ background: '#f8faf9', padding: '12px' }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">હાજરી પસંદ કરો</label>
                <div className="status-card-grid">
                  <button
                    type="button"
                    className={`status-option-btn ${status === 'FULL' ? 'active-full' : ''}`}
                    onClick={() => setStatus('FULL')}
                  >
                    <CheckCircleIcon size={20} />
                    <span>પૂરો દિવસ</span>
                  </button>
                  <button
                    type="button"
                    className={`status-option-btn ${status === 'HALF' ? 'active-half' : ''}`}
                    onClick={() => setStatus('HALF')}
                  >
                    <HalfCircleIcon size={20} />
                    <span>અડધો દિવસ</span>
                  </button>
                  <button
                    type="button"
                    className={`status-option-btn ${status === 'ABSENT' ? 'active-absent' : ''}`}
                    onClick={() => setStatus('ABSENT')}
                  >
                    <XCircleIcon size={20} />
                    <span>રજા</span>
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">રોજી દર (દિવસ દીઠ)</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    placeholder="500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Option B: CUSTOM / VARIABLE WORK PAYMENT */}
          {workType === 'CUSTOM' && (
            <div className="card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', padding: '12px' }}>
              <div className="form-group">
                <label className="form-label">કરેલ કામની વિગત</label>
                <input
                  type="text"
                  className="form-control"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="દા.ત. સોફા ફ્રેમ ફિટિંગ, પ્લાસ્ટર કામ"
                  required={workType === 'CUSTOM'}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>કુલ મજૂરી રકમ</label>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#145339',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                    onClick={() => setUseUnitCalc(!useUnitCalc)}
                  >
                    {useUnitCalc ? 'સીધી રકમ લખો' : 'નંગ × ભાવ ગણો'}
                  </button>
                </div>

                {useUnitCalc && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="નંગ/કલાક (દા.ત. 5)"
                      value={units}
                      onChange={(e) => setUnits(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="ભાવ ₹ (દા.ત. 150)"
                      value={unitRate}
                      onChange={(e) => setUnitRate(e.target.value)}
                    />
                  </div>
                )}

                <div className="input-with-prefix">
                  <span className="input-prefix" style={{ color: '#15803d' }}>₹</span>
                  <input
                    type="number"
                    className="form-control"
                    style={{ fontSize: '18px', fontWeight: '700', color: '#15803d' }}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="750"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Advance & Site side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label">ઉપાડ લીધો હોય તો</label>
              <div className="input-with-prefix">
                <span className="input-prefix" style={{ color: '#dc2626' }}>₹</span>
                <input
                  type="number"
                  className="form-control"
                  style={{ color: advanceVal > 0 ? '#dc2626' : '#0f172a', fontWeight: '600' }}
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">જગ્યા / સાઈટ</label>
              <input
                type="text"
                className="form-control"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="સાઈટ / પ્લોટ"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">વધારાની નોંધ (ઓપ્શનલ)</label>
            <input
              type="text"
              className="form-control"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="કોઈ ખાસ વિગત હોય તો..."
            />
          </div>

          {/* Quick Net Preview Banner */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              border: '1px solid #e2e8f0'
            }}
          >
            <div>
              <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600' }}>
                આજના હિસાબની ચોખ્ખી રકમ
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                {formatCurrency(netCalculated)}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: '600' }}>
              <div style={{ color: '#15803d' }}>મજૂરી: +{formatCurrency(calculatedEarned)}</div>
              <div style={{ color: '#dc2626' }}>ઉપાડ: -{formatCurrency(advanceVal)}</div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            <SaveIcon size={18} />
            <span>હિસાબ સેવ કરો</span>
          </button>
        </form>
      </div>
    </div>
  );
}
