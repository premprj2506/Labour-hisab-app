import React, { useState, useEffect } from 'react';
import { exportAllData, importAllData, resetToDemoData } from '../utils/storage';
import {
  DownloadIcon,
  PhoneIcon,
  RefreshIcon,
  SaveIcon,
  SettingsIcon,
  UploadIcon
} from './Icons';

export function SettingsView({ settings, onSaveSettings, onDataReload, onNotify }) {
  const [ownerName, setOwnerName] = useState(settings?.ownerName || '');
  const [ownerPhone, setOwnerPhone] = useState(settings?.ownerPhone || '');
  const [businessName, setBusinessName] = useState(settings?.businessName || '');

  useEffect(() => {
    setOwnerName(settings?.ownerName || '');
    setOwnerPhone(settings?.ownerPhone || '');
    setBusinessName(settings?.businessName || '');
  }, [settings]);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      ownerName,
      ownerPhone,
      businessName
    });
    if (onNotify) onNotify('સેટિંગ્સ સાચવવામાં આવ્યા!');
  };

  const handleExport = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `majuri_hisab_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (onNotify) onNotify('બેકઅપ ફાઈલ ડાઉનલોડ થઈ!');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const ok = importAllData(content);
        if (ok) {
          onDataReload();
          if (onNotify) onNotify('ડેટા સફળતાપૂર્વક રિસ્ટોર થયો!');
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
      if (onNotify) onNotify('ડેમો ડેટા ફરીથી લોડ થયો!');
    }
  };

  return (
    <div className="settings-view no-print">
      <div className="card">
        <div className="section-header" style={{ marginBottom: '12px' }}>
          <div className="section-title">
            <SettingsIcon size={18} />
            <span>માલિક અને વ્યવસાયની વિગત</span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">માલિક / ફર્મનું નામ</label>
            <input
              type="text"
              className="form-control"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="દા.ત. પટેલ ફાર્મ / શ્રી ગણેશ ફર્નિચર"
            />
          </div>

          <div className="form-group">
            <label className="form-label">માલિકનું પૂરું નામ</label>
            <input
              type="text"
              className="form-control"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="દા.ત. પરેશભાઈ પટેલ"
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
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="દા.ત. 9876543210"
              />
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
              * આ નંબર પર મજૂર સીધો હિસાબ વોટ્સએપ કરી શકશે.
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            <SaveIcon size={17} />
            <span>સેટિંગ્સ સાચવો</span>
          </button>
        </form>
      </div>

      {/* Backup and Restore */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: '6px' }}>
          <div className="section-title">
            <DownloadIcon size={18} />
            <span>બેકઅપ અને ડેટા સુરક્ષા</span>
          </div>
        </div>
        <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '12px' }}>
          તમારો તમામ હિસાબ અને મજૂરોનો ડેટા સુરક્ષિત રાખવા માટે બેકઅપ ફાઈલ ડાઉનલોડ કે રિસ્ટોર કરી શકો છો.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleExport}
          >
            <DownloadIcon size={16} />
            <span>બેકઅપ લો</span>
          </button>

          <label
            className="btn btn-outline"
            style={{ textAlign: 'center', cursor: 'pointer' }}
          >
            <UploadIcon size={16} />
            <span>રિસ્ટોર કરો</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div style={{ marginTop: '16px', borderTop: '1px solid #e4eae6', paddingTop: '12px' }}>
          <button
            type="button"
            className="btn btn-danger-outline btn-sm btn-block"
            onClick={handleReset}
          >
            <RefreshIcon size={14} />
            <span>ડેમો ડેટા ફરીથી લોડ કરો (Reset)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
