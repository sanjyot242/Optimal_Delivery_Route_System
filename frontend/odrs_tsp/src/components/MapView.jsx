import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import RouteSidebar from './RouteSidebar';
import PolylineWithArrows from './PolyLineWithArrows';
import { GeoJSON } from 'react-leaflet';

function MapView({ markers, route, sidebar }) {
    // Default position either focuses on the first route point, or a default position if no route or markers
    const defaultPosition = [33.8823, -117.8851];

   // console.log(geoJsonRoute);
    console.log("route"+JSON.stringify(sidebar));
    return (
        <>
            <RouteSidebar route={sidebar} />
            <MapContainer center={defaultPosition} zoom={13} style={{ height: '500px', width: 'calc(100% - 250px)', marginLeft: '250px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {markers.map((marker, idx) => (
                    <Marker key={idx} position={marker.position}>
                        <Popup>{marker.details}</Popup>
                    </Marker>
                ))}
                {/* Render the route polyline only if there is a route */}
                {/* {route.length > 0 && (
                    <PolylineWithArrows positions={route.map(point => [point.lat, point.lon])} />
                )} */}
                {route && route.features && route.features.length > 0 && (
    <GeoJSON
        data={route}
        style={{ color: '#3388ff', weight: 4, opacity: 0.5 }}
    />
)}
            </MapContainer>
        </>
    );
}


export default MapView;
