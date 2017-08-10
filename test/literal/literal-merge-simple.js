'use strict'

import Configurator from '../../index';
import test from 'ava';

test('literal-merge-simple', async t => {
    const literal1 = {
        a: 1,
        c: 2
    };

    const literal2 = {
        b: 3,
        c: 4
    }

    const expected = {
        a: 1,
        b: 3,
        c: 4
    }

    Configurator.use('literal', literal1);
    Configurator.use('literal', literal2);

    const config = await Configurator.build();

    t.deepEqual(expected, config);
});
