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
import { Route, MapPin, Clock, Navigation } from "lucide-react";

interface RouteStop {
  id: string;
  stop_name: string;
  stop_order: number;
  estimated_arrival_offset?: number;
  latitude?: number;
  longitude?: number;
}

interface BusRoute {
  id: string;
  name: string;
  start_location: string;
  end_location: string;
  region: string;
  stops?: RouteStop[];
  // Add coordinates for start and end points
  start_lat?: number;
  start_lng?: number;
  end_lat?: number;
  end_lng?: number;
}

interface RouteMapProps {
  route: BusRoute;
  showStops?: boolean;
  showDirections?: boolean;
  height?: string;
  onStopSelect?: (stop: RouteStop) => void;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  route,
  showStops = true,
  showDirections = true,
  height = "500px",
  onStopSelect,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [stopMarkers, setStopMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );

  const createStopMarker = useCallback(
    (
      stop: RouteStop,
      map: google.maps.Map,
      isStart: boolean = false,
      isEnd: boolean = false
    ) => {
      if (!stop.latitude || !stop.longitude) return null;

      const position = { lat: stop.latitude, lng: stop.longitude };

      // Create custom marker icon for stops
      const getStopIcon = () => {
        if (isStart) {
          return {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            strokeWeight: 3,
            strokeColor: "#ffffff",
            fillColor: "#10b981", // Green for start
            fillOpacity: 1,
          };
        } else if (isEnd) {
          return {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            strokeWeight: 3,
            strokeColor: "#ffffff",
            fillColor: "#ef4444", // Red for end
            fillOpacity: 1,
          };
        } else {
          return {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            strokeWeight: 2,
            strokeColor: "#ffffff",
            fillColor: "#3b82f6", // Blue for regular stops
            fillOpacity: 1,
          };
        }
      };

      const marker = new google.maps.Marker({
        position,
        map,
        icon: getStopIcon(),
        title: stop.stop_name,
        label: {
          text: stop.stop_order.toString(),
          color: "white",
          fontSize: "12px",
          fontWeight: "bold",
        },
      });

      // Create info window content
      const infoContent = `
      <div class="p-3 min-w-[200px]">
        <div class="font-bold text-lg mb-2">${stop.stop_name}</div>
        <div class="space-y-1 text-sm">
          <div><strong>Stop Order:</strong> ${stop.stop_order}</div>
          ${
            stop.estimated_arrival_offset
              ? `<div><strong>ETA from start:</strong> ${stop.estimated_arrival_offset} minutes</div>`
              : ""
          }
          <div><strong>Type:</strong> 
            <span class="inline-block ml-1 px-2 py-1 rounded text-xs ${
              isStart
                ? "bg-green-100 text-green-800"
                : isEnd
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }">
              ${isStart ? "Start Point" : isEnd ? "End Point" : "Regular Stop"}
            </span>
          </div>
        </div>
      </div>
    `;

      marker.addListener("click", () => {
        if (infoWindow) {
          infoWindow.setContent(infoContent);
          infoWindow.open(map, marker);
        }
        onStopSelect?.(stop);
      });

      return marker;
    },
    [infoWindow, onStopSelect]
  );

  const loadDirections = useCallback(async () => {
    if (
      !map ||
      !directionsService ||
      !directionsRenderer ||
      !route.start_lat ||
      !route.start_lng ||
      !route.end_lat ||
      !route.end_lng
    ) {
      return;
    }

    const start = new google.maps.LatLng(route.start_lat, route.start_lng);
    const end = new google.maps.LatLng(route.end_lat, route.end_lng);

    // Create waypoints from stops (excluding start and end)
    const waypoints =
      route.stops
        ?.filter(
          (stop) =>
            stop.latitude &&
            stop.longitude &&
            stop.stop_order > 1 &&
            stop.stop_order < (route.stops?.length || 0)
        )
        .sort((a, b) => a.stop_order - b.stop_order)
        .map((stop) => ({
          location: new google.maps.LatLng(stop.latitude!, stop.longitude!),
          stopover: true,
        })) || [];

    try {
      const request: google.maps.DirectionsRequest = {
        origin: start,
        destination: end,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false, // Keep the order of stops
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      });
    } catch (error) {
      console.error("Error loading directions:", error);
    }
  }, [map, directionsService, directionsRenderer, route]);

  const createStopMarkers = useCallback(() => {
    if (!map || !route.stops) return;

    // Clear existing markers
    stopMarkers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Sort stops by order
    const sortedStops = [...route.stops].sort(
      (a, b) => a.stop_order - b.stop_order
    );

    sortedStops.forEach((stop, index) => {
      const isStart = index === 0;
      const isEnd = index === sortedStops.length - 1;
      const marker = createStopMarker(stop, map, isStart, isEnd);
      if (marker) {
        newMarkers.push(marker);
      }
    });

    setStopMarkers(newMarkers);

    // Fit map to show all stops
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      map.fitBounds(bounds);
    }
  }, [map, route.stops, createStopMarker, stopMarkers]);

  const handleMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);

      const directionsServiceInstance = new google.maps.DirectionsService();
      const directionsRendererInstance = new google.maps.DirectionsRenderer({
        draggable: false,
        suppressMarkers: showStops, // Hide default markers if we're showing custom stop markers
        polylineOptions: {
          strokeColor: "#3b82f6",
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });

      directionsRendererInstance.setMap(mapInstance);

      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);

      const infoWindowInstance = new google.maps.InfoWindow();
      setInfoWindow(infoWindowInstance);
    },
    [showStops]
  );

  useEffect(() => {
    if (showStops) {
      createStopMarkers();
    }
  }, [showStops, createStopMarkers]);

  useEffect(() => {
    if (showDirections) {
      loadDirections();
    }
  }, [showDirections, loadDirections]);

  // Calculate route center for initial map positioning
  const getRouteCenter = (): google.maps.LatLngLiteral => {
    if (route.start_lat && route.start_lng && route.end_lat && route.end_lng) {
      return {
        lat: (route.start_lat + route.end_lat) / 2,
        lng: (route.start_lng + route.end_lng) / 2,
      };
    }
    return { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                {route.name}
              </CardTitle>
              <CardDescription>
                {route.start_location} → {route.end_location}
              </CardDescription>
            </div>
            <Badge variant="outline">{route.region}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-sm">Start: {route.start_location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-red-600" />
              <span className="text-sm">End: {route.end_location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{route.stops?.length || 0} stops</span>
            </div>
          </div>

          {showStops && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Start Point
              </Badge>
              <Badge variant="secondary">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Regular Stop
              </Badge>
              <Badge variant="secondary">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                End Point
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <GoogleMap
        center={getRouteCenter()}
        zoom={12}
        onMapLoad={handleMapLoad}
        style={{ height }}
        className="rounded-lg border"
      />
    </div>
  );
};

export default RouteMap;
