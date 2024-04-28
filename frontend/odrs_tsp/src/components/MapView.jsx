import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapView({ markers,route }){
    
    // If there are no markers, we set a default position.
    const defaultPosition = [33.8823, -117.8851]; // Coordinates for London, can be any default you prefer.
    
    // Determine the center of the map.
    // If there are route markers, use the first marker's position.
    // If there are no route markers but there are initial markers, use the first initial marker's position.
    // If there are no markers at all, use the default position.
    const centerPosition = route.length > 0 ? route[0].position :
                          markers.length > 0 ? markers[0].position :
                          defaultPosition;

                          return (
                            <MapContainer center={defaultPosition} zoom={13} style={{ height: '500px', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {markers.map((marker, idx) => (
                                    <Marker key={idx} position={marker.position}>
                                        <Popup>{marker.details}</Popup>
                                    </Marker>
                                ))}
                                {route && route.length > 1 && <Polyline positions={route.map(point => [point.lat, point.lon])} />}
                            </MapContainer>
                        );
};


export default MapView;
