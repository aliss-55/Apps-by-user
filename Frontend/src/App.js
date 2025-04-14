import { useState } from "react";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";

function App() {
  const [cedula, setCedula] = useState("");
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const buscar = async () => {
    setResultado(null);
    setError("");
    setCargando(true);

    try {
      const res = await axios.post("http://localhost:5000/buscar", {
        cedula,
        codigo,
      });
      if (res.data) {
        setResultado(res.data);
      } else {
        setError("No se encontraron resultados.");
      }
    } catch (err) {
      setError("Hubo un error al buscar.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-800">🔍 Buscar Aplicativos</h1>
        <p className="text-center text-gray-500">Ingresa cédula y/o código para buscar</p>

        <div className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button
            onClick={buscar}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl flex justify-center items-center gap-2"
            disabled={cargando}
          >
            {cargando ? <Loader2 className="animate-spin" /> : <Search />}
            {cargando ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Resultado</h2>
            <p><strong>👤 Nombre:</strong> {resultado.nombre}</p>
            <p><strong>🪪 Cédula:</strong> {resultado.cedula}</p>
            <p><strong>🆔 Código:</strong> {resultado.codigo}</p>
            <p><strong>📲 Aplicativos:</strong> {resultado.aplicativos.join(", ")}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
