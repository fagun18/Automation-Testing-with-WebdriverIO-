import log from 'loglevel';
interface LoggerInterface extends log.Logger {
    progress(...msg: any[]): void;
}
declare function getLogger(name: string): LoggerInterface;
declare namespace getLogger {
    var waitForBuffer: () => Promise<void>;
    var setLevel: (name: string, level: log.LogLevelDesc) => void;
    var clearLogger: () => void;
    var setLogLevelsConfig: (logLevels?: Record<string, log.LogLevelDesc>, wdioLogLevel?: log.LogLevelDesc) => void;
}
export default getLogger;
export type Logger = LoggerInterface;
//# sourceMappingURL=node.d.ts.map