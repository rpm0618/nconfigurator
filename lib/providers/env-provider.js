'use strict'

/**
 * Merges the system's environment variables with the current config, optionally
 * filtering them based on a whitelist or regex
 */
class EnvProvider {

    /**
     * EnvProvider constructor
     * options:
     *  - whitelist: an array of variables to allow
     *  - regex: only env. variables whose name matches the regular expression
     *           will be allowed through
     *  - lowerCase: convert all of the environment variable names to lower case
     *               before filtering them out.
     * @param  {object} options Detailed options for filtering env. variables
     */
    constructor(options) {
        if (!options) {
            options = {};
        }
        this.options = options;
    }

    build(config) {
        let env = process.env;

        for (const key in env) {
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

            if (this.options.transformer && this.options.transformer(config, filteredKey, env[key])) {
                continue
            }

            config[filteredKey] = env[key];
        }
        return config;
    }
}

module.exports = EnvProvider;
