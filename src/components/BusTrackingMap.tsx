import { useEffect, useState, useCallback } from "react";
import GoogleMap from "./GoogleMap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { RefreshCw, MapPin, Navigation } from "lucide-react";

interface Bus {
  id: string;
  bus_number: string;
  status: string;
  driver_name?: string;
  current_location?: string;
  capacity: number;
  region: string;
  // Add these for real-time tracking
  latitude?: number;
  longitude?: number;
  last_updated?: string;
}

interface BusTrackingMapProps {
  buses?: Bus[];
  selectedBusId?: string;
  onBusSelect?: (busId: string) => void;
  showControls?: boolean;
  height?: string;
  center?: google.maps.LatLngLiteral;
}

export const BusTrackingMap: React.FC<BusTrackingMapProps> = ({
  buses = [],
  selectedBusId,
  onBusSelect,
  showControls = true,
  height = "500px",
  center,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<Map<string, google.maps.Marker>>(
    new Map()
  );
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );
  const [isTracking, setIsTracking] = useState(false);

  // Default to Bangalore coordinates if no center provided
  const defaultCenter = center || { lat: 12.9716, lng: 77.5946 };

  const createBusMarker = useCallback(
    (bus: Bus, map: google.maps.Map) => {
      if (!bus.latitude || !bus.longitude) return null;

      const position = { lat: bus.latitude, lng: bus.longitude };

      // Create custom marker icon based on bus status
      const getMarkerIcon = (status: string) => {
        const baseIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          strokeWeight: 3,
          strokeColor: "#ffffff",
          fillOpacity: 1,
        };

        switch (status.toLowerCase()) {
          case "active":
          case "in_service":
            return { ...baseIcon, fillColor: "#10b981" }; // Green
          case "available":
            return { ...baseIcon, fillColor: "#3b82f6" }; // Blue
          case "maintenance":
            return { ...baseIcon, fillColor: "#f59e0b" }; // Yellow
          case "out_of_service":
            return { ...baseIcon, fillColor: "#ef4444" }; // Red
          default:
            return { ...baseIcon, fillColor: "#6b7280" }; // Gray
        }
      };

      const marker = new google.maps.Marker({
        position,
        map,
        icon: getMarkerIcon(bus.status),
        title: `Bus ${bus.bus_number}`,
        animation:
          bus.id === selectedBusId ? google.maps.Animation.BOUNCE : undefined,
      });

      // Create info window content
      const infoContent = `
      <div class="p-3 min-w-[200px]">
        <div class="font-bold text-lg mb-2">Bus ${bus.bus_number}</div>
        <div class="space-y-1 text-sm">
          <div><strong>Status:</strong> 
            <span class="inline-block ml-1 px-2 py-1 rounded text-xs ${
              bus.status === "active" || bus.status === "in_service"
                ? "bg-green-100 text-green-800"
                : bus.status === "available"
                ? "bg-blue-100 text-blue-800"
                : bus.status === "maintenance"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }">
              ${bus.status}
            </span>
          </div>
          <div><strong>Driver:</strong> ${
            bus.driver_name || "Not assigned"
          }</div>
          <div><strong>Capacity:</strong> ${bus.capacity} passengers</div>
          <div><strong>Region:</strong> ${bus.region}</div>
          ${
            bus.last_updated
              ? `<div><strong>Last Updated:</strong> ${new Date(
                  bus.last_updated
                ).toLocaleTimeString()}</div>`
              : ""
          }
        </div>
      </div>
    `;

      marker.addListener("click", () => {
        if (infoWindow) {
          infoWindow.setContent(infoContent);
          infoWindow.open(map, marker);
        }
        onBusSelect?.(bus.id);
      });

      return marker;
    },
    [selectedBusId, onBusSelect, infoWindow]
  );

  const updateMarkers = useCallback(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers = new Map<string, google.maps.Marker>();

    // Create new markers for buses with location data
    buses.forEach((bus) => {
      const marker = createBusMarker(bus, map);
      if (marker) {
        newMarkers.set(bus.id, marker);
      }
    });

    setMarkers(newMarkers);

    // Fit map to show all buses if there are any
    if (newMarkers.size > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      map.fitBounds(bounds);
    }
  }, [map, buses, createBusMarker, markers]);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    const infoWindowInstance = new google.maps.InfoWindow();
    setInfoWindow(infoWindowInstance);
  }, []);

  const handleRefresh = () => {
    setIsTracking(true);
    // In a real app, this would trigger a data refresh
    setTimeout(() => {
      setIsTracking(false);
      updateMarkers();
    }, 1000);
  };

  const centerOnBus = (busId: string) => {
    const bus = buses.find((b) => b.id === busId);
    if (bus && bus.latitude && bus.longitude && map) {
      map.panTo({ lat: bus.latitude, lng: bus.longitude });
      map.setZoom(16);

      // Trigger marker click to show info
      const marker = markers.get(busId);
      if (marker) {
        google.maps.event.trigger(marker, "click");
      }
    }
  };

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  useEffect(() => {
    // Update selected bus marker animation
    markers.forEach((marker, busId) => {
      marker.setAnimation(
        busId === selectedBusId ? google.maps.Animation.BOUNCE : null
      );
    });
  }, [selectedBusId, markers]);

  return (
    <div className="space-y-4">
      {showControls && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Bus Tracking
                </CardTitle>
                <CardDescription>
                  Real-time location tracking for {buses.length} buses
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isTracking}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isTracking ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Active/In Service
              </Badge>
              <Badge variant="secondary">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Available
              </Badge>
              <Badge variant="secondary">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Maintenance
              </Badge>
              <Badge variant="secondary">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Out of Service
              </Badge>
            </div>

            {buses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {buses.slice(0, 6).map((bus) => (
                  <Button
                    key={bus.id}
                    variant={selectedBusId === bus.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => centerOnBus(bus.id)}
                    className="justify-start"
                  >
                    <Navigation className="h-3 w-3 mr-2" />
                    Bus {bus.bus_number}
                    <Badge variant="secondary" className="ml-auto">
                      {bus.status}
                    </Badge>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <GoogleMap
        center={defaultCenter}
        zoom={13}
        onMapLoad={handleMapLoad}
        style={{ height }}
        className="rounded-lg border"
      />
    </div>
  );
};

export default BusTrackingMap;
