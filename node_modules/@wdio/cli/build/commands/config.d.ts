import type { Argv } from 'yargs';
import type { ConfigCommandArguments, ParsedAnswers } from '../types.js';
export declare const command = "config";
export declare const desc = "Initialize WebdriverIO and setup configuration in your current project.";
export declare const cmdArgs: {
    readonly yarn: {
        readonly type: "boolean";
        readonly desc: "Install packages via Yarn package manager.";
        readonly default: boolean;
    };
    readonly yes: {
        readonly alias: "y";
        readonly desc: "will fill in all config defaults without prompting";
        readonly type: "boolean";
        readonly default: false;
    };
    readonly npmTag: {
        readonly alias: "t";
        readonly desc: "define NPM tag to use for WebdriverIO related packages";
        readonly type: "string";
        readonly default: "latest";
    };
};
export declare const builder: (yargs: Argv) => Argv<import("yargs").Omit<{}, "yarn" | "yes" | "npmTag"> & import("yargs").InferredOptionTypes<{
    readonly yarn: {
        readonly type: "boolean";
        readonly desc: "Install packages via Yarn package manager.";
        readonly default: boolean;
    };
    readonly yes: {
        readonly alias: "y";
        readonly desc: "will fill in all config defaults without prompting";
        readonly type: "boolean";
        readonly default: false;
    };
    readonly npmTag: {
        readonly alias: "t";
        readonly desc: "define NPM tag to use for WebdriverIO related packages";
        readonly type: "string";
        readonly default: "latest";
    };
}>>;
export declare const parseAnswers: (yes: boolean) => Promise<ParsedAnswers>;
export declare function runConfigCommand(parsedAnswers: ParsedAnswers, npmTag: string): Promise<void>;
export declare function handler(argv: ConfigCommandArguments, runConfigCmd?: typeof runConfigCommand): Promise<{
    success: boolean;
    parsedAnswers: ParsedAnswers;
    installedPackages: string[];
}>;
/**
 * Helper utility used in `run` and `install` command to format a provided config path,
 * giving it back as an absolute path, and a version without the file extension
 * @param config the initially given file path to the WDIO config file
 */
export declare function formatConfigFilePaths(config: string): Promise<{
    fullPath: string;
    fullPathNoExtension: string;
}>;
/**
 * Helper utility used in `run` and `install` command to check whether a config file currently exists
 * @param configPath the file path to the WDIO config file
 * @returns {string} the path to the config file that exists, otherwise undefined
 */
export declare function canAccessConfigPath(configPath: string): Promise<string | undefined>;
/**
 * Helper utility used in `run` and `install` command to create config if none exist
 * @param {string}   command        to be executed by user
 * @param {string}   configPath     the path to a wdio.conf.[js/ts] file
 * @param {boolean}  useYarn        parameter set to true if yarn is used
 * @param {Function} runConfigCmd   runConfig method to be replaceable for unit testing
 */
export declare function missingConfigurationPrompt(command: string, configPath: string, runConfigCmd?: typeof runConfigCommand): Promise<false | undefined>;
//# sourceMappingURL=config.d.ts.map