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
  type: "FeatureCollection",
  features: []
});

const [optimizedOrder,setOptimizedOrder] = useState(null);

const handleAddLocation = (newMarker) => {
  setMarkers([...markers, newMarker]);
};

const handleOptimizeRoute = async () => {
  try {
      const response = await fetch('http://127.0.0.1:5000/api/optimize-route', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({points: markers.map(marker => ({
              lat: marker.position[0],
              lon: marker.position[1]
          }))},),
      });
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      if (data.success) {
         //setRoute(data.route);
       setOptimizedOrder(data.points)
         const validGeoJson = {
          type: "FeatureCollection",
          features: [
              {
                  type: "Feature",
                  properties: {},
                  geometry: data.route
              }
          ]
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
  <div className="App bg-gray-100 min-h-screen">
      <header className="bg-blue-500 text-white p-4 text-xl">
          Delivery Route Optimization
      </header>
      <div className="p-4">
          <AddLocationForm onSubmit={handleAddLocation} />
          <button onClick={handleOptimizeRoute} className="my-4 p-2 bg-green-500 text-white">
                    Get Optimal Route
                </button>
                <MapView markers={markers} route={geoJsonRoute}  sidebar = {optimizedOrder}/>
      </div>
  </div>
);
}




export default App;
