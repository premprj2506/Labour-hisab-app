import React, { useState } from 'react';

export function WorkerModal({ isOpen, onClose, onSave, initialData = null }) {
  if (!isOpen) return null;

  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [dailyRate, setDailyRate] = useState(initialData?.dailyRate || 500);
  const [role, setRole] = useState(initialData?.role || 'જનરલ મજૂર');

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
        <div className="modal-header">
          <div className="modal-title">
            {initialData ? '✏️ મજૂર વિગત એડિટ કરો' : '👥 નવો મજૂર ઉમેરો'}
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">મજૂરનું નામ:</label>
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
            <label className="form-label">મોબાઈલ નંબર (ઓપ્શનલ):</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="દા.ત. 9825012345"
            />
          </div>

          <div className="form-group">
            <label className="form-label">દૈનિક રોજી દર (₹ / દિવસ):</label>
            <input
              type="number"
              className="form-control"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              placeholder="500"
              required
            />
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              * જો રોજી ફિક્સ ન હોય તો પણ સામાન્ય દર લખી શકાય છે (કામ મુજબ મજૂરીમાં અલગ રકમ લખી શકાશે).
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">કામનો પ્રકાર / ભૂમિકા:</label>
            <input
              type="text"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="દા.ત. સોફા કારીગર, કડિયા કામ, વાડી મજૂર"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            💾 મજૂર સેવ કરો
          </button>
        </form>
      </div>
    </div>
  );
}
