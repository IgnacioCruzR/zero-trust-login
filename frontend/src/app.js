import React, { useState, useCallback } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('userToken'));

  const handleLoginSuccess = (receivedToken) => {
    localStorage.setItem('userToken', receivedToken);
    setToken(receivedToken);
  };

  // Usamos useCallback para que la función no se recree innecesariamente
  const handleLogout = useCallback(() => {
    localStorage.removeItem('userToken');
    setToken(null);
    console.log("Sesión cerrada por token expirado o logout manual.");
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>Sistema OTA 🛡️ Zero Trust</h1>
      {token ? (
        <>
          <Dashboard token={token} onSessionExpired={handleLogout} />
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;