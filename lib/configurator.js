'use strict'

const co = require('co');

/**
 * Main class. Providers register and link up with this class, and the final
 * configuration is built here.
 */
class Configurator {
    constructor() {
        this.providers = [];
        this.registry = {};
    }

    /**
     * Build the final configuration, by building all of the providers in order
     * @return {Promise} A promise that resolves to the configuration object
     */
    build() {
        let self = this;
        return co(function*() {
            let config = {};
            for (let provider of self.providers) {
                config = yield Promise.resolve(provider.build(config));
            }
            return config;
        });
    }

    /**
     * Add a provider to the queue.
     * @param  {Provider|string} provider If Provier, add directly to the queue.
     *                                    If a string, create an instance of an
     *                                    already registered provider.
     * @param  {object} options  If using a registered provider class, options
     *                           to pass to it's constructor.
     */
    use(provider, options) {
        if (typeof provider === 'string') {
            let providerClass = this.registry[provider];
            if (providerClass) {
                this.providers.push(new providerClass(options));
            }
            else {
                throw `No provider with the name ${provider} registered`;
            }
        }
        else {
            this.providers.push(provider);
        }
    }

    /**
     * Alias a provider class with a string mnemonic
     * @param  {string}     name          The name to register the provider as
     * @param  {Provider}   providerClass The provider class to register
     */
    register(name, providerClass) {
        this.registry[name] = providerClass;
    }
}

module.exports = Configurator;
