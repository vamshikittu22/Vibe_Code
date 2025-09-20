import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CodeWorkspace from './components/workspace/CodeWorkspace';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#1e1e1e',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        padding: '1rem',
        borderBottom: '1px solid #333',
        backgroundColor: '#2d2d30'
      }}>
        <h1>AI Coding Platform</h1>
      </header>
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<CodeWorkspace />} />
          <Route path="*" element={
            <div>
              <h2>Welcome to AI Coding Platform</h2>
              <p>This is a work in progress. The code editor is being set up.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;