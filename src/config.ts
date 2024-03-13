/**
 * Options for configuring the worker.
 */
export interface WorkerOptions {
  /** The epoch timestamp in milliseconds. Defaults to 1609459200000 (January 1, 2021). */
  epoch?: bigint;
  /** The number of bits allocated for the worker ID. Defaults to 5. */
  workerIdBits?: number;
  /** The number of bits allocated for the datacenter ID. Defaults to 5. */
  datacenterIdBits?: number;
  /** The number of bits allocated for the sequence number. Defaults to 12. */
  sequenceBits?: number;
}

/**
 * Represents the parsed components of a snowflake ID.
 */
export interface Parsedbigint {
  /** The timestamp component of the ID. */
  timestamp: bigint;
  /** The worker ID component of the ID. */
  workerId: bigint;
  /** The datacenter ID component of the ID. */
  datacenterId: bigint;
  /** The sequence number component of the ID. */
  sequence: bigint;
}

/**
 * Default options for the worker.
 */
export const defaultOptions: WorkerOptions = {
  epoch: 1609459200000n,
  workerIdBits: 5,
  datacenterIdBits: 5,
  sequenceBits: 12,
};

/**
 * Represents a worker instance.
 */
export interface CreateWorker {
  /** Generates the next unique ID. */
  nextId: () => bigint;
  /** Gets the current sequence number. */
  getCurrentSequence: () => bigint;
  /** Gets the last timestamp used for ID generation. */
  getLastTimestamp: () => bigint;
  /** Parses a snowflake ID into its components. */
  parse: (id: bigint) => Parsedbigint;
  /** The worker ID of the worker instance. */
  workerId: bigint;
  /** The datacenter ID of the worker instance. */
  datacenterId: bigint;
}

/**
 * Calculates the maximum worker ID based on the number of bits allocated.
 * @param workerIdBits The number of bits allocated for the worker ID.
 * @returns The maximum worker ID.
 */
export const maxWorkerId = (workerIdBits: number): bigint =>
  -1n ^ (-1n << BigInt(workerIdBits));

/**
 * Calculates the maximum datacenter ID based on the number of bits allocated.
 * @param datacenterIdBits The number of bits allocated for the datacenter ID.
 * @returns The maximum datacenter ID.
 */
export const maxDatacenterId = (datacenterIdBits: number): bigint =>
  -1n ^ (-1n << BigInt(datacenterIdBits));

/**
 * Calculates the bit mask for the sequence number based on the number of bits allocated.
 * @param sequenceBits The number of bits allocated for the sequence number.
 * @returns The bit mask for the sequence number.
 */
export const sequenceMask = (sequenceBits: number): bigint =>
  -1n ^ (-1n << BigInt(sequenceBits));
