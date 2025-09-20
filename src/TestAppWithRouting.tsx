import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a simple QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Simple landing page component
function LandingPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh' }}>
      <h1>Campus Bus Assistant</h1>
      <p>Welcome to the Campus Bus Management System</p>
      <div style={{ marginTop: '30px' }}>
        <button 
          style={{ 
            margin: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => alert('Student login would go here')}
        >
          Student Login
        </button>
        <button 
          style={{ 
            margin: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#16a34a', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => alert('Driver login would go here')}
        >
          Driver Login
        </button>
        <button 
          style={{ 
            margin: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#dc2626', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => alert('Admin login would go here')}
        >
          Admin Login
        </button>
      </div>
    </div>
  );
}

function TestAppWithRouting() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default TestAppWithRouting;