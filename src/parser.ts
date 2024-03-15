import {
  type WorkerOptions,
  defaultOptions,
  type Parsedbigint,
  maxWorkerId,
  maxDatacenterId,
  sequenceMask,
} from "./config";

/**
 * Parses a snowflake ID into its components.
 * @param id The snowflake ID to parse.
 * @param options Optional configuration options for parsing.
 * @returns The parsed components of the snowflake ID with a toStr method.
 */
export const parseId = (
  id: bigint,
  options: WorkerOptions = defaultOptions
): Parsedbigint & {
  /**
   * Converts the parsed bigint components to strings.
   * @returns The parsed components as strings.
   */
  toStr: () => {
    timestamp: string;
    workerId: string;
    datacenterId: string;
    sequence: string;
  };
} => {
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
    /**
     * Converts the parsed bigint components to strings.
     * @returns The parsed components as strings.
     */
    toStr: () => ({
      timestamp: timestamp.toString(),
      workerId: workerId.toString(),
      datacenterId: datacenterId.toString(),
      sequence: sequence.toString(),
    }),
  };
};
