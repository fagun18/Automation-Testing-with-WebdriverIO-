import fs from 'node:fs';
import url from 'node:url';
import path from 'node:path';
import { sync as globSync } from 'glob';
import RequireLibrary from './RequireLibrary.js';
/**
 * lower case windows driver letter
 */
function lowercaseWinDriveLetter(p) {
    return p.replace(/^[A-Za-z]:\\/, (match) => match.toLowerCase());
}
export default class FileSystemPathService {
    #moduleRequireService = new RequireLibrary();
    loadFile(path) {
        if (!path) {
            throw new Error('A path is required');
        }
        return this.#moduleRequireService.import(path);
    }
    isFile(filepath) {
        return (fs.existsSync(filepath) && fs.lstatSync(filepath).isFile());
    }
    /**
     * find test files based on a glob pattern
     * @param pattern file pattern to glob
     * @param rootDir directory of wdio config file
     * @returns files matching the glob pattern
     */
    glob(pattern, rootDir) {
        const globResult = globSync(pattern, {
            cwd: rootDir,
            matchBase: true
        }) || [];
        const fileName = pattern.startsWith(path.sep) ? pattern : path.resolve(rootDir, pattern);
        /**
         * given that glob treats characters like `[` or `{` in a special way
         * and we also want to be able to find files with these characters included
         * we add an additional check to see if the file as pattern exists.
         * add file to globResult only if filename doesn't include pattern(*)
         * and globResult doesn't contain the fileName
         * and file should be available
         */
        if (!pattern.includes('*') &&
            !globResult.includes(pattern) &&
            !globResult.map(lowercaseWinDriveLetter).includes(lowercaseWinDriveLetter(fileName)) &&
            fs.existsSync(fileName)) {
            globResult.push(fileName);
        }
        return globResult.sort();
    }
    ensureAbsolutePath(filepath, rootDir) {
        if (filepath.startsWith('file://')) {
            return filepath;
        }
        const p = path.isAbsolute(filepath)
            ? path.normalize(filepath)
            : path.resolve(rootDir, filepath);
        return url.pathToFileURL(p).href;
    }
}
