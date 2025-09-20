import React from "react";

function TestApp() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Campus Bus Assistant</h1>
      <p>Application is loading successfully!</p>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => alert("React is working!")}>Test React</button>
      </div>
    </div>
  );
}

export default TestApp;
