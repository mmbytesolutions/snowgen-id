## MMBytes Snowflake ID Generator for TypeScript (snowgen-id)

snowgen-id is a TypeScript library for generating unique IDs based on the Snowflake algorithm. It provides a customizable and efficient way to generate 64-bit IDs using components such as timestamp, worker ID, datacenter ID, and sequence number.

<sub>_Disclaimer: This library takes heavy inspiration from the [rakheyl/snowflake-uuid](https://github.com/rakheyl/snowflake-uuid) project, but it has been rewritten to fit specific use cases._</sub>

### Features

- Customizable bit lengths for worker ID, datacenter ID, and sequence to accommodate various scaling needs.
- Built-in protection against clock going backwards.
- Ability to parse generated IDs to extract timestamp, worker ID, datacenter ID, and sequence number.
- Independent parser function for parsing IDs without creating a worker instance.

### Installation

To install snowgen-id, use the following command:

```bash
bun add @mmbytes/snowgen-id
```

You can also use your preferred package manager:

- `npm i @mmbytes/snowgen-id`
- `pnpm i @mmbytes/snowgen-id`

### Usage

Import the `createWorker` function from the library and initialize it with your worker and datacenter IDs, along with optional configuration options.

```typescript
import { createWorker } from "@mmbytes/snowgen-id";

// Initialize the worker with worker ID and datacenter ID
const worker = createWorker(0n, 1n);

// Generate a new ID
const newId = worker.nextId();
console.log(`Generated ID: ${newId}`); // Example output: Generated ID: 1617202485447688192n

// Parse an ID
const parsedId = worker.parse(newId);
console.log(`Parsed ID:`, parsedId);
// Example output:
// Parsed ID: {
//   timestamp: 1617202485447n,
//   workerId: 0n,
//   datacenterId: 1n,
//   sequence: 0n
// }
```

You can also use the independent `parseId` function to parse IDs without creating a worker instance:

```typescript
import { parseId } from "@mmbytes/snowgen-id";

const id = user.id  // your table row id
console.log(`Parsed ID:`, parseId(id));
// Example output:
// Object: {
//   timestamp: 1617202485447n,
//   workerId: 0n,
//   datacenterId: 1n,
//   sequence: 0n
// }
```

**API Reference**

Create a new worker instance capable of generating and parsing unique IDs.
`createWorker(workerId: bigint, datacenterId: bigint, options?: WorkerOptions)`

Parameters:
- `workerId`: Unique ID of the worker node.
- `datacenterId`: Unique ID of the data center.
- `options`: Optional configuration for ID generation.

**Returns**

An object with the following methods:

- `nextId()`: Generates a new unique ID.
- `parse(bigint)`: Parses a given ID into its components.
- `getCurrentSequence()`: Returns the current sequence number.
- `getLastTimestamp()`: Returns the last timestamp used for ID generation.

`parseId(id: bigint, options?: WorkerOptions)`

Parses a given ID into its components.

**Parameters**

- `id`: The ID to parse.
- `options`: Optional configuration for parsing the ID.

**Returns**

An object representing the parsed ID components:

- `timestamp`: The timestamp component of the ID.
- `workerId`: The worker ID component of the ID.
- `datacenterId`: The datacenter ID component of the ID.
- `sequence`: The sequence number component of the ID.
----
`WorkerOptions`

Configuration options for the ID generator.

- `epoch`: The epoch start time for the timestamp component of the ID. Default is `1609459200000n` (January 1, 2021).
- `workerIdBits`: Number of bits allocated for the worker ID. Default is `5`.
- `datacenterIdBits`: Number of bits allocated for the datacenter ID. Default is `5`.
- `sequenceBits`: Number of bits allocated for the sequence number. Default is `12`.

### Contributing

Contributions are welcome! Please feel free to submit a pull request.
