// Calculation engine for Labour Hisab

export function toLocalDateStr(date) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLocalTodayStr() {
  return toLocalDateStr(new Date());
}

export function getLocalYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toLocalDateStr(d);
}

const GUJARATI_MONTHS_SHORT = {
  '01': 'જાન્યુ',
  '02': 'ફેબ્રુ',
  '03': 'માર્ચ',
  '04': 'એપ્રિલ',
  '05': 'મે',
  '06': 'જૂન',
  '07': 'જુલાઈ',
  '08': 'ઓગ',
  '09': 'સપ્ટે',
  '10': 'ઓક્ટો',
  '11': 'નવે',
  '12': 'ડિસે'
};

const GUJARATI_WEEKDAYS_SHORT = ['રવિ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ'];

export function getGujaratiMonthShort(monthStr) {
  return GUJARATI_MONTHS_SHORT[monthStr] || monthStr;
}

export function getGujaratiWeekdayShort(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return '';
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return GUJARATI_WEEKDAYS_SHORT[d.getDay()] || '';
}

export function calculateStatement(entries, workerId, startDate, endDate) {
  // Filter by worker (or all if workerId === 'ALL')
  let filtered = entries.filter(e => {
    if (workerId && workerId !== 'ALL' && e.workerId !== workerId) {
      return false;
    }
    if (startDate && e.date < startDate) return false;
    if (endDate && e.date > endDate) return false;
    return true;
  });

  // Sort by date ascending
  filtered.sort((a, b) => (a.date > b.date ? 1 : -1));

  let totalEarned = 0;
  let totalAdvance = 0;
  let fullDays = 0;
  let halfDays = 0;
  let absentDays = 0;
  let customTasksCount = 0;

  let runningBalance = 0;
  const enrichedEntries = filtered.map(item => {
    const earned = Number(item.earnedAmount) || 0;
    const advance = Number(item.advanceAmount) || 0;
    const net = earned - advance;

    totalEarned += earned;
    totalAdvance += advance;
    runningBalance += net;

    if (item.workType === 'CUSTOM') {
      customTasksCount++;
    } else {
      if (item.status === 'FULL') fullDays++;
      else if (item.status === 'HALF') halfDays++;
      else if (item.status === 'ABSENT') absentDays++;
    }

    return {
      ...item,
      earned,
      advance,
      net,
      runningBalance
    };
  });

  const netPayable = totalEarned - totalAdvance;
  const totalWorkUnits = fullDays + (halfDays * 0.5) + customTasksCount;

  return {
    entries: enrichedEntries,
    count: enrichedEntries.length,
    fullDays,
    halfDays,
    absentDays,
    customTasksCount,
    totalWorkUnits,
    totalEarned,
    totalAdvance,
    netPayable
  };
}

// Currency formatting
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN');
}

// Format date to DD/MM/YYYY
export function formatDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

// Get Gujarati text label for work entry
export function getWorkBadge(entry) {
  if (entry.workType === 'CUSTOM') {
    return {
      label: 'કામ મુજબ',
      badgeClass: 'badge-custom',
      type: 'CUSTOM',
      desc: entry.taskDesc || 'કસ્ટમ કામ'
    };
  }

  if (entry.status === 'FULL') {
    return {
      label: 'પૂરી હાજરી',
      badgeClass: 'badge-full',
      type: 'FULL',
      desc: 'આખો દિવસ રોજી'
    };
  } else if (entry.status === 'HALF') {
    return {
      label: 'અડધી હાજરી',
      badgeClass: 'badge-half',
      type: 'HALF',
      desc: 'અડધો દિવસ રોજી'
    };
  } else {
    return {
      label: 'રજા',
      badgeClass: 'badge-absent',
      type: 'ABSENT',
      desc: 'ગેરહાજર'
    };
  }
}

// Date Range Presets helper (using local calendar dates)
export function getDateRangePreset(preset) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (preset === 'THIS_MONTH') {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
      start: toLocalDateStr(start),
      end: toLocalDateStr(end),
      label: 'આ મહિનો'
    };
  }

  if (preset === 'LAST_MONTH') {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return {
      start: toLocalDateStr(start),
      end: toLocalDateStr(end),
      label: 'ગયો મહિનો'
    };
  }

  if (preset === 'LAST_15_DAYS') {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 14);
    return {
      start: toLocalDateStr(start),
      end: toLocalDateStr(end),
      label: 'છેલ્લા ૧૫ દિવસ'
    };
  }

  if (preset === 'LAST_7_DAYS') {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return {
      start: toLocalDateStr(start),
      end: toLocalDateStr(end),
      label: 'છેલ્લા ૭ દિવસ'
    };
  }

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    start: toLocalDateStr(start),
    end: toLocalDateStr(end),
    label: 'આ મહિનો'
  };
}
