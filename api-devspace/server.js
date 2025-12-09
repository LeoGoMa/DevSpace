const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());


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
});


app.get('/', (req, res) => {
  res.send('DevSpace Backend is running');
});


app.post('/api/usuarios', (req, res) => {
  const { nombre, email, password, github_url, nivel_experiencia, biografia } = req.body;
  const sql = 'INSERT INTO usuarios (nombre, email, password, github_url, nivel_experiencia, biografia) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nombre, email, password, github_url, nivel_experiencia, biografia], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Usuario registrado', id: result.insertId, nombre, github_url });
  });
});

app.get('/api/usuarios/:id', (req, res) => {
  const sql = 'SELECT id, nombre, email, github_url, nivel_experiencia, biografia FROM usuarios WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result[0]);
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const user = result[0];

    delete user.password;
    res.json({ message: 'Login exitoso', user });
  });
});


app.post('/api/posts', (req, res) => {
  const { titulo, codigo, descripcion, tags, visibilidad, usuario_id, lenguaje_id } = req.body;
  const sql = 'INSERT INTO posts (titulo, codigo, descripcion, tags, visibilidad, usuario_id, lenguaje_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [titulo, codigo, descripcion, tags, visibilidad, usuario_id, lenguaje_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Post creado', id: result.insertId });
  });
});

app.get('/api/posts', (req, res) => {
  const sql = `
    SELECT p.*, u.nombre as usuario_nombre, l.nombre as lenguaje_nombre, l.icono as lenguaje_icono 
    FROM posts p 
    LEFT JOIN usuarios u ON p.usuario_id = u.id 
    LEFT JOIN lenguajes l ON p.lenguaje_id = l.id 
    ORDER BY p.fecha_publicacion DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


app.get('/api/lenguajes', (req, res) => {
  const sql = 'SELECT * FROM lenguajes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
