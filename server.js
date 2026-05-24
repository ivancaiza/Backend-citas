const express = require('express');
const cors = require('cors');
// Aqui llamo el modulo de rutas medicosRoutes, que se encarga de manejar las rutas relacionadas con los médicos.
const medicosRoutes = require('./routes/medicosRoutes'); 
const citasRoutes = require('./routes/citasRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Cuaalquier peticion que llegue a "medicos" pasa por el archivo medicosRoutes.js.
app.use('/api/medicos', medicosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Servidor de Citas Médicas Organizado');
});

// Aqui se inicia el servidir, atenntos los dos.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
