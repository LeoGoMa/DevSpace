const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');

    // Check Users
    db.query('SELECT * FROM usuarios', (err, users) => {
        if (err) console.error(err);
        console.log('Users:', users);

        // Check Languages
        db.query('SELECT * FROM lenguajes', (err, langs) => {
            if (err) console.error(err);
            console.log('Languages:', langs);

            // Check Posts
            db.query('SELECT * FROM posts', (err, posts) => {
                if (err) console.error(err);
                console.log('Posts (Raw):', posts);

                // Check Feed Query
                const sql = `
                SELECT p.*, u.nombre as usuario_nombre, l.nombre as lenguaje_nombre, l.icono as lenguaje_icono 
                FROM posts p 
                LEFT JOIN usuarios u ON p.usuario_id = u.id 
                LEFT JOIN lenguajes l ON p.lenguaje_id = l.id 
                ORDER BY p.fecha_publicacion DESC
            `;
                db.query(sql, (err, feed) => {
                    if (err) console.error(err);
                    console.log('Feed Query Result:', feed);
                    db.end();
                });
            });
        });
    });
});
