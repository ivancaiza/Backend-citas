const db = require('../db/connection');

const getMedicos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM medicos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMedicos };