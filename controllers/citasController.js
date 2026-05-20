const db = require('../db/connection');

const agendarCita = async (req, res) => {
    const { nombre_paciente, id_medico, fecha, hora } = req.body;

    try {
        const [citasExistentes] = await db.query(
            `SELECT id FROM citas
             WHERE id_medico = ? AND fecha = ? AND hora = ? AND estado <> 'Cancelada'`,
            [id_medico, fecha, hora]
        );

        if (citasExistentes.length > 0) {
            return res.status(409).json({
                error: "El medico ya tiene una cita agendada en ese mismo horario."
            });
        }

        await db.query(
            'INSERT INTO citas (nombre_paciente, id_medico, fecha, hora) VALUES (?, ?, ?, ?)',
            [nombre_paciente, id_medico, fecha, hora]
        );
        res.status(201).json({ message: "¡Cita guardada con éxito!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
};

const getTodasCitas = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT citas.*, medicos.nombre as nombre_medico 
            FROM citas 
            JOIN medicos ON citas.id_medico = medicos.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const eliminarCita = async (req, res) => {
    const { id } = req.params; 
    try {
        await db.query('DELETE FROM citas WHERE id = ?', [id]);
        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { agendarCita, getTodasCitas, eliminarCita };
