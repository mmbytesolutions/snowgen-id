/**
 * @module
 *
 * This module provides functionality for generating and parsing snowflake IDs.
 *
 * ```ts
 * import { createWorker } from "@mmbytes/snowgen";
 *
 * const worker = createWorker(1n, 1n);
 * const id = worker.nextId();
 * console.log(id); // 1234567890123456789n
 *
 * const parsed = worker.parse(id);
 * console.log(parsed);
 * // {
 * //   timestamp: 1621234567890n,
 * //   workerId: 1n,
 * //   datacenterId: 1n,
 * //   sequence: 0n
 * // }
 * ```
 */
export * from "./src/config";
export * from "./src/worker";
export * from "./src/parser";
