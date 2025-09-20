import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const APIDebugTest = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testEnvironmentVariables = () => {
    const envVars = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL
        ? "✅ Set"
        : "❌ Missing",
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
        ? "✅ Set"
        : "❌ Missing",
      VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        ? "✅ Set"
        : "❌ Missing",
      NODE_ENV: import.meta.env.NODE_ENV || "development",
      MODE: import.meta.env.MODE || "development",
      DEV: import.meta.env.DEV ? "true" : "false",
      PROD: import.meta.env.PROD ? "true" : "false",
    };

    setResults((prev) => ({ ...prev, env: envVars }));
  };

  const testTelegram = async () => {
    setLoading(true);
    try {
      const TELEGRAM_BOT_TOKEN =
        "7742027749:AAENTZ012O5SiGto0M0QMJhm-xSbtiFZETY";
      const TELEGRAM_CHAT_ID = "1146747265";

      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: "🧪 Test message from Campus Bus Assistant Debug Tool",
          parse_mode: "Markdown",
        }),
      });

      const data = await response.json();

      setResults((prev) => ({
        ...prev,
        telegram: {
          status: response.ok ? "✅ Success" : "❌ Failed",
          response: data,
          url: url.replace(TELEGRAM_BOT_TOKEN, "***HIDDEN***"),
        },
      }));
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        telegram: {
          status: "❌ Error",
          error: error.message,
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  const testGoogleMaps = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        setResults((prev) => ({
          ...prev,
          googleMaps: {
            status: "❌ No API Key",
            error: "VITE_GOOGLE_MAPS_API_KEY not found",
          },
        }));
        return;
      }

      // Test Google Maps Geocoding API
      const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Bangalore&key=${apiKey}`;
      const response = await fetch(testUrl);
      const data = await response.json();

      setResults((prev) => ({
        ...prev,
        googleMaps: {
          status: data.status === "OK" ? "✅ Success" : "❌ Failed",
          response: data,
          hasApiKey: "✅ Yes",
        },
      }));
    } catch (error: any) {
      setResults((prev) => ({
        ...prev,
        googleMaps: {
          status: "❌ Error",
          error: error.message,
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    testEnvironmentVariables();
    await testTelegram();
    await testGoogleMaps();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>API Debug Test Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testEnvironmentVariables}>
              Test Environment Variables
            </Button>
            <Button onClick={testTelegram} disabled={loading}>
              Test Telegram
            </Button>
            <Button onClick={testGoogleMaps} disabled={loading}>
              Test Google Maps
            </Button>
            <Button onClick={runAllTests} disabled={loading}>
              Run All Tests
            </Button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Test Results:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default APIDebugTest;
