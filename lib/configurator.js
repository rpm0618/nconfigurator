'use strict'

var co = require('co');

module.exports = class Configurator {
    constructor() {
        this.providers = [];
        this.registry = {};
    }

    build() {
        var self = this;
        return co(function*() {
            let config = {};
            for (let provider of self.providers) {
                config = yield Promise.resolve(provider.build(config));
            }
            return config;
        });
    }

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

    register(name, providerClass) {
        this.registry[name] = providerClass;
    }
}
