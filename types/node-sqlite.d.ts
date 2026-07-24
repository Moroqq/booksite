// Minimal ambient declarations for Node's built-in `node:sqlite` module.
// Node 22.5+ ships this at runtime, but @types/node@20 doesn't declare it yet.
// Covers only the synchronous API surface used in this project.

declare module "node:sqlite" {
  type SQLInputValue = string | number | bigint | null | Uint8Array;

  interface RunResult {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  class StatementSync {
    run(...params: SQLInputValue[]): RunResult;
    get(...params: SQLInputValue[]): unknown;
    all(...params: SQLInputValue[]): unknown[];
  }

  interface DatabaseSyncOptions {
    open?: boolean;
    readOnly?: boolean;
    enableForeignKeyConstraints?: boolean;
  }

  class DatabaseSync {
    constructor(path: string, options?: DatabaseSyncOptions);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }

  export { DatabaseSync, StatementSync };
}
