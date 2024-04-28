import React from 'react';
import { useState } from 'react';
import MapView from './components/MapView';
import AddLocationForm from './components/AddLocationForm';

function App() {
  const [markers, setMarkers] = useState([
    { position: [33.8823, -117.8851], details: 'Initial Marker 1' },
   // { position: [51.515, -0.10], details: 'Initial Marker 2' }
]);

const handleAddLocation = (newMarker) => {
  setMarkers([...markers, newMarker]);
};
return (
  <div className="App bg-gray-100 min-h-screen">
      <header className="bg-blue-500 text-white p-4 text-xl">
          Delivery Route Optimization
      </header>
      <div className="p-4">
          <AddLocationForm onSubmit={handleAddLocation} />
          <MapView markers={markers} />
      </div>
  </div>
);
}




export default App;
