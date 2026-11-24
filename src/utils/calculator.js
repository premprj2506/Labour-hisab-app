// Calculation engine for Labour Hisab

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
      label: 'કામ મુજબ (ઉચક)',
      badgeClass: 'badge-custom',
      desc: entry.taskDesc || 'કસ્ટમ કામ'
    };
  }

  if (entry.status === 'FULL') {
    return {
      label: 'પૂરી હાજરી (૧ દિવસ)',
      badgeClass: 'badge-full',
      desc: 'આખો દિવસ રોજી'
    };
  } else if (entry.status === 'HALF') {
    return {
      label: 'અડધી હાજરી (૦.૫)',
      badgeClass: 'badge-half',
      desc: 'અડધો દિવસ રોજી'
    };
  } else {
    return {
      label: 'ગેરહાજર (રજા)',
      badgeClass: 'badge-absent',
      desc: 'રજા'
    };
  }
}

// Date Range Presets helper
export function getDateRangePreset(preset) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  const formatDateStr = (d) => d.toISOString().split('T')[0];

  if (preset === 'THIS_MONTH') {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
      start: formatDateStr(start),
      end: formatDateStr(end),
      label: 'આ મહિનો'
    };
  }

  if (preset === 'LAST_MONTH') {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return {
      start: formatDateStr(start),
      end: formatDateStr(end),
      label: 'ગયેલ મહિનો'
    };
  }

  if (preset === 'LAST_15_DAYS') {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 14);
    return {
      start: formatDateStr(start),
      end: formatDateStr(end),
      label: 'છેલ્લા ૧૫ દિવસ'
    };
  }

  if (preset === 'LAST_7_DAYS') {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return {
      start: formatDateStr(start),
      end: formatDateStr(end),
      label: 'છેલ્લા ૭ દિવસ'
    };
  }

  // Default: current month
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    start: formatDateStr(start),
    end: formatDateStr(end),
    label: 'આ મહિનો'
  };
}
