import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader } from "@googlemaps/js-api-loader";

const GoogleMapsDebugTest = () => {
  const [debugInfo, setDebugInfo] = useState<{
    apiKey: string | undefined;
    environment: string;
    error: string | null;
    loadingStatus: string;
    consoleMessages: string[];
  }>({
    apiKey: "",
    environment: "",
    error: null,
    loadingStatus: "Not started",
    consoleMessages: [],
  });

  const addMessage = (message: string) => {
    setDebugInfo((prev) => ({
      ...prev,
      consoleMessages: [
        ...prev.consoleMessages,
        `${new Date().toLocaleTimeString()}: ${message}`,
      ],
    }));
  };

  useEffect(() => {
    const testGoogleMaps = async () => {
      try {
        // Check environment variables
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const mode = import.meta.env.MODE;
        const dev = import.meta.env.DEV;

        setDebugInfo((prev) => ({
          ...prev,
          apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : "NOT FOUND",
          environment: `Mode: ${mode}, Dev: ${dev}`,
        }));

        addMessage("Starting Google Maps test...");

        if (!apiKey) {
          throw new Error(
            "VITE_GOOGLE_MAPS_API_KEY not found in environment variables"
          );
        }

        addMessage(`API Key found: ${apiKey.substring(0, 10)}...`);

        setDebugInfo((prev) => ({
          ...prev,
          loadingStatus: "Loading Google Maps API...",
        }));

        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places", "geometry"],
        });

        addMessage("Loader created, attempting to load...");

        await loader.load();

        addMessage("Google Maps API loaded successfully!");
        setDebugInfo((prev) => ({
          ...prev,
          loadingStatus: "Google Maps API loaded successfully!",
        }));

        // Test creating a map
        const testDiv = document.createElement("div");
        testDiv.style.height = "100px";
        testDiv.style.width = "100px";

        const map = new google.maps.Map(testDiv, {
          center: { lat: 12.9716, lng: 77.5946 },
          zoom: 10,
        });

        addMessage("Test map created successfully!");
        setDebugInfo((prev) => ({
          ...prev,
          loadingStatus: "All tests passed! Google Maps is working.",
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        addMessage(`ERROR: ${errorMessage}`);
        setDebugInfo((prev) => ({
          ...prev,
          error: errorMessage,
          loadingStatus: "Failed to load Google Maps",
        }));
        console.error("Google Maps test failed:", error);
      }
    };

    testGoogleMaps();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Google Maps Configuration Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>API Key:</strong> {debugInfo.apiKey}
            </div>
            <div>
              <strong>Environment:</strong> {debugInfo.environment}
            </div>
            <div className="col-span-2">
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  debugInfo.loadingStatus.includes("passed")
                    ? "bg-green-100 text-green-800"
                    : debugInfo.loadingStatus.includes("Failed")
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {debugInfo.loadingStatus}
              </span>
            </div>
          </div>

          {debugInfo.error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                <strong>Error:</strong> {debugInfo.error}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <strong>Debug Log:</strong>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono max-h-40 overflow-y-auto">
              {debugInfo.consoleMessages.map((msg, index) => (
                <div key={index} className="mb-1">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleMapsDebugTest;
