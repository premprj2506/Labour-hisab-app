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

import './styles/app.css';
import './styles/print.css';

export default function App() {
  const [workers, setWorkers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('DAILY'); // 'DAILY', 'REPORT', 'WORKERS', 'SETTINGS'
  const [activeWorkerId, setActiveWorkerId] = useState('ALL');

  // Modal State
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Worker Switcher dropdown modal
  const [showWorkerPicker, setShowWorkerPicker] = useState(false);

  // Load Initial Data
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

  // Worker Selection Handler
  const handleSelectActiveWorker = (id) => {
    setActiveWorkerId(id);
    const updated = { ...settings, activeWorkerId: id };
    setSettings(updated);
    saveSettings(updated);
    setShowWorkerPicker(false);
  };

  // Entry CRUD handlers
  const handleSaveEntry = (entryData) => {
    if (entryData.id) {
      updateEntry(entryData.id, entryData);
    } else {
      addEntry(entryData);
    }
    setEntries(getEntries());
  };

  const handleDeleteEntry = (id) => {
    deleteEntry(id);
    setEntries(getEntries());
  };

  const handleOpenAddEntry = () => {
    setEditingEntry(null);
    setIsEntryModalOpen(true);
  };

  const handleOpenEditEntry = (entry) => {
    setEditingEntry(entry);
    setIsEntryModalOpen(true);
  };

  // Worker CRUD handlers
  const handleAddWorker = (wData) => {
    const created = addWorker(wData);
    setWorkers(getWorkers());
    handleSelectActiveWorker(created.id);
  };

  const handleUpdateWorker = (id, wData) => {
    updateWorker(id, wData);
    setWorkers(getWorkers());
  };

  const handleDeleteWorker = (id) => {
    deleteWorker(id);
    const updatedWorkers = getWorkers();
    setWorkers(updatedWorkers);
    setEntries(getEntries());
    if (activeWorkerId === id) {
      setActiveWorkerId(updatedWorkers[0]?.id || 'ALL');
    }
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <Header
        activeWorker={activeWorker}
        onSwitchWorker={() => setShowWorkerPicker(true)}
        onOpenAddEntry={handleOpenAddEntry}
      />

      {/* Main Content Area */}
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
          <span className="nav-icon">📝</span>
          <span className="nav-label">દૈનિક હિસાબ</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'REPORT' ? 'active' : ''}`}
          onClick={() => setActiveTab('REPORT')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">તારીખ & PDF</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'WORKERS' ? 'active' : ''}`}
          onClick={() => setActiveTab('WORKERS')}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-label">મજૂરો</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'SETTINGS' ? 'active' : ''}`}
          onClick={() => setActiveTab('SETTINGS')}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">સેટિંગ્સ</span>
        </button>
      </nav>

      {/* Entry Modal */}
      <EntryFormModal
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
            <div className="modal-header">
              <div className="modal-title">👤 મજૂર પસંદ કરો</div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowWorkerPicker(false)}
              >
                ✕
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className={`btn ${activeWorkerId === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'flex-start' }}
                onClick={() => handleSelectActiveWorker('ALL')}
              >
                👥 બધા મજૂરો (સામૂહિક હિસાબ)
              </button>
              {workers.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={`btn ${activeWorkerId === w.id ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    justifyContent: 'space-between',
                    padding: '12px 16px'
                  }}
                  onClick={() => handleSelectActiveWorker(w.id)}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '700' }}>{w.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      {w.role} {w.phone ? `(${w.phone})` : ''}
                    </div>
                  </div>
                  <div style={{ fontWeight: '700' }}>₹{w.dailyRate}/દિવસ</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
