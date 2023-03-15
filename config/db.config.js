
module.exports = {
    HOST: 'isilo.db.elephantsql.com',
    USER: 'prmfcqcl',
    PASSWORD: 'pH4QEnch_OllWvCHvB1joaykE119WtlJ',
    DB: 'prmfcqcl',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};



// module.exports = {
//     HOST: '127.0.0.1',
//     USER: 'postgres',
//     PASSWORD: 1234,
//     DB: 'groupmania',
//     dialect: 'postgres',
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// };
// "development": {
//     "username": "root",
//     "password": 1234,
//     "database": "groupmania",
//     "host": "127.0.0.1",
//     "dialect": "postgres"
//   },