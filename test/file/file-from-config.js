'use strict'

import Configurator from '../../index';
import test from 'ava';
import path from 'path';

test('file', async t => {
    const fileToUse = path.join(__dirname, 'data/test.json');
    const expected = {
        "test": 1,
        "test2": [3, 4, 5],
        "test3": {
            "a": 1,
            "b": 2
        },
        "Hello": "BEEF",
        fileToUse: fileToUse
    };

    Configurator.use('literal', {fileToUse});
    Configurator.use('file', {fromConfig: 'fileToUse'});
    const config = await Configurator.build();

    t.deepEqual(expected, config);
})
