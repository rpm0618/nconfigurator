'use strict'

import Configurator from '../../index';
import test from 'ava';
import path from 'path';

test('file-directory', async t => {
    const expected = {
        "test": 1,
        "test2": [3, 4, 5],
        "test3": {
            "a": 1,
            "b": 2,
            "c": 3
        },
        "test4": "Chicken",
        "test5": "A large amount of people find spiders scary",
        "Hello": "BEEF"
    };

    Configurator.use('file', path.join(__dirname, 'data/'));
    const config = await Configurator.build();

    t.deepEqual(expected, config);
});
