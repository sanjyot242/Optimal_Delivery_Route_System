from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import math
import requests



app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5173","http://127.0.0.1:5173"], supports_credentials=True, methods=["*"], allow_headers=["*"])

def distance(point1, point2):
    # Ensure latitude and longitude are floats
    lat1 = float(point1['lat'])
    lon1 = float(point1['lon'])
    lat2 = float(point2['lat'])
    lon2 = float(point2['lon'])
    
    return math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2)

def nearest_neighbor(points):
    if not points:
        return []

    # Convert all points to ensure latitude and longitude are floats
    sanitized_points = [{'lat': float(point['lat']), 'lon': float(point['lon'])} for point in points]

    # Start with the first point
    route = [sanitized_points[0]]
    unvisited = sanitized_points[1:]

    while unvisited:
        last = route[-1]
        next_point = min(unvisited, key=lambda point: distance(last, point))
        route.append(next_point)
        unvisited.remove(next_point)

    return route

@app.route('/api/optimize-route', methods=['POST'])
@cross_origin() 
def optimize_route():
    data = request.get_json()

    #print ("data req",data)
    points = data.get('points', [])

    # Validate and convert data
    if any('lat' not in point or 'lon' not in point for point in points):
        return jsonify({'error': 'Missing lat or lon in some points', 'success': False}), 400
    
    if any(isinstance(point['lat'], str) or isinstance(point['lon'], str) for point in points):
        try:
            points = [{'lat': float(point['lat']), 'lon': float(point['lon'])} for point in points]
        except ValueError:
            return jsonify({'error': 'Invalid coordinate format', 'success': False}), 400
    
    optimized_route = nearest_neighbor(points)

    print("optimized points",optimized_route)
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
