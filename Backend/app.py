# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite solicitudes desde React

# Datos simulados
usuarios = [
    {"nombre": "Ana Perez", "cedula": "12345678", "codigo": "U001"},
    {"nombre": "Carlos Lopez", "cedula": "87654321", "codigo": "U002"},
]

# Aplicativos donde se relacionan por código o cédula
aplicativos = {
    "AppA": {"por_codigo": ["U001"], "por_cedula": ["87654321"]},
    "AppB": {"por_codigo": ["U002"], "por_cedula": ["12345678"]},
    "AppC": {"por_codigo": [], "por_cedula": ["12345678", "87654321"]},
}

@app.route('/buscar', methods=['POST'])
def buscar():
    data = request.json
    nombre = data.get("nombre", "").lower()
    codigo = data.get("codigo", "").upper()

    # Buscar por nombre o código
    resultado = next(
        (u for u in usuarios if u["codigo"] == codigo or u["nombre"].lower() == nombre),
        None
    )

    if not resultado:
        return jsonify({"error": "Usuario no encontrado"}), 404

    cedula = resultado["cedula"]
    codigo = resultado["codigo"]

    # Buscar en qué aplicativos aparece
    encontrados = []
    for app, datos in aplicativos.items():
        if codigo in datos["por_codigo"] or cedula in datos["por_cedula"]:
            encontrados.append(app)

    return jsonify({
        "nombre": resultado["nombre"],
        "cedula": cedula,
        "codigo": codigo,
        "aplicativos": encontrados
    })

if __name__ == '__main__':
    app.run(debug=True)
