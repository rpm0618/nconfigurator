'use strict'

module.exports = class EnvProvider {
    constructor(options) {
        if (!options) {
            options = {};
        }
        this.options = options;
    }

    build(config) {
        let env = process.env;

        for (var key in env) {
            if (!env.hasOwnProperty(key)) {
                continue;
            }

            let filteredKey = key;
            if (this.options.lowerCase) {
                filteredKey = filteredKey.toLowerCase();
            }

            if (this.options.whitelist && this.options.whitelist.indexOf(filteredKey) < 0) {
                continue;
            }

            if (this.options.match && !filteredKey.match(this.options.match)) {
                continue
            }

            config[filteredKey] = env[key];
        }
        return config;
    }
}
