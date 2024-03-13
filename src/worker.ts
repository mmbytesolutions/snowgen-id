// Export individual components for modular use

import {
  type WorkerOptions,
  defaultOptions,
  maxDatacenterId,
  maxWorkerId,
  sequenceMask,
  type CreateWorker,
} from "./config";
import { parseId } from "./parser";

/**
 * Creates a new worker that can generate unique IDs with the specified options.
 * Validates the provided worker and datacenter IDs against the configuration constraints.
 * @param workerId - The unique ID of the worker node.
 * @param datacenterId - The unique ID of the data center.
 * @param options - Configuration options for the ID generation.
 * @returns An object containing functions to generate IDs, get current sequence, last timestamp, and parse IDs.
 */
export const createWorker = (
  workerId: bigint,
  datacenterId: bigint,
  options: WorkerOptions = defaultOptions
): CreateWorker => {
  const {
    epoch = 1609459200000n,
    workerIdBits = 5,
    datacenterIdBits = 5,
    sequenceBits = 12,
  } = options;

  const workerIdMax = maxWorkerId(workerIdBits);
  const datacenterIdMax = maxDatacenterId(datacenterIdBits);
  const sequenceMaskValue = sequenceMask(sequenceBits);

  if (workerId < 0 || workerId > workerIdMax) {
    throw new Error(
      `Invalid worker ID: ${workerId}. Must be between 0 and ${workerIdMax}.`
    );
  }

  if (datacenterId < 0 || datacenterId > datacenterIdMax) {
    throw new Error(
      `Invalid datacenter ID: ${datacenterId}. Must be between 0 and ${datacenterIdMax}.`
    );
  }

  const workerIdShift = BigInt(sequenceBits);
  const datacenterIdShift = BigInt(sequenceBits + workerIdBits);
  const timestampLeftShift = BigInt(
    sequenceBits + workerIdBits + datacenterIdBits
  );

  let lastTimestamp: bigint = -1n;
  let sequence: bigint = 0n;

  const tilNextMillis = (currentTimestamp: bigint): bigint => {
    let timestamp = now();
    while (timestamp <= currentTimestamp) {
      timestamp = now();
    }
    return timestamp;
  };

  const now = (): bigint => BigInt(Date.now());

  const nextId = (): bigint => {
    let timestamp = now();

    if (timestamp < lastTimestamp) {
      throw new Error(
        `Clock moved backwards. Refusing to generate ID for ${
          lastTimestamp - timestamp
        }ms.`
      );
    }

    if (timestamp === lastTimestamp) {
      sequence = (sequence + 1n) & sequenceMaskValue;
      if (sequence === 0n) {
        timestamp = tilNextMillis(lastTimestamp);
      }
    } else {
      sequence = 0n;
    }

    lastTimestamp = timestamp;

    return (
      ((timestamp - epoch) << timestampLeftShift) |
      (datacenterId << datacenterIdShift) |
      (workerId << workerIdShift) |
      sequence
    );
  };

  return {
    nextId,
    getCurrentSequence: () => sequence,
    getLastTimestamp: () => lastTimestamp,
    parse: (id: bigint) => parseId(id, options),
    workerId,
    datacenterId,
  };
};
