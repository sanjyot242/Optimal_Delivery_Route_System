import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapView({ markers }){
    const position = [33.8704, -117.9242]; // Default position (London)

    return (
        <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers.map((marker, idx) => (
                <Marker key={idx} position={marker.position}>
                    <Popup>{marker.details}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;
