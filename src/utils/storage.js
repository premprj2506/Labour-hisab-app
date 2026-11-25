// Storage utilities for Majuri Khatavahi
const WORKERS_KEY = 'majuri_workers_v1';
const ENTRIES_KEY = 'majuri_entries_v1';
const SETTINGS_KEY = 'majuri_settings_v1';

// Sample Seed Workers
const INITIAL_WORKERS = [
  {
    id: 'w1',
    name: 'રમેશભાઈ પરમાર',
    phone: '9825012345',
    dailyRate: 500,
    role: 'કડિયા / જનરલ કામ',
    createdAt: '2026-11-01'
  },
  {
    id: 'w2',
    name: 'મુકેશભાઈ પ્રજાપતિ',
    phone: '9825067890',
    dailyRate: 450,
    role: 'કારીગર / ફ્રેમ કામ',
    createdAt: '2026-11-01'
  },
  {
    id: 'w3',
    name: 'કાળુભાઈ ઠાકોર',
    phone: '9825054321',
    dailyRate: 400,
    role: 'વાડી / ખેતી મજૂર',
    createdAt: '2026-11-01'
  },
  {
    id: 'w4',
    name: 'દિનેશભાઈ વાઘેલા',
    phone: '9825098765',
    dailyRate: 500,
    role: 'કલર / ફિટિંગ કામ',
    createdAt: '2026-11-01'
  }
];

// Helper to generate dates around today
function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// Sample Seed Entries for demonstration
const INITIAL_ENTRIES = [
  {
    id: 'e1',
    workerId: 'w1',
    date: getPastDate(5),
    workType: 'DAILY', // DAILY or CUSTOM
    status: 'FULL',    // FULL, HALF, ABSENT
    rate: 500,
    earnedAmount: 500,
    advanceAmount: 0,
    taskDesc: 'આખો દિવસ રોજી',
    siteName: 'સાઈટ ૧ - પ્લોટ ૪',
    notes: 'સમયસર હાજર'
  },
  {
    id: 'e2',
    workerId: 'w1',
    date: getPastDate(4),
    workType: 'CUSTOM', // Variable work payment!
    status: 'FULL',
    rate: 0,
    earnedAmount: 850,
    advanceAmount: 200, // લીધેલ ઉપાડ
    taskDesc: 'દીવાલ પ્લાસ્ટર અને સિમેન્ટ કામ',
    siteName: 'સાઈટ ૧ - પ્લોટ ૪',
    notes: 'ઉપાડ ₹200 લીધો'
  },
  {
    id: 'e3',
    workerId: 'w1',
    date: getPastDate(3),
    workType: 'DAILY',
    status: 'FULL',
    rate: 500,
    earnedAmount: 500,
    advanceAmount: 0,
    taskDesc: 'આખો દિવસ રોજી',
    siteName: 'સાઈટ ૧ - પ્લોટ ૪',
    notes: ''
  },
  {
    id: 'e4',
    workerId: 'w1',
    date: getPastDate(2),
    workType: 'CUSTOM',
    status: 'FULL',
    rate: 0,
    earnedAmount: 750,
    advanceAmount: 100,
    taskDesc: 'સોફા ફ્રેમ ફિટિંગ - ૨ નંગ',
    siteName: 'વર્કશોપ',
    notes: 'ઉપાડ ₹100'
  },
  {
    id: 'e5',
    workerId: 'w1',
    date: getPastDate(1),
    workType: 'DAILY',
    status: 'HALF',
    rate: 500,
    earnedAmount: 250,
    advanceAmount: 0,
    taskDesc: 'અડધો દિવસ (બપોર પછી)',
    siteName: 'સાઈટ ૧',
    notes: ''
  },
  {
    id: 'e6',
    workerId: 'w2',
    date: getPastDate(3),
    workType: 'DAILY',
    status: 'FULL',
    rate: 450,
    earnedAmount: 450,
    advanceAmount: 150,
    taskDesc: 'આખો દિવસ રોજી',
    siteName: 'વાડી સાઈટ',
    notes: 'નાસ્તા માટે ઉપાડ'
  },
  {
    id: 'e7',
    workerId: 'w2',
    date: getPastDate(1),
    workType: 'CUSTOM',
    status: 'FULL',
    rate: 0,
    earnedAmount: 900,
    advanceAmount: 0,
    taskDesc: '૪ બેગ સિમેન્ટ ભરવાનું અને મિક્સિંગ',
    siteName: 'વાડી સાઈટ',
    notes: 'કામ મુજબ'
  }
];

const INITIAL_SETTINGS = {
  ownerName: 'પરેશભાઈ પટેલ',
  ownerPhone: '9876543210',
  businessName: 'પટેલ ફાર્મ & કન્સ્ટ્રક્શન',
  activeWorkerId: 'w1'
};

// Workers CRUD
export function getWorkers() {
  try {
    const raw = localStorage.getItem(WORKERS_KEY);
    if (!raw) {
      localStorage.setItem(WORKERS_KEY, JSON.stringify(INITIAL_WORKERS));
      return INITIAL_WORKERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading workers:', e);
    return INITIAL_WORKERS;
  }
}

export function saveWorkers(workers) {
  try {
    localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
  } catch (e) {
    console.error('Error saving workers:', e);
  }
}

export function addWorker(workerData) {
  const workers = getWorkers();
  const newWorker = {
    id: 'w_' + Date.now(),
    name: workerData.name.trim(),
    phone: workerData.phone ? workerData.phone.trim() : '',
    dailyRate: Number(workerData.dailyRate) || 0,
    role: workerData.role ? workerData.role.trim() : 'મજૂર',
    createdAt: new Date().toISOString().split('T')[0]
  };
  workers.push(newWorker);
  saveWorkers(workers);
  return newWorker;
}

export function updateWorker(id, updatedFields) {
  const workers = getWorkers();
  const idx = workers.findIndex(w => w.id === id);
  if (idx !== -1) {
    workers[idx] = { ...workers[idx], ...updatedFields };
    saveWorkers(workers);
    return workers[idx];
  }
  return null;
}

export function deleteWorker(id) {
  const workers = getWorkers().filter(w => w.id !== id);
  saveWorkers(workers);
  // Also delete associated entries
  const entries = getEntries().filter(e => e.workerId !== id);
  saveEntries(entries);
}

// Entries CRUD
export function getEntries() {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(INITIAL_ENTRIES));
      return INITIAL_ENTRIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading entries:', e);
    return INITIAL_ENTRIES;
  }
}

export function saveEntries(entries) {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Error saving entries:', e);
  }
}

export function addEntry(entryData) {
  const entries = getEntries();
  const newEntry = {
    id: 'e_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    workerId: entryData.workerId,
    date: entryData.date || new Date().toISOString().split('T')[0],
    workType: entryData.workType || 'DAILY', // 'DAILY' or 'CUSTOM'
    status: entryData.status || 'FULL',      // 'FULL', 'HALF', 'ABSENT'
    rate: Number(entryData.rate) || 0,
    earnedAmount: Number(entryData.earnedAmount) || 0,
    advanceAmount: Number(entryData.advanceAmount) || 0,
    taskDesc: entryData.taskDesc ? entryData.taskDesc.trim() : '',
    siteName: entryData.siteName ? entryData.siteName.trim() : '',
    notes: entryData.notes ? entryData.notes.trim() : ''
  };
  entries.unshift(newEntry);
  saveEntries(entries);
  return newEntry;
}

export function updateEntry(id, updatedFields) {
  const entries = getEntries();
  const idx = entries.findIndex(e => e.id === id);
  if (idx !== -1) {
    entries[idx] = { ...entries[idx], ...updatedFields };
    saveEntries(entries);
    return entries[idx];
  }
  return null;
}

export function deleteEntry(id) {
  const entries = getEntries().filter(e => e.id !== id);
  saveEntries(entries);
}

// Settings
export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

// Full Export / Import (for free backup between phones)
export function exportAllData() {
  return JSON.stringify({
    version: '1.0',
    exportedAt: new Date().toISOString(),
    workers: getWorkers(),
    entries: getEntries(),
    settings: getSettings()
  }, null, 2);
}

export function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.workers && Array.isArray(data.workers)) {
      saveWorkers(data.workers);
    }
    if (data.entries && Array.isArray(data.entries)) {
      saveEntries(data.entries);
    }
    if (data.settings) {
      saveSettings(data.settings);
    }
    return true;
  } catch (e) {
    console.error('Import error:', e);
    return false;
  }
}

export function resetToDemoData() {
  localStorage.setItem(WORKERS_KEY, JSON.stringify(INITIAL_WORKERS));
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(INITIAL_ENTRIES));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
}
