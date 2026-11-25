import React from 'react';
import { exportAllData, importAllData, resetToDemoData } from '../utils/storage';
import {
  BuildingIcon,
  DownloadIcon,
  RefreshIcon,
  UploadIcon
} from './Icons';

export function SettingsView({ onDataReload, onNotify, onGoToMaliks }) {
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
      {/* Quick Shortcut to Multiple Maliks */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: '6px' }}>
          <div className="section-title">
            <BuildingIcon size={18} />
            <span>માલિકોનું લિસ્ટ અને નંબર</span>
          </div>
        </div>
        <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '12px' }}>
          જો તમે એક કરતાં વધુ માલિક (શેઠ) ના ત્યાં કામ કરતા હો, તો દરેક માલિકનું નામ અને વોટ્સએપ નંબર "માલિકો" ટેબમાં ઉમેરી શકો છો.
        </p>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={onGoToMaliks}
        >
          <BuildingIcon size={16} />
          <span>માલિકોનું લિસ્ટ ખોલો</span>
        </button>
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
          તમારો તમામ હિસાબ, મજૂરો અને માલિકોનો ડેટા સુરક્ષિત રાખવા માટે બેકઅપ ફાઈલ ડાઉનલોડ કે રિસ્ટોર કરી શકો છો.
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
