import React, { useState } from 'react';
import { formatCurrency } from '../utils/calculator';
import { WorkerModal } from './WorkerModal';
import {
  CheckCircleIcon,
  EditIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon
} from './Icons';

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
      <div className="section-header" style={{ marginBottom: '14px' }}>
        <div>
          <div className="section-title">
            <UsersIcon size={19} />
            <span>મજૂરોનું સંચાલન ({workers.length})</span>
          </div>
          <div className="section-sub">
            દરેક મજૂરનો હિસાબ અને દૈનિક રોજી દર
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleOpenAdd}
        >
          <PlusIcon size={15} />
          <span>નવો મજૂર</span>
        </button>
      </div>

      {/* Quick All-Workers Switch Card */}
      <div
        className="card"
        style={{
          padding: '11px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderColor: activeWorkerId === 'ALL' ? '#145339' : '#e4eae6',
          borderWidth: activeWorkerId === 'ALL' ? '2px' : '1px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: activeWorkerId === 'ALL' ? '#145339' : '#e6f4ed',
              color: activeWorkerId === 'ALL' ? '#ffffff' : '#145339',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <UsersIcon size={17} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>બધા મજૂરો (સામૂહિક)</div>
            <div style={{ fontSize: '11.5px', color: '#64748b' }}>સર્વ મજૂરોનો એકસાથે હિસાબ જુઓ</div>
          </div>
        </div>
        {activeWorkerId === 'ALL' ? (
          <span className="badge badge-full">
            <CheckCircleIcon size={12} />
            <span>પસંદ કરેલ</span>
          </span>
        ) : (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onSelectActiveWorker('ALL')}
          >
            પસંદ કરો
          </button>
        )}
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
              borderColor: isActive ? '#145339' : '#e4eae6',
              borderWidth: isActive ? '2px' : '1px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '8px',
                marginBottom: '12px'
              }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isActive ? '#145339' : '#e6f4ed',
                    color: isActive ? '#ffffff' : '#145339',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '17px',
                    flexShrink: 0
                  }}
                >
                  {w.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '15.5px', fontWeight: '700' }}>
                    {w.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <span>{w.role}</span>
                    {w.phone && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <PhoneIcon size={11} />
                        <span>{w.phone}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isActive ? (
                <span className="badge badge-full">
                  <CheckCircleIcon size={12} />
                  <span>સક્રિય</span>
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
                border: '1px solid #e4eae6',
                borderRadius: '10px',
                padding: '9px 10px',
                textAlign: 'center',
                marginBottom: '12px'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>રોજી દર</div>
                <div style={{ fontSize: '13.5px', fontWeight: '700' }}>
                  {formatCurrency(w.dailyRate)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>કુલ કમાણી</div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#15803d' }}>
                  {formatCurrency(earned)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>ચોખ્ખી બાકી</div>
                <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a' }}>
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
                <EditIcon size={14} />
                <span>વિગત બદલો</span>
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
                <TrashIcon size={14} />
                <span>ડિલીટ</span>
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
