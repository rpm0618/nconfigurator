'use strict'

const co = require('co');
const fs = require('mz/fs');

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

        let parse = this.parse;
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
            
            let contents = (yield fs.readFile(options.file)).toString();

            try {
                let parsed = parse(contents, options);
                return Object.assign(config, parsed);
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

    parse(contents, options) {
        return JSON.parse(contents);
    }
}

module.exports = FileProvider;
