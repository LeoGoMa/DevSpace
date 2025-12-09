const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) console.error(err);

    connection.query("INSERT INTO lenguajes (nombre, icono) VALUES ('JavaScript', 'fa-brands fa-js')", (err, res) => {
        if (err) console.error(err);
        else console.log('Language inserted, ID:', res.insertId);
        connection.end();
    });
});
