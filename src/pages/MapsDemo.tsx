import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GoogleMap from "@/components/GoogleMap";
import BusTrackingMap from "@/components/BusTrackingMap";
import RouteMap from "@/components/RouteMap";
import { MapPin, Route, Navigation, Info } from "lucide-react";

// Sample data for demonstration
const sampleBuses = [
  {
    id: "1",
    bus_number: "KB-001",
    status: "active",
    driver_name: "John Doe",
    capacity: 50,
    region: "North Campus",
    latitude: 12.9716,
    longitude: 77.5946,
    last_updated: new Date().toISOString(),
  },
  {
    id: "2",
    bus_number: "KB-002",
    status: "available",
    driver_name: "Jane Smith",
    capacity: 45,
    region: "South Campus",
    latitude: 12.965,
    longitude: 77.6,
    last_updated: new Date().toISOString(),
  },
  {
    id: "3",
    bus_number: "KB-003",
    status: "maintenance",
    driver_name: "Mike Johnson",
    capacity: 40,
    region: "Main Campus",
    latitude: 12.978,
    longitude: 77.59,
    last_updated: new Date().toISOString(),
  },
];

const sampleRoute = {
  id: "1",
  name: "North Campus - City Center",
  start_location: "North Campus Gate",
  end_location: "City Center Bus Stop",
  region: "North Campus",
  start_lat: 12.9716,
  start_lng: 77.5946,
  end_lat: 12.935,
  end_lng: 77.6245,
  stops: [
    {
      id: "1",
      stop_name: "North Campus Gate",
      stop_order: 1,
      latitude: 12.9716,
      longitude: 77.5946,
      estimated_arrival_offset: 0,
    },
    {
      id: "2",
      stop_name: "Library Junction",
      stop_order: 2,
      latitude: 12.965,
      longitude: 77.6,
      estimated_arrival_offset: 5,
    },
    {
      id: "3",
      stop_name: "Main Market",
      stop_order: 3,
      latitude: 12.95,
      longitude: 77.61,
      estimated_arrival_offset: 15,
    },
    {
      id: "4",
      stop_name: "City Center Bus Stop",
      stop_order: 4,
      latitude: 12.935,
      longitude: 77.6245,
      estimated_arrival_offset: 25,
    },
  ],
};

const MapsDemo = () => {
  const [selectedBusId, setSelectedBusId] = useState<string>("");
  const [selectedStop, setSelectedStop] = useState<any>(null);

  return (
    <DashboardLayout pageTitle="Google Maps Integration">
      <div className="space-y-6">
        {/* Header */}
        <Card className="border-t-4 border-t-blue-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Google Maps Integration Demo
            </CardTitle>
            <CardDescription>
              Interactive maps for bus tracking, route visualization, and
              location management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Navigation className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-sm">
                    Real-time Tracking
                  </div>
                  <div className="text-xs text-gray-600">
                    Live bus locations
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Route className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold text-sm">
                    Route Visualization
                  </div>
                  <div className="text-xs text-gray-600">
                    Interactive route maps
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-semibold text-sm">Stop Management</div>
                  <div className="text-xs text-gray-600">
                    Detailed stop information
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Info className="h-5 w-5" />
              Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-800">
            <div className="space-y-2 text-sm">
              <p>To use Google Maps functionality, you need to:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>
                  Get a Google Maps API key from{" "}
                  <a
                    href="https://console.cloud.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Google Cloud Console
                  </a>
                </li>
                <li>
                  Enable the following APIs: Maps JavaScript API, Places API,
                  Directions API
                </li>
                <li>
                  Add your API key to{" "}
                  <code className="bg-yellow-200 px-1 rounded">.env</code> file
                  as{" "}
                  <code className="bg-yellow-200 px-1 rounded">
                    VITE_GOOGLE_MAPS_API_KEY
                  </code>
                </li>
                <li>Restart your development server</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Maps Tabs */}
        <Tabs defaultValue="tracking" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracking">Bus Tracking</TabsTrigger>
            <TabsTrigger value="routes">Route Visualization</TabsTrigger>
            <TabsTrigger value="basic">Basic Map</TabsTrigger>
          </TabsList>

          {/* Bus Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Bus Tracking</CardTitle>
                <CardDescription>
                  Track live bus locations with status indicators and detailed
                  information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusTrackingMap
                  buses={sampleBuses}
                  selectedBusId={selectedBusId}
                  onBusSelect={setSelectedBusId}
                  height="600px"
                />

                {selectedBusId && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Selected Bus Details</h4>
                    {(() => {
                      const bus = sampleBuses.find(
                        (b) => b.id === selectedBusId
                      );
                      return bus ? (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <strong>Bus Number:</strong> {bus.bus_number}
                          </div>
                          <div>
                            <strong>Status:</strong>{" "}
                            <Badge variant="outline">{bus.status}</Badge>
                          </div>
                          <div>
                            <strong>Driver:</strong> {bus.driver_name}
                          </div>
                          <div>
                            <strong>Capacity:</strong> {bus.capacity}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Route Visualization Tab */}
          <TabsContent value="routes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Route Visualization</CardTitle>
                <CardDescription>
                  Interactive route maps with stops, directions, and estimated
                  travel times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RouteMap
                  route={sampleRoute}
                  showStops={true}
                  showDirections={true}
                  height="600px"
                  onStopSelect={setSelectedStop}
                />

                {selectedStop && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Selected Stop Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>Stop Name:</strong> {selectedStop.stop_name}
                      </div>
                      <div>
                        <strong>Order:</strong> {selectedStop.stop_order}
                      </div>
                      <div>
                        <strong>ETA:</strong>{" "}
                        {selectedStop.estimated_arrival_offset} min
                      </div>
                      <div>
                        <strong>Coordinates:</strong> {selectedStop.latitude},{" "}
                        {selectedStop.longitude}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Basic Map Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Google Map</CardTitle>
                <CardDescription>
                  Simple Google Map component for location selection and display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GoogleMap
                  center={{ lat: 12.9716, lng: 77.5946 }}
                  zoom={13}
                  style={{ height: "500px" }}
                  onMapLoad={(map) => {
                    console.log("Map loaded:", map);
                    // Add a simple marker
                    new google.maps.Marker({
                      position: { lat: 12.9716, lng: 77.5946 },
                      map,
                      title: "Campus Location",
                    });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Available Features</CardTitle>
            <CardDescription>
              Google Maps integration capabilities for your bus management
              system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Bus Tracking Features</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Real-time bus location display</li>
                  <li>• Status-based color coding</li>
                  <li>• Interactive info windows</li>
                  <li>• Auto-fit bounds for multiple buses</li>
                  <li>• Bus selection and centering</li>
                  <li>• Refresh functionality</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Route Visualization Features</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Interactive route plotting</li>
                  <li>• Stop markers with order numbers</li>
                  <li>• Directions API integration</li>
                  <li>• Estimated arrival times</li>
                  <li>• Start/end point highlighting</li>
                  <li>• Custom marker styling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MapsDemo;
