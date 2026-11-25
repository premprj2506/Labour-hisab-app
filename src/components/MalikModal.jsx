import React, { useState, useEffect } from 'react';
import { BuildingIcon, CloseIcon, PhoneIcon, SaveIcon } from './Icons';

export function MalikModal({ isOpen, onClose, onSave, initialData = null }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setPhone(initialData?.phone || '');
      setBusinessName(initialData?.businessName || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('કૃપા કરીને માલિકનું નામ દાખલ કરો');
      return;
    }

    onSave({
      id: initialData?.id,
      name,
      phone,
      businessName
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-header">
          <div className="modal-title">
            <BuildingIcon size={18} />
            <span>{initialData ? 'માલિક વિગત એડિટ કરો' : 'નવો માલિક ઉમેરો'}</span>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="બંધ કરો">
            <CloseIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">માલિક / શેઠનું નામ</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="દા.ત. રાહુલભાઈ શાહ, પરેશભાઈ પટેલ"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">વોટ્સએપ મોબાઈલ નંબર</label>
            <div className="input-with-prefix">
              <span className="input-prefix" style={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon size={14} />
              </span>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="દા.ત. 9825011122"
              />
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
              * આ માલિકને સીધો હિસાબ વોટ્સએપ કરવા માટે નંબર સેવ રહેશે.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">સાઈટ / ફર્મ / વાડીનું નામ (ઓપ્શનલ)</label>
            <input
              type="text"
              className="form-control"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="દા.ત. રાહુલભાઈ સોફા વર્કશોપ, પટેલ ફાર્મ"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            <SaveIcon size={18} />
            <span>માલિક સેવ કરો</span>
          </button>
        </form>
      </div>
    </div>
  );
}
