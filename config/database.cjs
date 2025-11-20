require('dotenv').config();

module.exports ={
    development:{
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT||5432),
        dialect: 'postgres',
        logging: false,
    },
    test:{
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME||'test_db',
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT||5432),
        dialect: 'postgres',
        logging: false,
    },
    production:{
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT||5432),
        dialect: 'postgres',
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false,
    }
}