'use strict'

const co = require('co');
const fs = require('mz/fs');

module.exports = class FileProvider {
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
