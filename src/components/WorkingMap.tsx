import { useEffect, useRef } from "react";

interface WorkingMapProps {
  buses: Array<{
    id: string;
    bus_number: string;
    status: string;
    latitude?: number;
    longitude?: number;
    driver_name?: string;
    capacity: number;
  }>;
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const WorkingMap: React.FC<WorkingMapProps> = ({ buses }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      return new Promise<void>((resolve) => {
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }&libraries=places,geometry&loading=async&callback=initMap`;
        script.async = true;
        script.defer = true;

        window.initMap = () => {
          resolve();
        };

        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      if (!mapRef.current) return;

      await loadGoogleMaps();

      // Create the map
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 15.3647, lng: 75.124 }, // Dharwad
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Add markers for each bus using the updated approach
      buses.forEach((bus) => {
        if (bus.latitude && bus.longitude) {
          const marker = new google.maps.Marker({
            position: { lat: bus.latitude, lng: bus.longitude },
            map: map,
            title: `Bus ${bus.bus_number} - ${bus.status}`,
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="12" fill="${
                    bus.status === "active"
                      ? "#10b981"
                      : bus.status === "maintenance"
                      ? "#f59e0b"
                      : "#ef4444"
                  }" stroke="white" stroke-width="2"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-family="Arial">🚌</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
            },
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #333;">🚌 Bus ${
                  bus.bus_number
                }</h3>
                <p style="margin: 4px 0; color: #666;"><strong>Status:</strong> 
                  <span style="color: ${
                    bus.status === "active"
                      ? "#10b981"
                      : bus.status === "maintenance"
                      ? "#f59e0b"
                      : "#ef4444"
                  };">
                    ${bus.status.toUpperCase()}
                  </span>
                </p>
                <p style="margin: 4px 0; color: #666;"><strong>Driver:</strong> ${
                  bus.driver_name || "Unassigned"
                }</p>
                <p style="margin: 4px 0; color: #666;"><strong>Capacity:</strong> ${
                  bus.capacity
                } passengers</p>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        }
      });
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Load Google Maps script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places,geometry`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [buses]);

  return (
    <div
      ref={mapRef}
      style={{
        height: "500px",
        width: "100%",
        backgroundColor: "#f0f0f0", // Fallback background
      }}
      className="rounded-lg border"
    />
  );
};

export default WorkingMap;
