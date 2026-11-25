import React from 'react';
import { formatCurrency, formatDate, getWorkBadge } from '../utils/calculator';

export function PrintStatement({
  worker,
  settings,
  startDate,
  endDate,
  summary
}) {
  const currentDate = new Date().toLocaleDateString('en-GB');

  return (
    <div className="printable-statement" id="printable-statement">
      {/* Printable Header */}
      <div className="print-header-box">
        <div style={{ fontSize: '12pt', color: '#475569', fontWeight: 'bold' }}>
          {settings?.businessName || 'મજૂરી હિસાબ ખાતાવહી'}
        </div>
        <div className="print-title">મજૂરી હિસાબ પત્રક</div>
        <div style={{ fontSize: '10pt', color: '#64748b' }}>
          તારીખ: {formatDate(startDate)} થી {formatDate(endDate)}
        </div>
      </div>

      {/* Meta Information Box */}
      <div className="print-meta-grid">
        <div>
          <div><strong>મજૂરનું નામ:</strong> {worker ? worker.name : 'સર્વ મજૂરો'}</div>
          {worker?.phone && <div><strong>મોબાઈલ:</strong> {worker.phone}</div>}
          {worker?.role && <div><strong>કામનો પ્રકાર:</strong> {worker.role}</div>}
          {worker?.dailyRate > 0 && <div><strong>રોજી દર:</strong> {formatCurrency(worker.dailyRate)} / દિવસ</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><strong>માલિક / ફર્મ:</strong> {settings?.ownerName || 'પરેશભાઈ'}</div>
          {settings?.ownerPhone && <div><strong>સંપર્ક:</strong> {settings.ownerPhone}</div>}
          <div><strong>હિસાબ તા.:</strong> {currentDate}</div>
        </div>
      </div>

      {/* Detailed Entries Table */}
      <div className="print-table-scroll">
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: '36px' }} className="text-center">ક્રમ</th>
              <th style={{ width: '92px' }}>તારીખ</th>
              <th>કામની વિગત / હાજરી</th>
              <th style={{ width: '85px' }} className="text-right">મજૂરી (₹)</th>
              <th style={{ width: '80px' }} className="text-right">ઉપાડ (₹)</th>
              <th style={{ width: '90px' }} className="text-right">ચોખ્ખી રકમ</th>
            </tr>
          </thead>
          <tbody>
            {summary.entries && summary.entries.length > 0 ? (
              summary.entries.map((item, index) => {
                const badge = getWorkBadge(item);
                return (
                  <tr key={item.id || index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>
                      <strong>{badge.label}</strong>
                      {item.taskDesc && (
                        <div style={{ fontSize: '10pt', color: '#334155' }}>
                          {item.taskDesc}
                        </div>
                      )}
                      {item.siteName && (
                        <div style={{ fontSize: '9pt', color: '#64748b' }}>
                          સાઈટ: {item.siteName}
                        </div>
                      )}
                    </td>
                    <td className="text-right" style={{ color: '#15803d', fontWeight: '600' }}>
                      {formatCurrency(item.earned)}
                    </td>
                    <td className="text-right" style={{ color: item.advance > 0 ? '#b91c1c' : '#64748b' }}>
                      {item.advance > 0 ? formatCurrency(item.advance) : '-'}
                    </td>
                    <td className="text-right" style={{ fontWeight: 'bold' }}>
                      {formatCurrency(item.net)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center" style={{ padding: '20px', color: '#64748b' }}>
                  આ સમયગાળામાં કોઈ એન્ટ્રી મળેલ નથી.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Box */}
      <div className="print-summary-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '10pt', color: '#475569' }}>
              કુલ કામ/એન્ટ્રી: <strong>{summary.count}</strong> |
              પૂરા દિવસ: <strong>{summary.fullDays}</strong> |
              અડધા દિવસ: <strong>{summary.halfDays}</strong> |
              કામ મુજબ: <strong>{summary.customTasksCount}</strong>
            </div>
            <div style={{ fontSize: '11pt', marginTop: '4px' }}>
              કુલ મજૂરી: <strong>{formatCurrency(summary.totalEarned)}</strong> |
              કુલ ઉપાડ: <strong style={{ color: '#b91c1c' }}>{formatCurrency(summary.totalAdvance)}</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10pt', color: '#475569' }}>ચૂકવવાપાત્ર ચોખ્ખી બાકી રકમ:</div>
            <div style={{ fontSize: '16pt', fontWeight: 'bold', color: '#145339' }}>
              {formatCurrency(summary.netPayable)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
