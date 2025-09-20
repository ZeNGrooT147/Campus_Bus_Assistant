import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  onMapLoad?: (map: google.maps.Map) => void;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 }; // Bangalore coordinates
const DEFAULT_ZOOM = 13;

export const GoogleMap: React.FC<GoogleMapProps> = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onMapLoad,
  style = { height: "400px", width: "100%" },
  className = "",
  children,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        console.log("Initializing Google Maps...");
        console.log("Environment:", {
          isDev: import.meta.env.DEV,
          isProd: import.meta.env.PROD,
          mode: import.meta.env.MODE,
          hasApiKey: !!apiKey,
        });

        if (!apiKey) {
          const errorMsg =
            "Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.";
          console.error(errorMsg);
          setError(errorMsg);
          return;
        }

        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places", "geometry"],
        });

        console.log("Loading Google Maps API...");
        await loader.load();
        console.log("Google Maps API loaded successfully");

        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "on" }],
              },
              {
                featureType: "transit",
                elementType: "all",
                stylers: [{ visibility: "on" }],
              },
            ],
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
          });

          setMap(mapInstance);
          onMapLoad?.(mapInstance);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load Google Maps"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, [center.lat, center.lng, zoom, onMapLoad]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg ${className}`}
        style={style}
      >
        <div className="text-center p-4">
          <div className="text-red-600 font-semibold mb-2">
            Google Maps Error
          </div>
          <div className="text-sm text-gray-600">{error}</div>
          <div className="text-xs text-gray-500 mt-2">
            Please check your API key configuration
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg ${className}`}
        style={style}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-sm text-gray-600">Loading Maps...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {children && map && (
        <div className="absolute inset-0 pointer-events-none">{children}</div>
      )}
    </div>
  );
};

export default GoogleMap;
