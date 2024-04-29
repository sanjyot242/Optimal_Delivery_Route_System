import React from "react";
// Include this sidebar within your main map component to list the route details
function RouteSidebar  ({ route }) {
    console.log(route);
    return (
    <div className="absolute top-0 my-60 left-0 z-10 h-screen w-64  bg-white overflow-auto p-4">
        <h3 className="text-lg font-bold mb-4">Route Details</h3>
        <ol className="list-decimal list-inside">
            {route && route.map((point, index) => (
                <li key={index} className="mb-2">
                    {`Stop ${index + 1}: ${point.lat} , ${point.lon}`} {/* Modify according to your point structure */}
                </li>
            ))}
        </ol>
    </div>
    )
};

export default RouteSidebar;



// import React, { useState, useEffect } from "react";
// import axios from 'axios';

// function RouteSidebar({ route }) {
//     const [locations, setLocations] = useState([]);

//     useEffect(() => {
//         if (route && route.length > 0) {
//             const fetchLocations = async () => {
//                 const apiKey = "pk.564efef458e2028c3da6e7772f0ae570"; // Place your API key here
//                 const promises = route.map(point =>
//                     axios.get(`https://eu1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${point.lat}&lon=${point.lon}&format=json&`)
//                 );
                
//                 try {
//                     const results = await Promise.all(promises);
//                     console.log(results);
//                     const names = results.map(res => res.data.display_name || "Name not found");
//                     setLocations(names);
//                 } catch (error) {
//                     console.error('Error fetching location names:', error);
//                     setLocations(route.map(() => "Error fetching name"));
//                 }
//             };
//             fetchLocations();
//         }
//     }, [route]); // Run this effect whenever the route changes

//     return (
//         <div className="absolute top-0 my-60 left-0 z-10 h-screen w-64 bg-white overflow-auto p-4">
//             <h3 className="text-lg font-bold mb-4">Route Details</h3>
//             <ol className="list-decimal list-inside">
//                 {locations.length > 0 && locations.map((name, index) => (
//                     <li key={index} className="mb-2">
//                         {`Stop ${index + 1}: ${name}`} {/* Display location names */}
//                     </li>
//                 ))}
//             </ol>
//         </div>
//     );
// };

// export default RouteSidebar;
