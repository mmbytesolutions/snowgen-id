import { expect, test, describe } from "bun:test";
import { createWorker, parseId } from "../index";

describe("snowgen-id ID Generator", () => {
  test("createWorker should create a worker with the specified options", () => {
    const workerId = 1n;
    const datacenterId = 1n;
    const worker = createWorker(workerId, datacenterId);

    expect(worker.workerId).toBe(workerId);
    expect(worker.datacenterId).toBe(datacenterId);
  });

  test("createWorker should throw an error for invalid worker ID", () => {
    const invalidWorkerId = 32n;
    const datacenterId = 1n;

    expect(() => createWorker(invalidWorkerId, datacenterId)).toThrow();
  });

  test("createWorker should throw an error for invalid datacenter ID", () => {
    const workerId = 1n;
    const invalidDatacenterId = 32n;

    expect(() => createWorker(workerId, invalidDatacenterId)).toThrow();
  });

  test("nextId should generate unique IDs", () => {
    const worker = createWorker(1n, 1n);
    const id1 = worker.nextId();
    const id2 = worker.nextId();

    expect(id1).not.toBe(id2);
  });

  test("parseId should parse a given ID correctly", () => {
    const workerId = 1n;
    const datacenterId = 1n;
    const timestamp = 1609459200000n;
    const sequence = 1n;

    const id =
      ((timestamp - 1609459200000n) << 22n) |
      (datacenterId << 17n) |
      (workerId << 12n) |
      sequence;
    const parsed = parseId(id);

    expect(parsed.workerId).toBe(workerId);
    expect(parsed.datacenterId).toBe(datacenterId);
    expect(parsed.timestamp).toBe(timestamp);
    expect(parsed.sequence).toBe(sequence);
  });

  test("getCurrentSequence should return the current sequence", () => {
    const worker = createWorker(1n, 1n);
    worker.nextId();
    const sequence = worker.getCurrentSequence();

    expect(sequence).toBeLessThanOrEqual(4095n);
  });

  test("getLastTimestamp should return the last timestamp", () => {
    const worker = createWorker(1n, 1n);
    worker.nextId();
    const lastTimestamp = worker.getLastTimestamp();

    expect(lastTimestamp).toBeGreaterThan(0n);
  });

  test("parseId should return a string representation of the parsed components", () => {
    const workerId = 1n;
    const datacenterId = 1n;
    const timestamp = 1609459200000n;
    const sequence = 1n;

    const id =
      ((timestamp - 1609459200000n) << 22n) |
      (datacenterId << 17n) |
      (workerId << 12n) |
      sequence;
    const parsed = parseId(id);

    expect(parsed.toStr()).toStrictEqual({
      timestamp: "1609459200000",
      workerId: "1",
      datacenterId: "1",
      sequence: "1",
    });
  });
});
