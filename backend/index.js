// backend/index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();

// Cliente para obtener la clave pública (JWKS) desde WSO2
const client = jwksClient({
  jwksUri: 'https://wso2is:9443/oauth2/jwks' // <-- Esto es para Docker Compose
});

//*const client = jwksClient({
  //jwksUri: 'https://<IP_DEL_PC_CON_WSO2>:9443/oauth2/jwks' // <-- Usa la IP real
//});

// Función para obtener la clave de firma del token
function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      console.error("Error al obtener la clave de firma:", err);
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Middleware de verificación de JWT
const checkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Acceso no autorizado: No se proporcionó token.');
  }

  const token = authHeader.substring(7); // Quita "Bearer "

  // Verificar el token usando la clave pública de WSO2
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.error("Error en la verificación del token:", err.message);
      return res.status(401).send('Acceso no autorizado: Token inválido.');
    }
    req.user = decoded; // Opcional: adjuntar el payload del token a la petición
    next();
  });
};

// Ruta pública (no requiere token)
app.get('/api/public', (req, res) => {
  res.json({ message: 'Hola desde la ruta pública. Cualquiera puede ver esto.' });
});

// Ruta protegida (requiere un token JWT válido)
app.get('/api/protected', checkJwt, (req, res) => {
  res.json({
    message: '¡Acceso concedido a la ruta protegida!',
    user: req.user.sub // El 'subject' (usuario) del token
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Microservicio backend escuchando en el puerto ${PORT}`);
});