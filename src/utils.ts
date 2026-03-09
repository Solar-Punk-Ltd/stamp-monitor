import { ProjectReport, StampStatus } from './batch';

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatExpiry(stamp: StampStatus): string {
  if (stamp.error) return `ERROR: ${stamp.error}`;
  if (!stamp.isValid) return 'N/A (Invalid Owner)';
  if (!stamp.expiryDate) return 'Expired';
  return stamp.expiryDate.toISOString();
}

export function logReport(report: ProjectReport): void {
  console.log(`=== ${report.project} ===`);
  for (const stamp of report.stamps) {
    console.log(
      `  ${stamp.name} | ${stamp.description} | ${stamp.batchId} | valid: ${stamp.isValid} | expiry: ${formatExpiry(
        stamp,
      )} | immutable: ${stamp.immutable}`,
    );
  }
}
