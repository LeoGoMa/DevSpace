const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');

    const alterUsuarios = `
    ALTER TABLE usuarios 
    ADD COLUMN github_url VARCHAR(255),
    ADD COLUMN nivel_experiencia VARCHAR(50),
    ADD COLUMN biografia TEXT,
    ADD COLUMN fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  `;

    const alterPosts = `
    ALTER TABLE posts 
    MODIFY COLUMN codigo TEXT NOT NULL,
    ADD COLUMN tags VARCHAR(255),
    ADD COLUMN visibilidad VARCHAR(20) DEFAULT 'publico',
    ADD COLUMN fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  `;

    connection.query(alterUsuarios, (err) => {
        if (err) {
            console.log('Error altering usuarios (might already exist):', err.message);
        } else {
            console.log('Table usuarios updated');
        }

        connection.query(alterPosts, (err) => {
            if (err) {
                console.log('Error altering posts (might already exist):', err.message);
            } else {
                console.log('Table posts updated');
            }
            connection.end();
        });
    });
});
