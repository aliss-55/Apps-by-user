// frontend/src/App.jsx
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const buscar = async () => {
    setError('');
    setResultado(null);
    try {
      const res = await axios.post('http://localhost:5000/buscar', {
        nombre,
        codigo,
      });
      setResultado(res.data);
    } catch (err) {
      setError('No se encontró el usuario.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Buscar Aplicativos</h1>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          onClick={buscar}
        >
          Buscar
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {resultado && (
          <div className="mt-4">
            <h2 className="font-semibold">Resultados:</h2>
            <p><strong>Nombre:</strong> {resultado.nombre}</p>
            <p><strong>Cédula:</strong> {resultado.cedula}</p>
            <p><strong>Código:</strong> {resultado.codigo}</p>
            <p><strong>Aplicativos:</strong> {resultado.aplicativos.join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
