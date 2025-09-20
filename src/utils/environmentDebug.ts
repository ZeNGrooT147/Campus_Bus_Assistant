// Environment Variable Debug Helper
console.log("🔍 Campus Bus Assistant - Environment Debug");
console.log("Environment Variables:", {
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL
    ? "✅ Set"
    : "❌ Missing",
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
    ? "✅ Set"
    : "❌ Missing",
  VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    ? "✅ Set"
    : "❌ Missing",
  VITE_DISABLE_DEVTOOLS: import.meta.env.VITE_DISABLE_DEVTOOLS,
  VITE_OBFUSCATE_CODE: import.meta.env.VITE_OBFUSCATE_CODE,
});

// Test Telegram API availability
const testTelegramConnection = async () => {
  try {
    const TELEGRAM_BOT_TOKEN = "7742027749:AAENTZ012O5SiGto0M0QMJhm-xSbtiFZETY";
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`,
      {
        method: "GET",
        mode: "cors",
      }
    );
    const data = await response.json();
    console.log(
      "🤖 Telegram Bot Status:",
      data.ok ? "✅ Connected" : "❌ Failed",
      data
    );
  } catch (error) {
    console.error("🤖 Telegram Test Failed:", error);
  }
};

// Test Google Maps API availability
const testGoogleMapsAPI = async () => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("🗺️ Google Maps API Key not found");
      return;
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${apiKey}`
    );
    const data = await response.json();
    console.log(
      "🗺️ Google Maps API Status:",
      data.status === "REQUEST_DENIED" ? "❌ Access Denied" : "✅ Working",
      data.status
    );
  } catch (error) {
    console.error("🗺️ Google Maps Test Failed:", error);
  }
};

// Run tests after a short delay to ensure environment is loaded
setTimeout(() => {
  testTelegramConnection();
  testGoogleMapsAPI();
}, 1000);

export {};
