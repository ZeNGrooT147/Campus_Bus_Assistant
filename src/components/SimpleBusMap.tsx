import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface SimpleBusMapProps {
  buses: Array<{
    id: string;
    bus_number: string;
    status: string;
    latitude?: number;
    longitude?: number;
    driver_name?: string;
    capacity: number;
  }>;
  height?: string;
}

const SimpleBusMap: React.FC<SimpleBusMapProps> = ({
  buses,
  height = "400px",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
          throw new Error("Google Maps API key not found");
        }

        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places", "geometry"], // Match the other components
        });

        await loader.load();

        if (mapRef.current) {
          // Center map on Dharwad
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 15.3647, lng: 75.124 },
            zoom: 13,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "on" }],
              },
            ],
          });

          // Add bus markers
          buses.forEach((bus) => {
            if (bus.latitude && bus.longitude) {
              const marker = new google.maps.Marker({
                position: { lat: bus.latitude, lng: bus.longitude },
                map: map,
                title: `Bus ${bus.bus_number}`,
                icon: {
                  url: `data:image/svg+xml;charset=UTF-8,%3csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='15' fill='%23${
                    bus.status === "active"
                      ? "10b981"
                      : bus.status === "maintenance"
                      ? "f59e0b"
                      : "ef4444"
                  }' stroke='white' stroke-width='3'/%3e%3ctext x='20' y='26' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3e🚌%3c/text%3e%3c/svg%3e`,
                  scaledSize: new google.maps.Size(40, 40),
                  anchor: new google.maps.Point(20, 20),
                },
              });

              const infoWindow = new google.maps.InfoWindow({
                content: `
                  <div style="padding: 8px;">
                    <h3 style="margin: 0 0 8px 0; font-weight: bold;">Bus ${
                      bus.bus_number
                    }</h3>
                    <p style="margin: 4px 0;"><strong>Status:</strong> ${
                      bus.status
                    }</p>
                    <p style="margin: 4px 0;"><strong>Driver:</strong> ${
                      bus.driver_name || "Unassigned"
                    }</p>
                    <p style="margin: 4px 0;"><strong>Capacity:</strong> ${
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
          setIsLoading(false);
        } else {
          throw new Error("Map container not found");
        }
      } catch (error) {
        console.error("SimpleBusMap Error:", error);
        setError(error instanceof Error ? error.message : "Failed to load map");
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure the ref is ready
    const timeoutId = setTimeout(() => {
      initMap();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [buses]);

  if (error) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-gray-100 border rounded-lg"
      >
        <div className="text-center p-4">
          <p className="text-red-600 font-medium">Failed to load map</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-gray-100 border rounded-lg"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%" }}
      className="rounded-lg border"
    />
  );
};

export default SimpleBusMap;
