import { Web3 } from 'web3';

import 'dotenv/config';

import PostageStampContract from './abis/PostageStampContract.json';
import { StampContractData } from './batch';

const rpcUrl = process.env.GNOSIS_RPC_URL || 'https://rpc.gnosischain.com/';
const web3 = new Web3(rpcUrl);
const postageStampAbi = PostageStampContract.abi;
const postageStampContractAddress = PostageStampContract.address;
const contract = new web3.eth.Contract(postageStampAbi, postageStampContractAddress);

export async function getCurrentTotalOutPayment(): Promise<bigint> {
  return BigInt(await contract.methods.currentTotalOutPayment().call());
}

export async function getLastPrice(): Promise<bigint> {
  return BigInt(await contract.methods.lastPrice().call());
}

export async function getBatchDataFromContract(batchId: string): Promise<StampContractData | undefined> {
  try {
    const rawBatchData = (await contract.methods.batches(batchId).call()) as StampContractData;
    if (rawBatchData && typeof rawBatchData === 'object' && 'owner' in rawBatchData) {
      return {
        owner: String(rawBatchData.owner),
        depth: BigInt(rawBatchData.depth),
        bucketDepth: BigInt(rawBatchData.bucketDepth),
        immutableFlag: Boolean(rawBatchData.immutableFlag),
        normalisedBalance: BigInt(rawBatchData.normalisedBalance),
        lastUpdatedBlockNumber: BigInt(rawBatchData.lastUpdatedBlockNumber),
      };
    }
    console.warn(`Warning: Batch data for ${batchId} is in unexpected format or missing owner.`);
  } catch (error) {
    console.error(`Error fetching batch data for ${batchId}:`, error);
  }
}
