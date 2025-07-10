import React, { useState, useEffect } from 'react';

function Dashboard({ token, onSessionExpired }) { // <-- Nuevo prop
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/devices', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Si el token expiró, el backend devolverá 401
        if (response.status === 401) {
          onSessionExpired(); // <-- Llamamos a la función para cerrar sesión
          return;
        }

        const data = await response.json();
        if (response.ok) {
          setDevices(data);
        } else {
          setError(data.error || 'Error al cargar dispositivos.');
        }
      } catch (err) {
        setError('No se pudo conectar al servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [token, onSessionExpired]);

  // ... (el resto del return sigue igual)
}

export default Dashboard;