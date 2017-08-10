'use strict'

import Configurator from '../../index';
import test from 'ava';

test('env', async t => {
    process.env.HELLO = 'World';
    process.env.CHICKEN = 'Nugget';

    Configurator.use('env');
    const config = await Configurator.build();

    t.deepEqual(config.HELLO, 'World');
    t.deepEqual(config.CHICKEN, 'Nugget');
});
