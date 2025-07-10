// index.js (versión final simplificada)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
// Ya no necesitas 'jsonwebtoken'

const app = express();
const PORT = process.env.PORT || 5001;
// ... (resto de constantes)

app.use(cors());
app.use(express.json());

// El endpoint de login no cambia
app.post('/api/auth/login', async (req, res) => {
    // ... (código sin cambios)
});

// El middleware de verificación se ha quitado. WSO2 lo maneja.
app.get('/api/devices', async (req, res) => {
  // Opcional: Puedes confiar en las cabeceras que WSO2 añade
  // para identificar al usuario, como 'X-JWT-Assertion'.
  console.log(`Petición para dispositivos recibida y validada por el API Gateway.`);

  try {
    const response = await axios.get(
      `${process.env.MENDER_SERVER_URL}/api/management/v2/devauth/devices`,
      {
        headers: { Authorization: `Bearer ${process.env.MENDER_SERVER_PAT}` },
        params: { per_page: 100 },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error obteniendo dispositivos:', error.response?.data || error.message);
    res.status(500).json({ error: 'No se pudieron obtener los dispositivos' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend (orquestador) corriendo en http://localhost:${PORT}`);
});