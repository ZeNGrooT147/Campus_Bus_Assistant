import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus, MapPin, Users, Clock, Phone, User } from "lucide-react";

interface BusData {
  id: string;
  name: string;
  bus_number: string;
  route: string;
  status: string;
  capacity: number;
  current_passengers: number | null;
  assigned_driver: string | null;
  current_location: string | null;
  departure_time: string | null;
  arrival_time: string | null;
}

interface SimpleBusTrackerProps {
  buses: BusData[];
}

const SimpleBusTracker: React.FC<SimpleBusTrackerProps> = ({ buses }) => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "running":
        return "bg-green-500";
      case "maintenance":
      case "stopped":
        return "bg-red-500";
      case "idle":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "running":
        return "Active";
      case "maintenance":
        return "Maintenance";
      case "stopped":
        return "Stopped";
      case "idle":
        return "Idle";
      default:
        return status;
    }
  };

  const selectedBusData = buses.find((bus) => bus.id === selectedBus);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4">
      {/* Bus List Panel */}
      <div className="lg:w-1/3 space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bus className="h-5 w-5" />
          Active Buses ({buses.length})
        </h3>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {buses.map((bus) => (
            <Card
              key={bus.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedBus === bus.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedBus(bus.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        bus.status
                      )}`}
                    />
                    <div>
                      <h4 className="font-medium">{bus.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {bus.bus_number}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{getStatusText(bus.status)}</Badge>
                </div>

                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {bus.current_location || "Location updating..."}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {bus.current_passengers || 0}/{bus.capacity}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bus Details/Map Area */}
      <div className="lg:w-2/3">
        {selectedBusData ? (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5" />
                {selectedBusData.name} - {selectedBusData.bus_number}
              </CardTitle>
              <CardDescription>Route: {selectedBusData.route}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status and Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div
                    className={`w-4 h-4 rounded-full ${getStatusColor(
                      selectedBusData.status
                    )}`}
                  />
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-lg">
                      {getStatusText(selectedBusData.status)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Passengers</p>
                    <p className="text-lg">
                      {selectedBusData.current_passengers || 0}/
                      {selectedBusData.capacity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm">
                      {selectedBusData.current_location || "Updating..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              {selectedBusData.assigned_driver && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    Driver Information
                  </h4>
                  <p className="text-sm">{selectedBusData.assigned_driver}</p>
                </div>
              )}

              {/* Schedule */}
              {(selectedBusData.departure_time ||
                selectedBusData.arrival_time) && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4" />
                    Schedule
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedBusData.departure_time && (
                      <div>
                        <p className="font-medium">Departure</p>
                        <p className="text-muted-foreground">
                          {selectedBusData.departure_time}
                        </p>
                      </div>
                    )}
                    {selectedBusData.arrival_time && (
                      <div>
                        <p className="font-medium">Arrival</p>
                        <p className="text-muted-foreground">
                          {selectedBusData.arrival_time}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Route Visualization Placeholder */}
              <div className="p-8 bg-muted rounded-lg text-center">
                <div className="bg-primary/10 p-4 rounded-full inline-block mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-medium mb-2">
                  Route: {selectedBusData.route}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive route visualization available when maps are
                  enabled
                </p>
                <Button variant="outline" size="sm">
                  View Route Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <div className="bg-primary/10 p-6 rounded-full inline-block mb-4">
                <Bus className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Select a Bus</h3>
              <p className="text-muted-foreground">
                Click on any bus from the list to view detailed information and
                track its location
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SimpleBusTracker;
