from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import math
import itertools
import requests
import random

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5173","http://127.0.0.1:5173"], supports_credentials=True, methods=["*"], allow_headers=["*"])

####################### HELPER FUNTIONS PART#########################
def distance(point1, point2):
    # Ensure latitude and longitude are floats
    lat1 = float(point1['lat'])
    lon1 = float(point1['lon'])
    lat2 = float(point2['lat'])
    lon2 = float(point2['lon'])
    
    return math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2)

def total_distance(route):
    # Calculate the total distance of a route
    total = 0
    for i in range(len(route) - 1):
        total += distance(route[i], route[i+1])
    total += distance(route[-1], route[0])  # Complete the loop
    return total

def create_initial_population(points, population_size):
    # Create an initial population of routes
    initial_population = [random.sample(points, len(points)) for _ in range(population_size)]
    return initial_population

def crossover(parent1, parent2):
    # Perform crossover to generate offspring
    crossover_point = random.randint(0, len(parent1) - 1)
    offspring = parent1[:crossover_point]
    for gene in parent2:
        if gene not in offspring:
            offspring.append(gene)
    return offspring

def mutate(route, mutation_rate):
    # Perform mutation by swapping two cities in the route
    if random.random() < mutation_rate:
        idx1, idx2 = random.sample(range(len(route)), 2)
        route[idx1], route[idx2] = route[idx2], route[idx1]
    return route

####################### ALGORITHM FOR TSP PART#########################
def nearest_neighbor(points):
    if not points:
        return []

    # Convert all points to ensure latitude and longitude are floats
    sanitized_points = [{'lat': float(point['lat']), 'lon': float(point['lon']), 'location': point['location']} for point in points]

    # Start with the first point
    route = [sanitized_points[0]]
    unvisited = sanitized_points[1:]

    while unvisited:
        last = route[-1]
        next_point = min(unvisited, key=lambda point: distance(last, point))
        route.append(next_point)
        unvisited.remove(next_point)

    return route

def brute_force(points):
    if len(points) <= 1:
        return points

    # Generate all possible permutations of points
    all_permutations = itertools.permutations(points)

    # Initialize variables to store the best route and its distance
    best_route = None
    best_distance = float('inf')

    # Iterate through all permutations and calculate their distances
    for permutation in all_permutations:
        distance = total_distance(permutation)
        if distance < best_distance:
            best_distance = distance
            best_route = permutation

    return best_route

def genetic(points, population_size, generations, mutation_rate):
    population = create_initial_population(points, population_size)
    for _ in range(generations):
        # Select top performers for reproduction
        population.sort(key=lambda x: total_distance(x))
        selected_parents = population[:population_size // 2]
        
        # Create offspring through crossover
        offspring = []
        for i in range(len(selected_parents) - 1):
            offspring.append(crossover(selected_parents[i], selected_parents[i+1]))
        
        # Mutate offspring
        mutated_offspring = [mutate(route, mutation_rate) for route in offspring]
        
        # Replace the weakest individuals in the population with the offspring
        population = selected_parents + mutated_offspring
    
    # Select the best route from the final population
    best_route = min(population, key=lambda x: total_distance(x))
    return best_route

def ant_colony(points, num_ants, num_iterations, evaporation_rate, alpha, beta):
    num_cities = len(points)
    pheromone = [[1 / (num_cities * num_cities) for _ in range(num_cities)] for _ in range(num_cities)]
    best_route = None
    best_distance = float('inf')

    for _ in range(num_iterations):
        for ant in range(num_ants):
            visited = [False] * num_cities
            route = []
            current_city = random.randint(0, num_cities - 1)
            visited[current_city] = True
            route.append(current_city)

            for _ in range(num_cities - 1):
                probabilities = [0] * num_cities
                denominator = 0
                for i in range(num_cities):
                    if not visited[i]:
                        probabilities[i] = (pheromone[current_city][i] ** alpha) * ((1 / distance(points[current_city], points[i])) ** beta)
                        denominator += probabilities[i]
                probabilities = [prob / denominator for prob in probabilities]
                next_city = random.choices(range(num_cities), weights=probabilities)[0]
                visited[next_city] = True
                route.append(next_city)
                current_city = next_city

            # Calculate distance of the route
            total_distance = sum(distance(points[route[i]], points[route[i+1]]) for i in range(num_cities - 1))
            total_distance += distance(points[route[-1]], points[route[0]])

            # Update best route
            if total_distance < best_distance:
                best_distance = total_distance
                best_route = route

        # Update pheromone levels
        for i in range(num_cities):
            for j in range(num_cities):
                pheromone[i][j] *= (1 - evaporation_rate)
        for i in range(num_cities - 1):
            pheromone[best_route[i]][best_route[i+1]] += 1 / best_distance
        pheromone[best_route[-1]][best_route[0]] += 1 / best_distance

    best_route = [points[idx] for idx in best_route]
    return best_route

####################### API END POINT PART#########################
@app.route('/api/optimize-route', methods=['POST'])
@cross_origin() 
def optimize_route():
    data = request.get_json()

    #print ("data req",data)
    points = data.get('points', [])
    algorithm = data.get('algorithm', 'brute_force') #defaults to brute force 
    #print ("data points",points)

    # Validate and convert data
    if any('lat' not in point or 'lon' not in point for point in points):
        return jsonify({'error': 'Missing lat or lon in some points', 'success': False}), 400
    
    if any(isinstance(point['lat'], str) or isinstance(point['lon'], str) for point in points):
        try:
            points = [{'lat': float(point['lat']), 'lon': float(point['lon']), 'location': point['location']} for point in points]
        except ValueError:
            return jsonify({'error': 'Invalid coordinate format', 'success': False}), 400
    
    # optimized_route_nearest = nearest_neighbor(points)

    # optimized_route_brute = brute_force(points)

    # optimized_route_genetic = genetic(points, population_size=100, generations=100, mutation_rate=0.1)

    # optimized_route_colony = ant_colony(points, num_ants=10, num_iterations=100, evaporation_rate=0.1, alpha=1, beta=2)
    
    # optimized_route = brute_force(points)

    # print("optimized_route_nearest points", optimized_route_nearest)
    
    # print("optimized_route_genetic points", optimized_route_genetic)

    # print("optimized_route_brute points", optimized_route_brute)

    # print("optimized_route_colony points", optimized_route_colony)
    
    # print("optimised_brute",optimized_route)


    if algorithm.lower() == 'brute_force':
        optimized_route = brute_force(points)
    elif algorithm.lower() == 'genetic_algo':
        optimized_route = genetic(points, population_size=100, generations=100, mutation_rate=0.1)
    elif algorithm.lower() == 'nearest_neighbor':
        optimized_route = nearest_neighbor(points)
    elif algorithm.lower() == 'ant_colony':
        optimized_route = ant_colony(points, num_ants=10, num_iterations=100, evaporation_rate=0.1, alpha=1, beta=2)
    else:
        return jsonify({'error': 'Invalid algorithm specified', 'success': False}), 400

    print("Selected Alog",algorithm)
    print("Optimized Route Returned from Algorithm",optimized_route)

    coordinates = ';'.join([f"{point['lon']},{point['lat']}" for point in optimized_route])
    locationiq_url = f"https://eu1.locationiq.com/v1/directions/driving/{coordinates}"
    locationiq_params = {
        'key': 'pk.564efef458e2028c3da6e7772f0ae570', # Put your LocationIQ API Key here
        'overview': 'full',
        'geometries': 'geojson'
    }

    # Fetch the route from the LocationIQ API
    route_response = requests.get(locationiq_url, params=locationiq_params)
    if route_response.status_code == 200:
        route_data = route_response.json()
        #print(route_data)
        return jsonify({'route': route_data['routes'][0]['geometry'],'points':optimized_route, 'success': True , })
    else:
        return jsonify({'error': 'Failed to fetch route from LocationIQ', 'success': False}), 500
    #return jsonify({'route': optimized_route, 'success': True})
    
if __name__ == '__main__':
    app.run(debug=True, port=5001)
