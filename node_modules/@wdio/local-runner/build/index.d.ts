import { WritableStreamBuffer } from 'stream-buffers';
import type { Options, Workers } from '@wdio/types';
import WorkerInstance from './worker.js';
export type { WorkerInstance };
export interface RunArgs extends Workers.WorkerRunPayload {
    command: string;
    args: any;
}
export default class LocalRunner {
    private _options;
    protected _config: Options.Testrunner;
    workerPool: Record<string, WorkerInstance>;
    stdout: WritableStreamBuffer;
    stderr: WritableStreamBuffer;
    constructor(_options: never, _config: Options.Testrunner);
    /**
     * nothing to initialize when running locally
     */
    initialize(): void;
    getWorkerCount(): number;
    run({ command, args, ...workerOptions }: RunArgs): Promise<WorkerInstance>;
    /**
     * shutdown all worker processes
     *
     * @return {Promise}  resolves when all worker have been shutdown or
     *                    a timeout was reached
     */
    shutdown(): Promise<boolean>;
}
//# sourceMappingURL=index.d.ts.map