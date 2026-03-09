import { Resend } from 'resend';

import { ProjectReport } from './batch';
import { formatExpiry } from './utils';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromAddress = process.env.RESEND_FROM_ADDRESS || 'Stamp Monitor <onboarding@resend.dev>';

function buildHtml(report: ProjectReport): string {
  const timestamp = new Date().toISOString();
  const rows = report.stamps
    .map(stamp => {
      const expiry = formatExpiry(stamp);
      const statusColor = stamp.error ? '#e74c3c' : stamp.isValid ? '#27ae60' : '#e67e22';
      const statusLabel = stamp.error ? 'ERROR' : stamp.isValid ? 'VALID' : 'INVALID';

      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${stamp.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${stamp.description}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace; font-size: 12px;">${
            stamp.batchId
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><span style="color: ${statusColor}; font-weight: bold;">${statusLabel}</span></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${expiry}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${stamp.immutable ? 'Yes' : 'No'}</td>
        </tr>`;
    })
    .join('');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2c3e50;">${report.project}</h1>
      <p style="color: #7f8c8d;">Generated at ${timestamp}</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 8px; text-align: left;">Name</th>
            <th style="padding: 8px; text-align: left;">Description</th>
            <th style="padding: 8px; text-align: left;">Batch ID</th>
            <th style="padding: 8px; text-align: left;">Status</th>
            <th style="padding: 8px; text-align: left;">Expiry</th>
            <th style="padding: 8px; text-align: left;">Immutable</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

export async function sendReport(report: ProjectReport, to: string, subject: string): Promise<void> {
  const html = buildHtml(report);

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`Failed to send email for ${report.project}:`, error);
      return;
    }

    console.log(`Report email sent to ${to} for ${report.project}`);
  } catch (error) {
    console.error(`Failed to send email for ${report.project}:`, error);
  }
}
