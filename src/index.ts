export * from "./worker";
export * from "./parser";

export interface WorkerOptions {
  epoch?: bigint;
  workerIdBits?: number;
  datacenterIdBits?: number;
  sequenceBits?: number;
}

export interface Parsedbigint {
  timestamp: bigint;
  workerId: bigint;
  datacenterId: bigint;
  sequence: bigint;
}

export const defaultOptions: WorkerOptions = {
  epoch: 1609459200000n,
  workerIdBits: 5,
  datacenterIdBits: 5,
  sequenceBits: 12,
};

/* Bit mask for the sequence number */
export const maxWorkerId = (workerIdBits: number) =>
  -1n ^ (-1n << BigInt(workerIdBits));

/* Bit mask for the datacenter ID */
export const maxDatacenterId = (datacenterIdBits: number) =>
  -1n ^ (-1n << BigInt(datacenterIdBits));

/* Bit mask for the sequence number */
export const sequenceMask = (sequenceBits: number) =>
  -1n ^ (-1n << BigInt(sequenceBits));
