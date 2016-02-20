'use strict'

const Configurator = require('../index');

Configurator.use('literal', {Hello: 'World'});
Configurator.use('cli');
Configurator.use('file', {fromConfig: 'file', skipMissing: true});
Configurator.use('env', {match: /computername/, lowerCase: true});

Configurator.build().then(config => {
    console.log(JSON.stringify(config, null, 4));
}).catch(err => {
    console.error(err.stack);
})
