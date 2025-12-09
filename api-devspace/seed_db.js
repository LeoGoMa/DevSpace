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
        console.error('Error connecting:', err);
        return;
    }
    console.log('Connected to database');

    // 1. Create User
    const userSql = "INSERT INTO usuarios (nombre, email, password, github_url, nivel_experiencia, biografia) VALUES ('Demo User', 'demo@example.com', 'password123', 'https://github.com/demo', 'Intermedio', 'Desarrollador Full Stack apasionado.')";

    db.query(userSql, (err, result) => {
        if (err) {
            console.log('User might already exist or error:', err.message);
        }

        // Get a user ID (either new or existing)
        db.query("SELECT id FROM usuarios LIMIT 1", (err, users) => {
            if (err || users.length === 0) {
                console.error('No users found to assign posts to.');
                db.end();
                return;
            }
            const userId = users[0].id;

            // 2. Create Post
            const postSql = `INSERT INTO posts (titulo, codigo, descripcion, tags, visibilidad, usuario_id, lenguaje_id) VALUES 
            ('Mi primer componente en Angular', 'import { Component } from \"@angular/core\";...', 'He creado este componente para...', '#angular #frontend', 'publico', ?, 1),
            ('Truco de CSS Grid', '.grid { display: grid; ... }', 'Una forma fácil de centrar elementos.', '#css #webdesign', 'publico', ?, 3)`;

            db.query(postSql, [userId, userId], (err, res) => {
                if (err) console.error('Error creating posts:', err.message);
                else console.log('Test posts created successfully!');
                db.end();
            });
        });
    });
});
