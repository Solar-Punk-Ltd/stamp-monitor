import { getBatchDataFromContract } from './contract';

const GNOSIS_BLOCK_TIME_SECONDS = 5;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export type Stamp = {
  name: string;
  description: string;
  batchId: string;
};

export type StampFile = {
  project: string;
  stamps: Stamp[];
};

export type StampContractData = {
  owner: string;
  depth: bigint;
  bucketDepth: bigint;
  immutableFlag: boolean;
  normalisedBalance: bigint;
  lastUpdatedBlockNumber: bigint;
};

export type StampStatus = {
  name: string;
  description: string;
  batchId: string;
  isValid: boolean;
  immutable: boolean;
  expiryDate: Date | null;
  error?: string;
};

export type ProjectReport = {
  project: string;
  stamps: StampStatus[];
};

/**
 * Calculates the expiry date of a stamp based on its remaining balance and the current price.
 *
 * @returns The expiry date, or null if the stamp is already expired.
 */
function calculateExpiryDate(stamp: StampContractData, currentTotalOutPayment: bigint, lastPrice: bigint): Date | null {
  const remainingBalance = stamp.normalisedBalance - currentTotalOutPayment;

  if (remainingBalance <= 0n) {
    return null;
  }

  if (lastPrice === 0n) {
    return null;
  }

  const remainingBlocks = remainingBalance / lastPrice;
  const remainingSeconds = Number(remainingBlocks) * GNOSIS_BLOCK_TIME_SECONDS;

  return new Date(Date.now() + remainingSeconds * 1000);
}

/**
 * Fetches on-chain data for a postage stamp and returns its status.
 */
export async function checkStamp(
  input: Stamp,
  currentTotalOutPayment: bigint,
  lastPrice: bigint,
): Promise<StampStatus> {
  const batchId = input.batchId.startsWith('0x') ? input.batchId : '0x' + input.batchId;

  try {
    const contractData = await getBatchDataFromContract(batchId);

    if (!contractData) {
      return {
        name: input.name,
        description: input.description,
        batchId,
        isValid: false,
        immutable: false,
        expiryDate: null,
        error: 'Failed to fetch batch data from contract',
      };
    }

    const { owner, immutableFlag } = contractData;
    const isValid = owner !== ZERO_ADDRESS;
    const expiryDate = isValid ? calculateExpiryDate(contractData, currentTotalOutPayment, lastPrice) : null;

    return {
      name: input.name,
      description: input.description,
      batchId,
      isValid,
      immutable: immutableFlag,
      expiryDate,
    };
  } catch (error) {
    console.error(`Error checking stamp ${input.name} (${batchId}):`, error);
    return {
      name: input.name,
      description: input.description,
      batchId,
      isValid: false,
      immutable: false,
      expiryDate: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
