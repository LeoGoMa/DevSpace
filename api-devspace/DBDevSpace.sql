CREATE DATABASE devspace_db;
USE devspace_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,      
    email VARCHAR(100) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL,     
    github_url VARCHAR(255),            
    nivel_experiencia VARCHAR(50),      
    biografia TEXT,                     
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lenguajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    icono VARCHAR(50)
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,      
    codigo TEXT NOT NULL,               
    descripcion TEXT,                 
    tags VARCHAR(255),                  
    visibilidad VARCHAR(20) DEFAULT 'publico', 
    usuario_id INT,                    
    lenguaje_id INT,                   
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (lenguaje_id) REFERENCES lenguajes(id)
);

INSERT INTO lenguajes (nombre, icono) VALUES 
('JavaScript', 'fab fa-js'),
('Python', 'fab fa-python'),
('Java', 'fab fa-java'),
('HTML/CSS', 'fab fa-html5');

--CONSULTAS RAPIDAS
select * from lenguajes;
select * from usuarios;
select * from posts;

