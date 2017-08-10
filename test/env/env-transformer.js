'use strict'

import Configurator from '../../index';
import test from 'ava';

test('env-transformer', async t => {
    process.env.HELLO_WORLD = '123';

    Configurator.use('env', {
        transformer: (config, key, value) => {
            if (key == 'HELLO_WORLD') {
                if (!config.HELLO) config.HELLO = {};
                config.HELLO.WORLD = value;
            }
        }
    });

    const config = await Configurator.build();

    t.deepEqual(config.HELLO.WORLD, '123')
})
