// WhatsApp and Native Share helper for Labour Hisab
import { formatCurrency, formatDate } from './calculator';

function formatShortDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateString;
}

export function buildWhatsAppMessage({ worker, startDate, endDate, summary }) {
  const workerName = worker ? worker.name : 'બધા મજૂરો';
  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);

  let msg = `*મજૂરી હિસાબ*\n`;
  msg += `👤 ${workerName}\n`;
  msg += `📅 ${startFormatted} થી ${endFormatted}\n`;

  if (summary.entries && summary.entries.length > 0) {
    msg += `\n`;
    summary.entries.slice(0, 15).forEach((item) => {
      const d = formatShortDate(item.date);
      const workDesc =
        item.workType === 'CUSTOM'
          ? item.taskDesc || 'કામ મુજબ'
          : item.status === 'HALF'
          ? 'અડધો દિવસ'
          : item.status === 'ABSENT'
          ? 'રજા'
          : 'પૂરો દિવસ';

      let line = `• ${d}: ${workDesc} (${formatCurrency(item.earned)})`;
      if (item.advance > 0) {
        line += ` [ઉપાડ: ${formatCurrency(item.advance)}]`;
      }
      msg += line + `\n`;
    });

    if (summary.entries.length > 15) {
      msg += `... અને બીજી ${summary.entries.length - 15} એન્ટ્રી\n`;
    }
  }

  msg += `\n`;
  if (summary.totalAdvance > 0) {
    msg += `કુલ મજૂરી: ${formatCurrency(summary.totalEarned)}\n`;
    msg += `કુલ ઉપાડ: ${formatCurrency(summary.totalAdvance)}\n`;
  }
  msg += `*કુલ બાકી રકમ: ${formatCurrency(summary.netPayable)}*`;

  return msg;
}

export function openWhatsAppChat(phone, messageText) {
  let cleanPhone = (phone || '').replace(/[^0-9]/g, '');

  // If 10 digits, add India country code 91
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const encoded = encodeURIComponent(messageText);

  const url = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`;

  window.open(url, '_blank');
}

// Native Web Share API (Works on Android / iPhone Chrome/Safari)
export async function shareViaMobile(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text
      });
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
      }
      return false;
    }
  }
  return false;
}
