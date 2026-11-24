// WhatsApp and Native Share helper for Labour Hisab
import { formatCurrency, formatDate } from './calculator';

export function buildWhatsAppMessage({ worker, settings, startDate, endDate, summary }) {
  const workerName = worker ? worker.name : 'બધા મજૂરો';
  const ownerName = settings?.ownerName || 'માલિક';
  const siteName = settings?.businessName || 'સાઈટ / વાડી';

  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);

  let msg = `🙏 *જય શ્રી કૃષ્ણ / નમસ્તે*\n`;
  msg += `📋 *મજૂરી હિસાબ પત્રક*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━\n`;
  msg += `👤 *મજૂર:* ${workerName}\n`;
  if (worker?.phone) msg += `📱 *ફોન:* ${worker.phone}\n`;
  msg += `📍 *કામ/સાઈટ:* ${siteName}\n`;
  msg += `🗓 *સમયગાળો:* ${startFormatted} થી ${endFormatted}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📊 *હિસાબ સમરી:*\n`;
  msg += `• કુલ દિવસો/કામ: *${summary.count} એન્ટ્રી*\n`;
  if (summary.fullDays > 0) msg += `  - પૂરી રોજી (દિવસ): ${summary.fullDays}\n`;
  if (summary.halfDays > 0) msg += `  - અડધી રોજી: ${summary.halfDays}\n`;
  if (summary.customTasksCount > 0) msg += `  - ઉચક / કામ મુજબ: ${summary.customTasksCount}\n`;
  msg += `💰 *કુલ મજૂરી:* ${formatCurrency(summary.totalEarned)}\n`;
  msg += `🔻 *કુલ ઉપાડ (એડવાન્સ):* ${formatCurrency(summary.totalAdvance)}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💵 *ચોખ્ખી બાકી રકમ: ${formatCurrency(summary.netPayable)}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━\n\n`;

  // Brief breakdown of recent entries
  if (summary.entries && summary.entries.length > 0) {
    msg += `📝 *દૈનિક વિગત:*\n`;
    summary.entries.slice(0, 10).forEach((item) => {
      const d = formatDate(item.date);
      let workDesc = item.workType === 'CUSTOM' ? (item.taskDesc || 'ઉચક કામ') : (item.status === 'HALF' ? 'અડધો દિવસ' : 'પૂરો દિવસ');
      let line = `• ${d}: ${workDesc} (${formatCurrency(item.earned)})`;
      if (item.advance > 0) {
        line += ` [ઉપાડ: ${formatCurrency(item.advance)}]`;
      }
      msg += line + `\n`;
    });
    if (summary.entries.length > 10) {
      msg += `... અને બીજી ${summary.entries.length - 10} એન્ટ્રીઓ.\n`;
    }
  }

  msg += `\n📄 સંપૂર્ણ વિગતવાર PDF સ્લિપ સાથે જોડેલ છે.\n`;
  msg += `કૃપા કરીને હિસાબ ચકાસી લેશો. આભાર!`;

  return msg;
}

export function openWhatsAppChat(phone, messageText) {
  let cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  
  // If 10 digits, add India country code 91
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const encoded = encodeURIComponent(messageText);

  let url = '';
  if (cleanPhone) {
    url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
  } else {
    // Open WhatsApp selector if no phone is provided
    url = `https://api.whatsapp.com/send?text=${encoded}`;
  }

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
