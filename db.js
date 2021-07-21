const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/db_user_albert';
console.log(DB_URL)  

const connect = async () => {
    try {
        const db = await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        const { name, host } = db.connection;
        console.log(`Conectado a la base de datos db ${name} en ${host}`);
    } catch (error) {
        console.log('Ha ocurrido un error conectando a la base de datos.', error);
    };
};

module.exports = {
    DB_URL,
    connect,
};
