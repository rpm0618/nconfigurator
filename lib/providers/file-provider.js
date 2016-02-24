'use strict'

const co = require('co');
const fs = require('mz/fs');
const path = require('path');
const merge = require('../utils/merge');

/**
 * Reads in and parses a file (JSON only for the moment), and then merges it
 * with the current config. Either a filename can be passed in directly, or it
 * can be taken from the current configuration. It can also be configured to
 * silently ignore missing files and parse errors
 */
class FileProvider {

    /**
     * FileProvider constructor
     * options:
     *  - file: The file to read
     *  - fromConfig: The config property to get the file from
     *  - skipMissing: If true, silently ignore missing files and config values
     *  - skipErrors: If truem silently ignore parsing errors
     *
     * @param  {object|string} options If a string, the name of the file to read
     *                                 If an object, detailed options.
     */
    constructor(options) {
        this.options = options;
        if (typeof options === 'string') {
            this.options = {file: options};
        }
    }

    build(config) {
        let options = this.options;

        if (options.fromConfig) {
            options.file = config[options.fromConfig];
            if (!options.file) {
                if (options.skipMissing) {
                    return config;
                }
                else {
                    throw new Error(`No value for config '${options.fromConfig}', can't load file`);
                }
            }
        }

        let buildFromFile = this.buildFromFile;
        return co(function*() {
            let exists = yield fs.exists(options.file);
            if (!exists) {
                if (options.skipMissing) {
                    return config;
                }
                else {
                    return Promise.reject(new Error(`File ${options.file} cannot be found`));
                }
            }

            let isDir = (yield fs.stat(options.file)).isDirectory();

            if (!isDir) {
                config = yield buildFromFile(config, options.file, options);
            }
            else {
                let files = yield fs.readdir(options.file);
                for (let file of files) {
                    file = path.join(options.file, file);
                    let isFile = (yield fs.stat(file)).isFile();
                    if (isFile) {
                        config = yield buildFromFile(config, file, options);
                    }
                }
            }

            return config;
        });
    }

    buildFromFile(config, file, options) {
        return co(function*() {
            let contents = (yield fs.readFile(file)).toString();

            try {
                let parsed = parse(contents, options);
                return merge(config, parsed);
            }
            catch (err) {
                if (options.skipErrors) {
                    return config;
                }
                else {
                    let errorString = `Error parsing ${options.file}: ${err}`;
                    return Promise.reject(new Error(errorString));
                }
            }
        });
    }
}

function parse(contents, options) {
    return JSON.parse(contents);
}

module.exports = FileProvider;
