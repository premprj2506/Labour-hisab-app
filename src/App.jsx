import React, { useState, useEffect } from 'react';
import {
  getWorkers,
  getEntries,
  getSettings,
  saveSettings,
  addEntry,
  updateEntry,
  deleteEntry,
  addWorker,
  updateWorker,
  deleteWorker
} from './utils/storage';

import { Header } from './components/Header';
import { DailyEntryView } from './components/DailyEntryView';
import { DateReportView } from './components/DateReportView';
import { WorkersView } from './components/WorkersView';
import { SettingsView } from './components/SettingsView';
import { EntryFormModal } from './components/EntryFormModal';
import {
  BookOpenIcon,
  CheckCircleIcon,
  CloseIcon,
  FileBarChartIcon,
  SettingsIcon,
  UsersIcon
} from './components/Icons';

import './styles/app.css';
import './styles/print.css';

export default function App() {
  const [workers, setWorkers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('DAILY');
  const [activeWorkerId, setActiveWorkerId] = useState('ALL');

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showWorkerPicker, setShowWorkerPicker] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? '' : prev));
    }, 2600);
  };

  const loadData = () => {
    const loadedWorkers = getWorkers();
    const loadedEntries = getEntries();
    const loadedSettings = getSettings();

    setWorkers(loadedWorkers);
    setEntries(loadedEntries);
    setSettings(loadedSettings);

    if (loadedSettings.activeWorkerId) {
      setActiveWorkerId(loadedSettings.activeWorkerId);
    } else if (loadedWorkers.length > 0) {
      setActiveWorkerId(loadedWorkers[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeWorker = workers.find((w) => w.id === activeWorkerId) || null;

  const handleSelectActiveWorker = (id) => {
    setActiveWorkerId(id);
    const updated = { ...settings, activeWorkerId: id };
    setSettings(updated);
    saveSettings(updated);
    setShowWorkerPicker(false);
  };

  const handleSaveEntry = (entryData) => {
    if (entryData.id) {
      updateEntry(entryData.id, entryData);
      showToast('એન્ટ્રી અપડેટ થઈ ગઈ!');
    } else {
      addEntry(entryData);
      showToast('નવી એન્ટ્રી સેવ થઈ ગઈ!');
    }
    setEntries(getEntries());
  };

  const handleDeleteEntry = (id) => {
    deleteEntry(id);
    setEntries(getEntries());
    showToast('એન્ટ્રી કાઢી નાખવામાં આવી!');
  };

  const handleOpenAddEntry = () => {
    setEditingEntry(null);
    setIsEntryModalOpen(true);
  };

  const handleOpenEditEntry = (entry) => {
    setEditingEntry(entry);
    setIsEntryModalOpen(true);
  };

  const handleAddWorker = (wData) => {
    const created = addWorker(wData);
    setWorkers(getWorkers());
    handleSelectActiveWorker(created.id);
    showToast('નવો મજૂર ઉમેરાયો!');
  };

  const handleUpdateWorker = (id, wData) => {
    updateWorker(id, wData);
    setWorkers(getWorkers());
    showToast('મજૂરની વિગત અપડેટ થઈ!');
  };

  const handleDeleteWorker = (id) => {
    deleteWorker(id);
    const updatedWorkers = getWorkers();
    setWorkers(updatedWorkers);
    setEntries(getEntries());
    if (activeWorkerId === id) {
      setActiveWorkerId(updatedWorkers[0]?.id || 'ALL');
    }
    showToast('મજૂર ડિલીટ થયા!');
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div className="app-container">
      {toastMsg && (
        <div className="toast-banner no-print" role="status">
          <CheckCircleIcon size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      <Header
        activeWorker={activeWorker}
        onSwitchWorker={() => setShowWorkerPicker(true)}
        onOpenAddEntry={handleOpenAddEntry}
      />

      <main className="app-content">
        {activeTab === 'DAILY' && (
          <DailyEntryView
            workers={workers}
            entries={entries}
            activeWorkerId={activeWorkerId}
            onOpenAddEntry={handleOpenAddEntry}
            onEditEntry={handleOpenEditEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        )}

        {activeTab === 'REPORT' && (
          <DateReportView
            workers={workers}
            entries={entries}
            activeWorkerId={activeWorkerId}
            settings={settings}
            onUpdateSettings={handleSaveSettings}
          />
        )}

        {activeTab === 'WORKERS' && (
          <WorkersView
            workers={workers}
            entries={entries}
            activeWorkerId={activeWorkerId}
            onSelectActiveWorker={handleSelectActiveWorker}
            onAddWorker={handleAddWorker}
            onUpdateWorker={handleUpdateWorker}
            onDeleteWorker={handleDeleteWorker}
          />
        )}

        {activeTab === 'SETTINGS' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onDataReload={loadData}
            onNotify={showToast}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav no-print">
        <button
          type="button"
          className={`nav-item ${activeTab === 'DAILY' ? 'active' : ''}`}
          onClick={() => setActiveTab('DAILY')}
        >
          <span className="nav-icon-wrap">
            <BookOpenIcon size={20} />
          </span>
          <span className="nav-label">દૈનિક હિસાબ</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'REPORT' ? 'active' : ''}`}
          onClick={() => setActiveTab('REPORT')}
        >
          <span className="nav-icon-wrap">
            <FileBarChartIcon size={20} />
          </span>
          <span className="nav-label">તારીખ & PDF</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'WORKERS' ? 'active' : ''}`}
          onClick={() => setActiveTab('WORKERS')}
        >
          <span className="nav-icon-wrap">
            <UsersIcon size={20} />
          </span>
          <span className="nav-label">મજૂરો</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'SETTINGS' ? 'active' : ''}`}
          onClick={() => setActiveTab('SETTINGS')}
        >
          <span className="nav-icon-wrap">
            <SettingsIcon size={20} />
          </span>
          <span className="nav-label">સેટિંગ્સ</span>
        </button>
      </nav>

      {/* Entry Modal */}
      <EntryFormModal
        key={editingEntry ? editingEntry.id : `new-${isEntryModalOpen}-${activeWorkerId}`}
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSave={handleSaveEntry}
        workers={workers}
        activeWorkerId={activeWorkerId}
        initialData={editingEntry}
        settings={settings}
      />

      {/* Worker Switcher Modal */}
      {showWorkerPicker && (
        <div
          className="modal-overlay"
          onClick={() => setShowWorkerPicker(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-header">
              <div className="modal-title">
                <UsersIcon size={18} />
                <span>મજૂર પસંદ કરો</span>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowWorkerPicker(false)}
                aria-label="બંધ કરો"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className={`btn ${activeWorkerId === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'flex-start', padding: '12px 14px' }}
                onClick={() => handleSelectActiveWorker('ALL')}
              >
                <UsersIcon size={18} />
                <span>બધા મજૂરો (સામૂહિક હિસાબ)</span>
              </button>
              {workers.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={`btn ${activeWorkerId === w.id ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    justifyContent: 'space-between',
                    padding: '12px 14px'
                  }}
                  onClick={() => handleSelectActiveWorker(w.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: activeWorkerId === w.id ? 'rgba(255,255,255,0.2)' : '#e6f4ed',
                        color: activeWorkerId === w.id ? '#ffffff' : '#145339',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14px'
                      }}
                    >
                      {w.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700' }}>{w.name}</div>
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        {w.role} {w.phone ? `(${w.phone})` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '13px' }}>₹{w.dailyRate}/દિવસ</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
