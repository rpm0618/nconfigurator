'use strict'

const _ = require('lodash');

function merge(dest, src) {
    return _.mergeWith(dest, src, (destValue, srcValue) => {
        if (_.isArray(destValue)) {
            return srcValue;
        }
    });
}

module.exports = merge;
