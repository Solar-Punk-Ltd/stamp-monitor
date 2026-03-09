import * as fs from 'fs';
import * as path from 'path';

import { checkStamp, ProjectReport, StampFile, StampStatus } from './batch';
import { getCurrentTotalOutPayment, getLastPrice } from './contract';
import { sendReport } from './email';
import { delay, logReport } from './utils';

// Delay between RPC calls to avoid rate limiting on public endpoints
const requestDelayMs = Number(process.env.REQUEST_DELAY_MS) || 0;

function loadStampFiles(stampsDir: string): StampFile[] {
  if (!fs.existsSync(stampsDir)) {
    console.error(`Error: Stamps directory not found at ${stampsDir}`);
    process.exit(1);
  }

  const jsonFiles = fs
    .readdirSync(stampsDir)
    .filter(f => f.endsWith('.json') && !f.startsWith('example'))
    .sort();

  if (jsonFiles.length === 0) {
    console.error('Error: No JSON files found in stamps directory.');
    process.exit(1);
  }

  const stampFiles: StampFile[] = [];
  for (const file of jsonFiles) {
    const filePath = path.join(stampsDir, file);
    try {
      stampFiles.push(JSON.parse(fs.readFileSync(filePath, 'utf8')));
    } catch (error) {
      console.error(`Failed to parse ${file}:`, error);
    }
  }

  return stampFiles;
}

async function processProject(
  stampFile: StampFile,
  currentTotalOutPayment: bigint,
  lastPrice: bigint,
): Promise<ProjectReport> {
  const stamps: StampStatus[] = [];
  for (const stamp of stampFile.stamps) {
    stamps.push(await checkStamp(stamp, currentTotalOutPayment, lastPrice));
    if (requestDelayMs > 0) {
      await delay(requestDelayMs);
    }
  }

  return { project: stampFile.project, stamps };
}

async function fetchContractState(): Promise<{ currentTotalOutPayment: bigint; lastPrice: bigint }> {
  console.log('Fetching current contract state...');
  try {
    const currentTotalOutPayment = await getCurrentTotalOutPayment();
    const lastPrice = await getLastPrice();
    console.log(`Current Total Out Payment: ${currentTotalOutPayment}`);
    console.log(`Last Price: ${lastPrice}\n`);
    return { currentTotalOutPayment, lastPrice };
  } catch (error) {
    console.error('Failed to fetch contract state. Is the RPC endpoint reachable?', error);
    process.exit(1);
  }
}

async function main() {
  const stampsDir = path.join(process.cwd(), 'stamps');
  const stampFiles = loadStampFiles(stampsDir);
  const { currentTotalOutPayment, lastPrice } = await fetchContractState();

  for (const stampFile of stampFiles) {
    const report = await processProject(stampFile, currentTotalOutPayment, lastPrice);
    logReport(report);
    await sendReport(report, stampFile.maintainerAddress, stampFile.subject);
  }
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
