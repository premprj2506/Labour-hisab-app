// Storage utilities for Majuri Khatavahi
import { toLocalDateStr } from './calculator';

const WORKERS_KEY = 'majuri_workers_v1';
const MALIKS_KEY = 'majuri_maliks_v1';
const ENTRIES_KEY = 'majuri_entries_v1';
const SETTINGS_KEY = 'majuri_settings_v1';

function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return toLocalDateStr(d);
}

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

// Sample Seed Maliks (Multiple Owners / Contractors)
const INITIAL_MALIKS = [
  {
    id: 'm1',
    name: 'પરેશભાઈ પટેલ',
    phone: '9876543210',
    businessName: 'પટેલ ફાર્મ & કન્સ્ટ્રક્શન',
    createdAt: '2026-11-01'
  },
  {
    id: 'm2',
    name: 'રાહુલભાઈ શાહ',
    phone: '9825011122',
    businessName: 'રાહુલભાઈ સોફા વર્કશોપ',
    createdAt: '2026-11-01'
  }
];

// Sample Seed Entries demonstrating multiple Maliks
const INITIAL_ENTRIES = [
  {
    id: 'e1',
    workerId: 'w1',
    malikId: 'm1',
    date: getPastDate(5),
    workType: 'DAILY',
    status: 'FULL',
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
    malikId: 'm1',
    date: getPastDate(4),
    workType: 'CUSTOM',
    status: 'FULL',
    rate: 0,
    earnedAmount: 850,
    advanceAmount: 200,
    taskDesc: 'દીવાલ પ્લાસ્ટર અને સિમેન્ટ કામ',
    siteName: 'સાઈટ ૧ - પ્લોટ ૪',
    notes: 'ઉપાડ ₹200 લીધો'
  },
  {
    id: 'e3',
    workerId: 'w1',
    malikId: 'm1',
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
    malikId: 'm2',
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
    malikId: 'm2',
    date: getPastDate(1),
    workType: 'DAILY',
    status: 'HALF',
    rate: 500,
    earnedAmount: 250,
    advanceAmount: 0,
    taskDesc: 'અડધો દિવસ રોજી',
    siteName: 'વર્કશોપ',
    notes: ''
  },
  {
    id: 'e6',
    workerId: 'w2',
    malikId: 'm1',
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
    malikId: 'm2',
    date: getPastDate(1),
    workType: 'CUSTOM',
    status: 'FULL',
    rate: 0,
    earnedAmount: 900,
    advanceAmount: 0,
    taskDesc: '૪ બેગ સિમેન્ટ ભરવાનું અને મિક્સિંગ',
    siteName: 'રાહુલભાઈ વર્કશોપ',
    notes: 'કામ મુજબ'
  }
];

const INITIAL_SETTINGS = {
  ownerName: 'પરેશભાઈ પટેલ',
  ownerPhone: '9876543210',
  businessName: 'પટેલ ફાર્મ & કન્સ્ટ્રક્શન',
  activeWorkerId: 'w1',
  defaultMalikId: 'm1'
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
    createdAt: toLocalDateStr(new Date())
  };
  workers.push(newWorker);
  saveWorkers(workers);
  return newWorker;
}

export function updateWorker(id, updatedFields) {
  const workers = getWorkers();
  const idx = workers.findIndex((w) => w.id === id);
  if (idx !== -1) {
    workers[idx] = { ...workers[idx], ...updatedFields };
    saveWorkers(workers);
    return workers[idx];
  }
  return null;
}

export function deleteWorker(id) {
  const workers = getWorkers().filter((w) => w.id !== id);
  saveWorkers(workers);
  const entries = getEntries().filter((e) => e.workerId !== id);
  saveEntries(entries);
}

// Maliks (Owners) CRUD
export function getMaliks() {
  try {
    const raw = localStorage.getItem(MALIKS_KEY);
    if (!raw) {
      // Migrate existing single-owner settings into first Malik if user customized settings
      const settingsRaw = localStorage.getItem(SETTINGS_KEY);
      if (settingsRaw) {
        const s = JSON.parse(settingsRaw);
        const migrated = [
          {
            id: 'm1',
            name: s.ownerName || INITIAL_MALIKS[0].name,
            phone: s.ownerPhone || INITIAL_MALIKS[0].phone,
            businessName: s.businessName || INITIAL_MALIKS[0].businessName,
            createdAt: toLocalDateStr(new Date())
          }
        ];
        localStorage.setItem(MALIKS_KEY, JSON.stringify(migrated));
        return migrated;
      }
      localStorage.setItem(MALIKS_KEY, JSON.stringify(INITIAL_MALIKS));
      return INITIAL_MALIKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading maliks:', e);
    return INITIAL_MALIKS;
  }
}

export function saveMaliks(maliks) {
  try {
    localStorage.setItem(MALIKS_KEY, JSON.stringify(maliks));
  } catch (e) {
    console.error('Error saving maliks:', e);
  }
}

export function addMalik(malikData) {
  const maliks = getMaliks();
  const newMalik = {
    id: 'm_' + Date.now(),
    name: malikData.name.trim(),
    phone: malikData.phone ? malikData.phone.trim() : '',
    businessName: malikData.businessName ? malikData.businessName.trim() : '',
    createdAt: toLocalDateStr(new Date())
  };
  maliks.push(newMalik);
  saveMaliks(maliks);
  return newMalik;
}

export function updateMalik(id, updatedFields) {
  const maliks = getMaliks();
  const idx = maliks.findIndex((m) => m.id === id);
  if (idx !== -1) {
    maliks[idx] = { ...maliks[idx], ...updatedFields };
    saveMaliks(maliks);
    return maliks[idx];
  }
  return null;
}

export function deleteMalik(id) {
  const maliks = getMaliks().filter((m) => m.id !== id);
  saveMaliks(maliks);
}

// Entries CRUD
export function getEntries() {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(INITIAL_ENTRIES));
      return INITIAL_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    // Ensure older entries without malikId gracefully default to 'm1' if m1 exists
    return parsed.map((e) => (e.malikId ? e : { ...e, malikId: 'm1' }));
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
    malikId: entryData.malikId || '',
    date: entryData.date || toLocalDateStr(new Date()),
    workType: entryData.workType || 'DAILY',
    status: entryData.status || 'FULL',
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
  const idx = entries.findIndex((e) => e.id === id);
  if (idx !== -1) {
    entries[idx] = { ...entries[idx], ...updatedFields };
    saveEntries(entries);
    return entries[idx];
  }
  return null;
}

export function deleteEntry(id) {
  const entries = getEntries().filter((e) => e.id !== id);
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

// Full Export / Import
export function exportAllData() {
  return JSON.stringify(
    {
      version: '1.1',
      exportedAt: new Date().toISOString(),
      workers: getWorkers(),
      maliks: getMaliks(),
      entries: getEntries(),
      settings: getSettings()
    },
    null,
    2
  );
}

export function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.workers && Array.isArray(data.workers)) {
      saveWorkers(data.workers);
    }
    if (data.maliks && Array.isArray(data.maliks)) {
      saveMaliks(data.maliks);
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
  localStorage.setItem(MALIKS_KEY, JSON.stringify(INITIAL_MALIKS));
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(INITIAL_ENTRIES));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
}
