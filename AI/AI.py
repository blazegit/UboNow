import json
import numpy as np
from sklearn.cluster import KMeans
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class OptimizadorHorarioAlmuerzo:
    def __init__(self, horarios_estudiantes, num_clusters=2):
        self.horarios_estudiantes = horarios_estudiantes
        self.num_clusters = num_clusters
        self.modelos_clusters = self.construir_modelos_clusters()

    def construir_modelos_clusters(self, selected_days=None):
        modelos_clusters = {}

        for dia in selected_days or ['L', 'M', 'X', 'J', 'V']:
            # Extraer los horarios para el día actual
            horarios = [horario for horario_estudiante in self.horarios_estudiantes.values() for horario in horario_estudiante if horario[-1] == dia]

            if horarios:
                # Convertir los horarios a valores numéricos que representen los puntos medios
                valores_horarios = [self.obtener_punto_medio(horario) for horario in horarios]
                valores_horarios = np.array(valores_horarios).reshape(-1, 1)

                kmeans = KMeans(n_clusters=self.num_clusters, random_state=0, n_init=10)
                kmeans.fit(valores_horarios)
                modelos_clusters[dia] = kmeans

        return modelos_clusters

    def obtener_punto_medio(self, horario):
        # Extraer la parte numérica del horario (por ejemplo, 6L -> 6)
        periodo_clase = int(horario[:-1])
        # Calcular el tiempo medio para el período de clase
        return 12.30 + (periodo_clase - 6) * 0.75

    def encontrar_ventanas_almuerzo_optimas(self, inicio_almuerzo=12.30, fin_almuerzo=14.30, selected_days=None, individual_student=None):
        ventanas_optimas = {}

        # Extract the schedule of the individual student making the request
        horario_estudiante_individual = self.horarios_estudiantes.get(individual_student, [])

        for dia, modelo_cluster in self.modelos_clusters.items():
            if selected_days and dia not in selected_days:
                continue

            centros_cluster = modelo_cluster.cluster_centers_
            ventana_optima = None

            if centros_cluster.shape[0] > 0:
                centros_cluster = np.sort(centros_cluster.flatten())
                ventana_optima = None

                for centro in centros_cluster:
                    # Check if the ventana interferes with the individual student's schedule
                    if inicio_almuerzo <= centro <= fin_almuerzo and not any(periodo in horario_estudiante_individual for periodo in ["{}{}".format(int(centro), dia)]):
                        ventana_optima = centro
                        break

            if ventana_optima is None:
                # Si no se encuentra una ventana óptima para el día, utilizar una ventana de almuerzo por defecto
                ventana_optima = inicio_almuerzo + 0.5

            ventanas_optimas[dia] = ventana_optima

        return ventanas_optimas


def leer_horarios_estudiantes(archivo):
    with open(archivo, 'r') as file:
        data = json.load(file)
    return data

def formatear_tiempo(tiempo):
    horas = int(tiempo)
    minutos = int((tiempo - horas) * 60)
    return f"{horas:02}:{minutos:02}"

@app.route('/', methods=['POST'])
def execute_script():
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Ensure the 'schedules' key is present in the JSON data
        if 'schedules' not in data:
            return jsonify(error='Invalid JSON format. Missing "schedules" key.'), 400

        # Extract additional parameters (e.g., selected days) from the JSON data
        selected_days = data.get('selected_days')

        # Pass the student schedules and selected days to the OptimizadorHorarioAlmuerzo class
        horarios_estudiantes = data['schedules']
        optimizador_almuerzo = OptimizadorHorarioAlmuerzo(horarios_estudiantes)

        # Calculate optimal lunchtime windows for selected days
        modelos_clusters = optimizador_almuerzo.construir_modelos_clusters(selected_days)
        ventanas_optimas = optimizador_almuerzo.encontrar_ventanas_almuerzo_optimas(selected_days=selected_days)

        # Format the results before sending as a response
        formatted_results = format_results_for_response(ventanas_optimas)

        # Return the formatted result in the response
        return jsonify(result=formatted_results)

    except Exception as e:
        return jsonify(error=str(e)), 500

def format_results_for_response(ventanas_optimas):
    formatted_results = {}
    inicio_almuerzo = 12.30  # Define inicio_almuerzo here

    for dia, ventana in ventanas_optimas.items():
        if ventana is not None:
            hora_inicio_formateada = formatear_tiempo(max(inicio_almuerzo, ventana - 0.5))
            hora_fin_formateada = formatear_tiempo(min(ventana + 0.5, 14.30))
            formatted_results[dia] = f'{hora_inicio_formateada} - {hora_fin_formateada}'
        else:
            formatted_results[dia] = f'{dia}: No se encontró una ventana óptima para el almuerzo.'
    return formatted_results


if __name__ == "__main__":
    app.run(debug=True)
