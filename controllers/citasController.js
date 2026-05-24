const db = require('../db/connection');

const agendarCita = async (req, res) => {
    const { nombre_paciente, id_medico, id_usuario, fecha, hora } = req.body;

    if (!nombre_paciente || !id_medico || !id_usuario || !fecha || !hora) {
        return res.status(400).json({ error: "Todos los campos de la cita son obligatorios." });
    }

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
            'INSERT INTO citas (nombre_paciente, id_medico, id_usuario, fecha, hora) VALUES (?, ?, ?, ?, ?)',
            [nombre_paciente, id_medico, id_usuario, fecha, hora]
        );
        res.status(201).json({ message: "¡Cita guardada con éxito!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
};

const getTodasCitas = async (req, res) => {
    const { id_usuario } = req.params;

    if (!id_usuario) {
        return res.status(400).json({ error: "El usuario es obligatorio para consultar citas." });
    }

    try {
        const [rows] = await db.query(`
            SELECT citas.*, medicos.nombre as nombre_medico
            FROM citas
            JOIN medicos ON citas.id_medico = medicos.id
            WHERE citas.id_usuario = ?
            ORDER BY citas.fecha ASC, citas.hora ASC
        `, [id_usuario]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminarCita = async (req, res) => {
    const { id } = req.params;
    const { id_usuario } = req.body;

    if (!id_usuario) {
        return res.status(400).json({ error: "El usuario es obligatorio para cancelar citas." });
    }

    try {
        const [result] = await db.query('DELETE FROM citas WHERE id = ? AND id_usuario = ?', [id, id_usuario]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "La cita no existe o no pertenece a este usuario." });
        }

        res.json({ message: "Cita eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { agendarCita, getTodasCitas, eliminarCita };
