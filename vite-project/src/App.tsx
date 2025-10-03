import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          // Base OpenStreetMap layer
          "osm-tiles": {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm-tiles",
            paint: {},
          },
        ],
      },
      center: [0, 0], // [longitude, latitude]
      zoom: 2,
    });

    // Add zoom and rotation controls
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      "top-right"
    );

    // Add a SAR tile overlay (replace with your SAR tile service URL)
    map.on("load", () => {
      map.addSource("sar-tiles", {
        type: "raster",
        tiles: [
          // Example placeholder — replace with your SAR tiles (XYZ endpoint)
          "https://your-server.com/sar_tiles/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
      });

      map.addLayer({
        id: "sar-layer",
        type: "raster",
        source: "sar-tiles",
        paint: {
          "raster-opacity": 0.7, // adjust transparency
        },
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: "100vw", height: "100vh" }} />;
}
