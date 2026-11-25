import React, { useState } from 'react';
import { formatCurrency } from '../utils/calculator';
import { MalikModal } from './MalikModal';
import {
  BuildingIcon,
  EditIcon,
  FileBarChartIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon
} from './Icons';

export function MaliksView({
  maliks,
  entries,
  activeWorkerId,
  onAddMalik,
  onUpdateMalik,
  onDeleteMalik,
  onOpenMalikReport
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMalik, setEditingMalik] = useState(null);

  const handleOpenAdd = () => {
    setEditingMalik(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (malik) => {
    setEditingMalik(malik);
    setModalOpen(true);
  };

  const handleSave = (malikData) => {
    if (editingMalik) {
      onUpdateMalik(editingMalik.id, malikData);
    } else {
      onAddMalik(malikData);
    }
  };

  // Filter entries by active worker so each Malik card shows balance for the selected worker (or all)
  const relevantEntries = entries.filter((e) => {
    if (activeWorkerId && activeWorkerId !== 'ALL') {
      return e.workerId === activeWorkerId;
    }
    return true;
  });

  return (
    <div className="maliks-view no-print">
      <div className="section-header" style={{ marginBottom: '14px' }}>
        <div>
          <div className="section-title">
            <BuildingIcon size={19} />
            <span>માલિકોનું સંચાલન ({maliks.length})</span>
          </div>
          <div className="section-sub">
            દરેક માલિક પ્રમાણે કામ અને બાકી હિસાબ
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleOpenAdd}
        >
          <PlusIcon size={15} />
          <span>નવો માલિક</span>
        </button>
      </div>

      {maliks.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '34px 16px', color: '#64748b' }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              margin: '0 auto 12px auto',
              borderRadius: '50%',
              background: '#e6f4ed',
              color: '#145339',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BuildingIcon size={22} />
          </div>
          <div style={{ fontWeight: '700', fontSize: '15.5px', color: '#0f172a', marginBottom: '4px' }}>
            કોઈ માલિક ઉમેરેલ નથી
          </div>
          <div style={{ fontSize: '13px', marginBottom: '16px' }}>
            તમે જેમના ત્યાં કામ કરો છો તે માલિકોનું નામ અને વોટ્સએપ નંબર ઉમેરો.
          </div>
          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <PlusIcon size={16} />
            <span>પ્રથમ માલિક ઉમેરો</span>
          </button>
        </div>
      ) : (
        maliks.map((m) => {
          const malikEntries = relevantEntries.filter((e) => e.malikId === m.id);
          const earned = malikEntries.reduce(
            (sum, e) => sum + (Number(e.earnedAmount) || 0),
            0
          );
          const advance = malikEntries.reduce(
            (sum, e) => sum + (Number(e.advanceAmount) || 0),
            0
          );
          const net = earned - advance;

          return (
            <div key={m.id} className="card">
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
                      borderRadius: '12px',
                      background: '#e6f4ed',
                      color: '#145339',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '17px',
                      flexShrink: 0
                    }}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '15.5px', fontWeight: '700' }}>{m.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {m.businessName || 'સાઈટ / કામ'}
                    </div>
                    {m.phone && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#145339',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginTop: '2px'
                        }}
                      >
                        <PhoneIcon size={11} />
                        <span>{m.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <span className="hero-count-pill" style={{ background: '#f1f5f9', color: '#334155' }}>
                  {malikEntries.length} એન્ટ્રી
                </span>
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
                  <div style={{ fontSize: '11px', color: '#64748b' }}>કુલ મજૂરી</div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#15803d' }}>
                    {formatCurrency(earned)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>લીધેલ ઉપાડ</div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#dc2626' }}>
                    {formatCurrency(advance)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>બાકી લેવાના</div>
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a' }}>
                    {formatCurrency(net)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenMalikReport(m.id)}
                >
                  <FileBarChartIcon size={14} />
                  <span>PDF / વોટ્સએપ</span>
                </button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleOpenEdit(m)}
                  >
                    <EditIcon size={14} />
                    <span>એડિટ</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger-outline btn-sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          `શું તમે ખરેખર માલિક "${m.name}" ને ડિલીટ કરવા માંગો છો?`
                        )
                      ) {
                        onDeleteMalik(m.id);
                      }
                    }}
                  >
                    <TrashIcon size={14} />
                    <span>ડિલીટ</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}

      <MalikModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingMalik}
      />
    </div>
  );
}
