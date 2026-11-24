import React, { useState } from 'react';
import { exportAllData, importAllData, resetToDemoData } from '../utils/storage';

export function SettingsView({ settings, onSaveSettings, onDataReload }) {
  const [ownerName, setOwnerName] = useState(settings?.ownerName || '');
  const [ownerPhone, setOwnerPhone] = useState(settings?.ownerPhone || '');
  const [businessName, setBusinessName] = useState(settings?.businessName || '');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      ownerName,
      ownerPhone,
      businessName
    });
    setSavedMsg('સેટિંગ્સ સાચવવામાં આવી ગયા છે!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  // Export JSON backup file
  const handleExport = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `majuri_hisab_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup file
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const ok = importAllData(content);
        if (ok) {
          alert('ડેટા સફળતાપૂર્વક રિસ્ટોર થયો છે!');
          onDataReload();
        } else {
          alert('ફાઈલ વાંચવામાં ભૂલ થઈ. કૃપા કરીને સાચી JSON બેકઅપ ફાઈલ પસંદ કરો.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'શું તમે ડેમો ડેટા ફરીથી લોડ કરવા માંગો છો? આનાથી હાલનો ડેટા રીસેટ થશે.'
      )
    ) {
      resetToDemoData();
      onDataReload();
    }
  };

  return (
    <div className="settings-view no-print">
      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
          ⚙️ એપ્લિકેશન સેટિંગ્સ
        </h2>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">માલિક / ફર્મનું નામ:</label>
            <input
              type="text"
              className="form-control"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="દા.ત. પટેલ ફાર્મ / શ્રી ગણેશ ફર્નિચર"
            />
          </div>

          <div className="form-group">
            <label className="form-label">માલિકનું પૂરું નામ:</label>
            <input
              type="text"
              className="form-control"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="દા.ત. પરેશભાઈ પટેલ"
            />
          </div>

          <div className="form-group">
            <label className="form-label">વોટ્સએપ મોબાઈલ નંબર:</label>
            <input
              type="tel"
              className="form-control"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              placeholder="દા.ત. 9876543210"
            />
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              * આ નંબર પર મજૂર સીધો પીડીએફ અને હિસાબ વોટ્સએપ કરી શકશે.
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            💾 સેટિંગ્સ સાચવો
          </button>

          {savedMsg && (
            <div
              style={{
                color: '#16a34a',
                fontSize: '13px',
                textAlign: 'center',
                marginTop: '8px',
                fontWeight: '600'
              }}
            >
              ✓ {savedMsg}
            </div>
          )}
        </form>
      </div>

      {/* Free Live Deployment Guide */}
      <div
        className="card"
        style={{ background: '#f0fdf4', borderColor: '#86efac' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px' }}>🚀</span>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#166534' }}>
            ૧૦૦% ફ્રી માં લાઈવ કેવી રીતે કરવું? (Free Hosting)
          </h3>
        </div>
        <div style={{ fontSize: '13px', color: '#1f2937', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '8px' }}>
            ૩-૪ વ્યક્તિઓ માટે પ્લે સ્ટોર ($25) વગર આ એપ્લિકેશન લાઈફટાઇમ <strong>ફ્રી</strong> ચલાવી શકો છો:
          </p>
          <ol style={{ paddingLeft: '18px', marginBottom: '10px' }}>
            <li>
              આ કોડને <strong>GitHub</strong> પર અપલોડ કરો.
            </li>
            <li>
              <strong>Vercel.com</strong> અથવા <strong>Netlify.com</strong> પર જઈને ૧-ક્લિકમાં ડિપ્લોય કરો (Free Forever).
            </li>
            <li>
              તમને મળેલી લિંક (દા.ત. <code>https://majuri-hisab.vercel.app</code>) બધા ૩-૪ મજૂરોના મોબાઈલ વોટ્સએપમાં મોકલો.
            </li>
            <li>
              તેમના મોબાઈલ ક્રોમમાં ખોલીને <strong>"Add to Home Screen"</strong> કરવાથી તે ઓરિજિનલ એપ જેવી બની જશે!
            </li>
          </ol>
        </div>
      </div>

      {/* Backup and Restore */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
          💾 બેકઅપ અને ડેટા સાચવો
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
          તમારો તમામ હિસાબ અને મજૂરોનો ડેટા સુરક્ષિત રાખવા માટે બેકઅપ ફાઈલ ડાઉનલોડ કરી શકો છો.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ flex: 1 }}
            onClick={handleExport}
          >
            📥 બેકઅપ ડાઉનલોડ
          </button>

          <label
            className="btn btn-outline"
            style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}
          >
            📤 બેકઅપ રિસ્ટોર
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
          <button
            type="button"
            className="btn btn-danger-outline btn-sm btn-block"
            onClick={handleReset}
          >
            🔄 ડેમો ડેટા ફરીથી લોડ કરો (Reset)
          </button>
        </div>
      </div>
    </div>
  );
}
