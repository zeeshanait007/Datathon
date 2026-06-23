"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import to avoid SSR window issues with leaflet
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(mod => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export default function HotspotMap() {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    // Fix Leaflet marker icons in Next.js
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
        iconUrl: require("leaflet/dist/images/marker-icon.png").default,
        shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
      });
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/hotspots?limit=100`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setLocations(data);
        } else {
          // Fallback dummy
          setLocations([
            { id: 1, latitude: 12.9716, longitude: 77.5946, address: "Bangalore Central" },
            { id: 2, latitude: 12.9352, longitude: 77.6245, address: "Koramangala" },
            { id: 3, latitude: 12.9784, longitude: 77.6408, address: "Indiranagar" },
          ]);
        }
      })
      .catch(() => {
        setLocations([
          { id: 1, latitude: 12.9716, longitude: 77.5946, address: "Bangalore Central" },
          { id: 2, latitude: 12.9352, longitude: 77.6245, address: "Koramangala" },
          { id: 3, latitude: 12.9784, longitude: 77.6408, address: "Indiranagar" },
        ]);
      });
  }, []);

  return (
    <div style={{ height: "600px", width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}>
      <MapContainer center={[12.9716, 77.5946]} zoom={12} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {locations.map((loc) => (
          <CircleMarker
            key={loc.id}
            center={[loc.latitude, loc.longitude]}
            radius={8}
            pathOptions={{ color: 'red', fillColor: '#f03', fillOpacity: 0.5 }}
          >
            <Popup>
              <strong>Crime Location</strong><br/>
              {loc.address}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
