import React, { useState, useEffect } from 'react';
import { CloseIcon, SaveIcon, UsersIcon } from './Icons';

export function WorkerModal({ isOpen, onClose, onSave, initialData = null }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dailyRate, setDailyRate] = useState(500);
  const [role, setRole] = useState('જનરલ મજૂર');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setPhone(initialData?.phone || '');
      setDailyRate(initialData?.dailyRate ?? 500);
      setRole(initialData?.role || 'જનરલ મજૂર');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('કૃપા કરીને મજૂરનું નામ દાખલ કરો');
      return;
    }

    onSave({
      id: initialData?.id,
      name,
      phone,
      dailyRate: Number(dailyRate) || 0,
      role
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-header">
          <div className="modal-title">
            <UsersIcon size={18} />
            <span>{initialData ? 'મજૂર વિગત એડિટ કરો' : 'નવો મજૂર ઉમેરો'}</span>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="બંધ કરો">
            <CloseIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">મજૂરનું નામ</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="દા.ત. રમેશભાઈ પરમાર"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">મોબાઈલ નંબર (ઓપ્શનલ)</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="દા.ત. 9825012345"
            />
          </div>

          <div className="form-group">
            <label className="form-label">દૈનિક રોજી દર (દિવસ દીઠ)</label>
            <div className="input-with-prefix">
              <span className="input-prefix">₹</span>
              <input
                type="number"
                className="form-control"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                placeholder="500"
                required
              />
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
              * જો રોજી ફિક્સ ન હોય તો પણ સામાન્ય દર લખી શકાય છે (કામ મુજબમાં અલગ રકમ લખી શકાશે).
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">કામનો પ્રકાર / ભૂમિકા</label>
            <input
              type="text"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="દા.ત. સોફા કારીગર, કડિયા કામ, વાડી મજૂર"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            <SaveIcon size={18} />
            <span>મજૂર સેવ કરો</span>
          </button>
        </form>
      </div>
    </div>
  );
}
