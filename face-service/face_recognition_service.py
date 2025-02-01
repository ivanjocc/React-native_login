from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import numpy as np
import os
import cv2

app = Flask(__name__)
CORS(app)

# Ruta para comparar rostros
@app.route('/recognize-face', methods=['POST'])
def recognize_face():
    try:
        # Validar archivo recibido
        if 'faceImage' not in request.files:
            return jsonify({"success": False, "message": "No se recibió la imagen"}), 400

        uploaded_file = request.files['faceImage']
        if not uploaded_file:
            return jsonify({"success": False, "message": "Archivo inválido"}), 400

        # Leer y procesar la imagen subida
        image_data = face_recognition.load_image_file(uploaded_file)

        # Extraer las características faciales
        uploaded_face_encoding = face_recognition.face_encodings(image_data)
        if len(uploaded_face_encoding) == 0:
            return jsonify({"success": False, "message": "No se detectó ningún rostro"}), 400

        uploaded_face_encoding = uploaded_face_encoding[0]

        # Simula una base de datos de rostros
        known_faces = [
            {
                "name": "Usuario de Prueba",
                "encoding": np.random.rand(128).tolist()  # Simula un encoding
            }
        ]

        # Comparar con rostros conocidos
        results = []
        for face in known_faces:
            match = face_recognition.compare_faces(
                [np.array(face["encoding"])],
                uploaded_face_encoding,
                tolerance=0.6  # Ajusta la tolerancia según sea necesario
            )
            if match[0]:
                results.append(face["name"])

        if results:
            return jsonify({"success": True, "message": "Rostro reconocido", "matches": results})
        else:
            return jsonify({"success": False, "message": "No hay coincidencias"}), 404

    except Exception as e:
        return jsonify({"success": False, "message": f"Error del servidor: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
