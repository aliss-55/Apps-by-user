from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Función para cargar archivos
def cargar_json(nombre):
    ruta = os.path.join("data", nombre)
    with open(ruta, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

@app.route('/buscar', methods=['POST'])
def buscar():
    data = request.json
    cedula = data.get('cedula', '').strip()
    codigo = data.get('codigo', '').strip()

    unoee = cargar_json("unoee.json")
    opera = cargar_json("opera.json")
    indicadores = cargar_json("indicadores.json")

    resultado = {
        "nombre": "",
        "cedula": cedula,
        "codigo": "",
        "aplicativos": []
    }

    # Buscar por cédula en Opera
    if cedula:
        persona_opera = next((p for p in opera if p["cedula"] == cedula), None)
        if persona_opera:
            resultado["nombre"] = persona_opera["nombre"]
            resultado["codigo"] = persona_opera["codigo"]
            resultado["aplicativos"].append("Opera")

    codigo_final = codigo or resultado["codigo"]

    if codigo_final:
        resultado["codigo"] = codigo_final

        # Buscar en UNOEE
        persona_unoee = next((p for p in unoee if p["codigo"] == codigo_final), None)
        if persona_unoee:
            resultado["nombre"] = persona_unoee["nombre"]
            if "UNOEE" not in resultado["aplicativos"]:
                resultado["aplicativos"].append("UNOEE")

        # Buscar en indicadores
        if codigo_final in indicadores:
            resultado["aplicativos"].append("Indicadores")

    if not resultado["codigo"]:
        return jsonify({"error": "No se encontró la persona"}), 404

    return jsonify(resultado)

if __name__ == "__main__":
    app.run(debug=True)
