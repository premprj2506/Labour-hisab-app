import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/calculator';

export function EntryFormModal({
  isOpen,
  onClose,
  onSave,
  workers,
  activeWorkerId,
  initialData = null,
  settings
}) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  })();

  const [workerId, setWorkerId] = useState(
    initialData?.workerId || (activeWorkerId !== 'ALL' ? activeWorkerId : workers[0]?.id || '')
  );
  const [date, setDate] = useState(initialData?.date || todayStr);
  const [workType, setWorkType] = useState(initialData?.workType || 'DAILY'); // 'DAILY' or 'CUSTOM'
  const [status, setStatus] = useState(initialData?.status || 'FULL');         // 'FULL', 'HALF', 'ABSENT'
  
  // Custom work fields (User can enter their own payment)
  const [taskDesc, setTaskDesc] = useState(initialData?.taskDesc || '');
  const [customAmount, setCustomAmount] = useState(
    initialData?.workType === 'CUSTOM' ? initialData?.earnedAmount : ''
  );
  const [useUnitCalc, setUseUnitCalc] = useState(false);
  const [units, setUnits] = useState('');
  const [unitRate, setUnitRate] = useState('');

  // Daily rate snapshot
  const selectedWorker = workers.find(w => w.id === workerId);
  const defaultDailyRate = selectedWorker?.dailyRate || 500;
  const [dailyRate, setDailyRate] = useState(initialData?.rate || defaultDailyRate);

  // Advance (ઉપાડ)
  const [advanceAmount, setAdvanceAmount] = useState(initialData?.advanceAmount || 0);
  const [siteName, setSiteName] = useState(
    initialData?.siteName || settings?.businessName || ''
  );
  const [notes, setNotes] = useState(initialData?.notes || '');

  // When worker changes, update daily rate
  useEffect(() => {
    if (selectedWorker && !initialData) {
      setDailyRate(selectedWorker.dailyRate);
    }
  }, [workerId, selectedWorker, initialData]);

  // Handle Unit Calc for custom work
  useEffect(() => {
    if (useUnitCalc && units && unitRate) {
      const total = Number(units) * Number(unitRate);
      if (!isNaN(total)) {
        setCustomAmount(total);
      }
    }
  }, [units, unitRate, useUnitCalc]);

  // Calculate earned amount based on selection
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
      date,
      workType,
      status: workType === 'DAILY' ? status : 'FULL',
      rate: Number(dailyRate) || 0,
      earnedAmount: calculatedEarned,
      advanceAmount: advanceVal,
      taskDesc: workType === 'CUSTOM' ? taskDesc : (status === 'HALF' ? 'અડધો દિવસ' : status === 'ABSENT' ? 'ગેરહાજર' : 'આખો દિવસ રોજી'),
      siteName,
      notes
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {initialData ? '✏️ હિસાબ એડિટ કરો' : '➕ નવી મજૂરી એન્ટ્રી'}
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Worker Selector */}
          <div className="form-group">
            <label className="form-label">મજૂરનું નામ:</label>
            <select
              className="form-control"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              required
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role} - રોજી: ₹{w.dailyRate})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker + Quick Buttons */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>તારીખ:</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${date === todayStr ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setDate(todayStr)}
                >
                  આજે
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${date === yesterdayStr ? 'btn-primary' : 'btn-outline'}`}
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
            <label className="form-label">મજૂરીનો પ્રકાર:</label>
            <div className="segment-switcher">
              <button
                type="button"
                className={`segment-btn ${workType === 'DAILY' ? 'active' : ''}`}
                onClick={() => setWorkType('DAILY')}
              >
                📅 ફિક્સ રોજી (Daily Rate)
              </button>
              <button
                type="button"
                className={`segment-btn ${workType === 'CUSTOM' ? 'active' : ''}`}
                onClick={() => setWorkType('CUSTOM')}
              >
                🔨 કામ મુજબ / ઉચક (Custom)
              </button>
            </div>
          </div>

          {/* Option A: DAILY WAGE */}
          {workType === 'DAILY' && (
            <div className="card" style={{ background: '#f8faf9', padding: '12px' }}>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label className="form-label">હાજરી સ્થિતિ:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${status === 'FULL' ? 'btn-success' : 'btn-outline'}`}
                    onClick={() => setStatus('FULL')}
                  >
                    ✓ પૂરો દિવસ
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${status === 'HALF' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setStatus('HALF')}
                  >
                    ½ અડધો દિવસ
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${status === 'ABSENT' ? 'btn-danger-outline' : 'btn-outline'}`}
                    onClick={() => setStatus('ABSENT')}
                  >
                    ✕ રજા / ગેરહાજર
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">રોજી દર (₹ / દિવસ):</label>
                <input
                  type="number"
                  className="form-control"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  placeholder="500"
                />
              </div>
            </div>
          )}

          {/* Option B: CUSTOM / VARIABLE WORK PAYMENT (Key user requirement) */}
          {workType === 'CUSTOM' && (
            <div className="card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', padding: '12px' }}>
              <div style={{ fontSize: '13px', color: '#166534', fontWeight: '700', marginBottom: '8px' }}>
                ✨ મજૂર પોતાની રકમ જાતે નાખી શકે છે:
              </div>

              <div className="form-group">
                <label className="form-label">કરેલ કામની વિગત (Task):</label>
                <input
                  type="text"
                  className="form-control"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="દા.ત. સોફા ફ્રેમ ફિટિંગ, પ્લાસ્ટર, સિમેન્ટ ભરવું"
                  required={workType === 'CUSTOM'}
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>કુલ મજૂરી રકમ (₹):</label>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#15803d', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => setUseUnitCalc(!useUnitCalc)}
                  >
                    {useUnitCalc ? 'સીધી રકમ લખો' : 'નંગ x ભાવ ગણો'}
                  </button>
                </div>

                {useUnitCalc ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="નંગ/કલાક (દા.ત. 5)"
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="ભાવ ₹ (દા.ત. 150)"
                        value={unitRate}
                        onChange={(e) => setUnitRate(e.target.value)}
                      />
                    </div>
                  </div>
                ) : null}

                <input
                  type="number"
                  className="form-control"
                  style={{ fontSize: '18px', fontWeight: '700', color: '#166534' }}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="₹ 750"
                  required
                />
              </div>
            </div>
          )}

          {/* Advance / Kharch (ઉપાડ) */}
          <div className="form-group">
            <label className="form-label">
              ઉપાડ / એડવાન્સ લીધો હોય તો (₹):
            </label>
            <input
              type="number"
              className="form-control"
              style={{ color: '#dc2626', fontWeight: '600' }}
              value={advanceAmount}
              onChange={(e) => setAdvanceAmount(e.target.value)}
              placeholder="0"
            />
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              * જો માલિક પાસેથી રકમ લીધી હોય તો અહીં લખો (આ રકમ મજૂરીમાંથી બાદ થશે).
            </div>
          </div>

          {/* Site / Farm / Owner Name */}
          <div className="form-group">
            <label className="form-label">સાઈટ / વાડી / માલિકનું નામ:</label>
            <input
              type="text"
              className="form-control"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="દા.ત. પરેશભાઈ (વાડી), સાઈટ ૨"
            />
          </div>

          {/* Quick Net Preview Banner */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>આજના હિસાબની ચોખ્ખી રકમ:</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                {formatCurrency(netCalculated)}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#475569' }}>
              <div>મજૂરી: +{formatCurrency(calculatedEarned)}</div>
              <div>ઉપાડ: -{formatCurrency(advanceVal)}</div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            💾 હિસાબ સેવ કરો
          </button>
        </form>
      </div>
    </div>
  );
}
