import {
  type WorkerOptions,
  defaultOptions,
  type Parsedbigint,
  maxWorkerId,
  maxDatacenterId,
  sequenceMask,
} from ".";

/**
 * Parses a given bigint ID into its components based on the provided options.
 * @param id - The bigint ID to parse.
 * @param options - Configuration options for the ID generation.
 * @returns An object representing the parsed ID components.
 */
export const parseId = (
  id: bigint,
  options: WorkerOptions = defaultOptions
): Parsedbigint => {
  const {
    epoch = 1609459200000n,
    workerIdBits = 5,
    datacenterIdBits = 5,
    sequenceBits = 12,
  } = options;

  const workerIdShift = BigInt(sequenceBits);
  const datacenterIdShift = BigInt(sequenceBits + workerIdBits);
  const timestampLeftShift = BigInt(
    sequenceBits + workerIdBits + datacenterIdBits
  );

  const timestamp = (id >> timestampLeftShift) + epoch;
  const workerId = (id >> workerIdShift) & maxWorkerId(workerIdBits);
  const datacenterId =
    (id >> datacenterIdShift) & maxDatacenterId(datacenterIdBits);
  const sequence = id & sequenceMask(sequenceBits);

  return {
    timestamp,
    workerId,
    datacenterId,
    sequence,
  };
};
