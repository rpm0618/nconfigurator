'use strict'

module.exports = class LiteralProvider {
    constructor(literal) {
        this.literal = literal;
    }

    build(config) {
        config = Object.assign(config, this.literal);
        return Promise.resolve(config);
    }
}
