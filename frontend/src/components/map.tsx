"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
export default function HotspotMap() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapId] = useState(() => `map-${new Date().getTime()}`);

  useEffect(() => {


    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-50043365852.development.catalystappsail.in'}/api/hotspots?limit=100`)
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ height: "600px", width: "100%", borderRadius: "0.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(15, 23, 42, 0.2)" }}>
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-indigo-500" />
        <p className="text-slate-500">Mapping geospatial coordinates...</p>
      </div>
    );
  }

  return (
    <div style={{ height: "600px", width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}>
      <MapContainer key={mapId} center={[12.9716, 77.5946]} zoom={12} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {locations.map((loc, index) => (
          <CircleMarker
            key={loc.id || `loc-${index}`}
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
