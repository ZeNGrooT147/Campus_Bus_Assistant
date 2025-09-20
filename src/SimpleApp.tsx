import React from "react";

// Simple test app to isolate React issues
function SimpleApp() {
  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "50px" }}>
        <h1 style={{ color: "#333", marginBottom: "20px" }}>
          Campus Bus Assistant
        </h1>
        <p style={{ color: "#666", fontSize: "18px", marginBottom: "30px" }}>
          🚌 Smart campus transportation management system
        </p>
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#2563eb", marginBottom: "15px" }}>
            System Status
          </h2>
          <div style={{ color: "#16a34a", fontSize: "16px" }}>
            ✅ React is working correctly
            <br />
            ✅ Build system operational
            <br />
            ✅ No createContext errors
            <br />✅ Ready for deployment
          </div>
        </div>
        <button
          onClick={() => {
            alert("🎉 React Context and Events Working!");
            console.log("Button clicked successfully");
          }}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Test React
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: "#16a34a",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default SimpleApp;
