'use strict'

import Configurator from '../../index';
import test from 'ava';

test('literal-merge-complex', async t => {
    const literal1 = {
        a: {
            b: 1,
            c: 2
        },
        d: [4, 5, 6, 7]
    }

    const literal2 = {
        a: {
            c: 3,
            e: 4
        },
        d: [1, 2, 3]
    }

    const expected = {
        a: {
            b: 1,
            c: 3,
            e: 4
        },
        d: [1, 2, 3]
    }

    Configurator.use('literal', literal1);
    Configurator.use('literal', literal2);

    const config = await Configurator.build();

    t.deepEqual(expected, config);
});
