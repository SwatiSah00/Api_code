var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1', //192.168.0.176
        //socketPath: '/var/run/mysqld/mysqld.sock',
        user: 'root',
        password: 'Swati@123',
        database: 'chat'
    },
    pool: { min: 0, max: 7 },
    acquireConnectionTimeout: 10000,
    migrations: {
        tableName: 'migrations'
    }
});

module.exports = knex;