// Importa el framework Express
const express = require('express');
// Importa el middleware bodyParser para analizar datos de solicitud en formato JSON
const bodyParser = require('body-parser');
// Importa el módulo MySQL para interactuar con la base de datos MySQL
const mysql = require('mysql');
// Importa la biblioteca bcrypt para el cifrado de contraseñas
const bcrypt = require('bcrypt');
// Importa el módulo path para manejar rutas de archivos y directorios
const path = require('path');
// Importa el módulo CORS para permitir solicitudes desde otros dominios
const cors = require('cors');

// Crea una instancia de la aplicación Express
const app = express();

// Habilita CORS para permitir solicitudes desde otros dominios
app.use(cors());

// Establece el puerto en el que el servidor escuchará las solicitudes
const port = 3000;

// Crea una conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aurora'
});

// Establece la conexión a la base de datos MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexión a la base de datos establecida');
});

// Configura el middleware bodyParser para analizar datos de solicitud codificados en URL y JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configura Express para servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Define la ruta para la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define la ruta para la página de inicio de sesión
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login', 'login.html'));
});

// Define la ruta para la página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register', 'registro.html'));
});

// Define la ruta para la página del carrito
app.get('/carrito', (req, res) => {
    res.sendFile(path.join(__dirname, 'carrito.html'));
});

// Definir la ruta para el cierre de sesión
app.get('/logout', (req, res) => {
    res.redirect('/login');
});

// Maneja las solicitudes POST para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM usuario WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        if (result.length > 0) {
            const hashedPassword = result[0].password;
            bcrypt.compare(password, hashedPassword, (err, bcryptResult) => {
                if (err) {
                    console.error('Error al comparar contraseñas:', err);
                    res.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                if (bcryptResult) {
                    res.json({ exists: true });
                } else {
                    res.json({ exists: false });
                }
            });
        } else {
            res.json({ exists: false });
        }
    });
});

// Maneja las solicitudes POST para registrar un nuevo usuario
app.post('/register', (req, res) => {
    const { name, username, password } = req.body;
    const saltRounds = 10;
    const insertUserQuery = 'INSERT INTO usuario (name, username, password) VALUES (?, ?, ?)';
    const checkUsernameQuery = 'SELECT * FROM usuario WHERE username = ?';
    db.query(checkUsernameQuery, [username], (err, result) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        if (result.length > 0) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                console.error('Error al cifrar la contraseña:', err);
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
            }
            db.query(insertUserQuery, [name, username, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error al insertar el usuario:', err);
                    res.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                res.json({ registered: true });
            });
        });
    });
});

// Maneja las solicitudes GET para consultar personas
app.get('/CRUDRepo/ConsultarPersonas', (req, res) => {
    db.query('SELECT * FROM usuario', (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json(results);
    });
});

// Maneja las solicitudes POST para agregar una nueva persona
app.post('/CRUDRepo/AgregarPersona', (req, res) => {
    const { name, username, password } = req.body;
    db.query('INSERT INTO usuario (name, username, password) VALUES (?, ?, ?)', [name, username, password], (err, results) => {
        if (err) {
            console.error('Error al agregar la persona:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.status(201).json({ message: 'Persona agregada exitosamente' });
    });
});

// Maneja las solicitudes PUT para actualizar una persona
app.put('/CRUDRepo/ActualizarPersona/:id', (req, res) => {
    const { id } = req.params;
    const { name, username } = req.body;
    if (!name || !username) {
        return res.status(400).json({ error: 'Faltan datos necesarios' });
    }
    db.query('UPDATE usuario SET name = ?, username = ? WHERE id = ?', [name, username, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar la persona:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Persona no encontrada' });
            return;
        }
        res.json({ message: 'Persona actualizada exitosamente' });
    });
});

// Maneja las solicitudes DELETE para eliminar una persona
app.delete('/CRUDRepo/EliminarPersona/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM usuario WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar la persona:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json({ message: 'Persona eliminada exitosamente' });
    });
});

// Manejo de errores para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores genérico
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
