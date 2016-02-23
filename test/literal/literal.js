'use strict'

import Configurator from '../../index';
import test from 'ava';

test('literal', async t => {
    const literal = {
        hello: 'world',
        a: [1, 2, 3],
        b: {
            c: 1,
            d: 2,
            e: {
                f: 'g'
            }
        }
    };

    Configurator.use('literal', literal);
    const config = await Configurator.build();

    t.same(literal, config);
});
