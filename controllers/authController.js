const crypto = require('crypto');
const db = require('../db/connection');

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

const validarCedula = (cedula) => {
    return /^\d{1,10}$/.test(String(cedula || ''));
};

const registrarUsuario = async (req, res) => {
    const { usuario, password, cedula } = req.body;

    if (!usuario || !password || !cedula) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    if (!validarCedula(cedula)) {
        return res.status(400).json({ error: 'La cedula debe contener solo numeros y maximo 10 digitos.' });
    }

    try {
        const passwordHash = hashPassword(password);

        await db.query(
            'INSERT INTO usuarios (usuario, password, cedula) VALUES (?, ?, ?)',
            [usuario.trim(), passwordHash, Number(cedula)]
        );

        res.status(201).json({ message: 'Usuario registrado correctamente.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El usuario o la cedula ya estan registrados.' });
        }

        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
};

const iniciarSesion = async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ error: 'Usuario y contrasena son obligatorios.' });
    }

    try {
        const passwordHash = hashPassword(password);
        const [rows] = await db.query(
            'SELECT id, usuario, cedula FROM usuarios WHERE usuario = ? AND password = ?',
            [usuario.trim(), passwordHash]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contrasena incorrectos.' });
        }

        res.json({ message: 'Inicio de sesion correcto.', usuario: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesion.' });
    }
};

module.exports = { registrarUsuario, iniciarSesion };
