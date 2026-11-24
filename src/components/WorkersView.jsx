import React, { useState } from 'react';
import { formatCurrency } from '../utils/calculator';
import { WorkerModal } from './WorkerModal';

export function WorkersView({
  workers,
  entries,
  activeWorkerId,
  onSelectActiveWorker,
  onAddWorker,
  onUpdateWorker,
  onDeleteWorker
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);

  const handleOpenAdd = () => {
    setEditingWorker(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (worker) => {
    setEditingWorker(worker);
    setModalOpen(true);
  };

  const handleSave = (workerData) => {
    if (editingWorker) {
      onUpdateWorker(editingWorker.id, workerData);
    } else {
      onAddWorker(workerData);
    }
  };

  return (
    <div className="workers-view no-print">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>
            👥 મજૂરોનું સંચાલન ({workers.length})
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            દરેક મજૂરનો હિસાબ અને રોજી દર
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleOpenAdd}
        >
          ➕ નવો મજૂર
        </button>
      </div>

      {/* Workers list */}
      {workers.map((w) => {
        const workerEntries = entries.filter((e) => e.workerId === w.id);
        const earned = workerEntries.reduce(
          (sum, e) => sum + (Number(e.earnedAmount) || 0),
          0
        );
        const advance = workerEntries.reduce(
          (sum, e) => sum + (Number(e.advanceAmount) || 0),
          0
        );
        const net = earned - advance;
        const isActive = activeWorkerId === w.id;

        return (
          <div
            key={w.id}
            className="card"
            style={{
              borderColor: isActive ? '#1e5139' : '#e2e8f0',
              borderWidth: isActive ? '2px' : '1px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isActive ? '#1e5139' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '18px'
                  }}
                >
                  {w.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700' }}>
                    {w.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {w.role} {w.phone ? `• 📞 ${w.phone}` : ''}
                  </div>
                </div>
              </div>

              {isActive ? (
                <span className="badge badge-full">
                  ✓ પસંદ કરેલ પ્રોફાઇલ
                </span>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => onSelectActiveWorker(w.id)}
                >
                  પસંદ કરો
                </button>
              )}
            </div>

            {/* Stats row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                background: '#f8faf9',
                borderRadius: '8px',
                padding: '8px 10px',
                textAlign: 'center',
                marginBottom: '10px'
              }}
            >
              <div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>રોજી દર</div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>
                  {formatCurrency(w.dailyRate)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>કુલ કમાણી</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a' }}>
                  {formatCurrency(earned)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>ચોખ્ખી બાકી</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                  {formatCurrency(net)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleOpenEdit(w)}
              >
                ✏️ વિગત બદલો
              </button>
              <button
                type="button"
                className="btn btn-danger-outline btn-sm"
                onClick={() => {
                  if (
                    window.confirm(
                      `શું તમે ખરેખર ${w.name} અને તેમનો તમામ હિસાબ કાઢી નાખવા માંગો છો?`
                    )
                  ) {
                    onDeleteWorker(w.id);
                  }
                }}
              >
                🗑️ ડિલીટ
              </button>
            </div>
          </div>
        );
      })}

      <WorkerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingWorker}
      />
    </div>
  );
}
