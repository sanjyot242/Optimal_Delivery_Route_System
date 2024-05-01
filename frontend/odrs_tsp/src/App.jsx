import React from 'react';
import { useState } from 'react';
import MapView from './components/MapView';
import AddLocationForm from './components/AddLocationForm';

function App() {
  const [markers, setMarkers] = useState([
    { position: [33.8823, -117.8851], details: 'Initial Marker 1' },
    // { position: [51.515, -0.10], details: 'Initial Marker 2' }
  ]);
  const [geoJsonRoute, setGeoJsonRoute] = useState({
    type: 'FeatureCollection',
    features: [],
  });

  const [optimizedOrder, setOptimizedOrder] = useState(null);

  const [algorithm, setAlgorithm] = useState('brute_force'); // Initial algorithm selection

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
  };

  const handleAddLocation = (newMarker) => {
    setMarkers([...markers, newMarker]);
  };

  const handleOptimizeRoute = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/optimize-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points: markers.map((marker) => ({
            lat: marker.position[0],
            lon: marker.position[1],
            location: marker.details,
          })),
          algorithm: algorithm,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      if (data.success) {
        //setRoute(data.route);
        setOptimizedOrder(data.points);
        const validGeoJson = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: data.route,
            },
          ],
        };
        setGeoJsonRoute(validGeoJson);
        console.log('GeoJSON Route set:', validGeoJson);
      } else {
        throw new Error(data.error || 'Route optimization failed');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  // async function handleGetOptimalRoute() {
  //   try {
  //       const response = await fetch('/api/optimize-route', {
  //           method: 'POST',
  //           headers: {
  //               'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ points: markers }),
  //       });
  //       if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       if (data.success) {
  //           setGeoJsonRoute(data.route);  // Assuming you have a state hook for storing the GeoJSON data
  //       } else {
  //           console.error('Failed to fetch route:', data.error);
  //       }
  //   } catch (error) {
  //       console.error('Error fetching route:', error);
  //   }
  // }

  return (
    <div className='App bg-gray-100 min-h-screen'>
      <header className='bg-blue-500 text-white p-4 text-xl'>
        Delivery Route Optimization
      </header>
      <div className='p-4'>
        <AddLocationForm onSubmit={handleAddLocation} />
      </div>

      <div className='flex flex-col w-full px-6'>
        <div className='flex justify-between'>
          <label className='inline-flex items-center'>
            <input
              type='radio'
              name='algorithm'
              value='brute_force'
              checked={algorithm === 'brute_force'}
              onChange={handleAlgorithmChange}
            />
            <span className='ml-2'>Brute Force</span>
          </label>
          <label className='inline-flex items-center'>
            <input
              type='radio'
              name='algorithm'
              value='genetic_algo'
              checked={algorithm === 'genetic_algo'}
              onChange={handleAlgorithmChange}
            />
            <span className='ml-2'>Genetic Algo</span>
          </label>
          <label className='inline-flex items-center'>
            <input
              type='radio'
              name='algorithm'
              value='nearest_neighbor'
              checked={algorithm === 'nearest_neighbor'}
              onChange={handleAlgorithmChange}
            />
            <span className='ml-2'>Nearest Neighbour</span>
          </label>
          <label className='inline-flex items-center'>
            <input
              type='radio'
              name='algorithm'
              value='ant_colony'
              checked={algorithm === 'ant_colony'}
              onChange={handleAlgorithmChange}
            />
            <span className='ml-2'>Ant Colony</span>
          </label>
          <button
            onClick={handleOptimizeRoute}
            className='my-4 p-2 bg-green-500 text-white'>
            Get Optimal Route
          </button>
        </div>
      </div>

      <MapView
        markers={markers}
        route={geoJsonRoute}
        sidebar={optimizedOrder}
      />
    </div>
  );
}

export default App;
