import { Polyline, useMap } from 'react-leaflet';
import React from 'react';
import L from 'leaflet';
import 'leaflet-polylinedecorator';

function PolylineWithArrows({ positions }) {
    const map = useMap();

    // Create the polyline and the decorator after the component mounts
    React.useEffect(() => {
        const polyline = L.polyline(positions).addTo(map);

        const arrowHead = L.polylineDecorator(polyline, {
            patterns: [
                { offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 15, polygon: false, pathOptions: { stroke: true } }) }
            ]
        }).addTo(map);

        return () => {
            // Cleanup on unmount
            arrowHead.remove();
            polyline.remove();
        };
    }, [map, positions]);

    return null;
}

export default PolylineWithArrows;
