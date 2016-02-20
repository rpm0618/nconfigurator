'use strict'

module.exports = class LiteralProvider {
    constructor(literal) {
        this.literal = literal;
    }

    build(config) {
        return Object.assign(config, this.literal);
    }
}
