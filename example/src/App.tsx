import React, { useState } from 'react';
import { ChatStatusDemo } from './components/ChatStatusDemo';
import { SimpleChatDemo } from './components/SimpleChatDemo';
import './App.css';

function App() {
  const [demoType, setDemoType] = useState<'simple' | 'advanced'>('simple');

  return (
    <div className="App" style={{ padding: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>useChatStatus 演示</h1>
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => setDemoType('simple')}
            style={{
              padding: '0.5rem 1rem',
              marginRight: '0.5rem',
              backgroundColor: demoType === 'simple' ? '#007bff' : '#f8f9fa',
              color: demoType === 'simple' ? 'white' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            简单演示
          </button>
          <button
            onClick={() => setDemoType('advanced')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: demoType === 'advanced' ? '#007bff' : '#f8f9fa',
              color: demoType === 'advanced' ? 'white' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            高级演示
          </button>
        </div>
      </div>

      {demoType === 'simple' ? <SimpleChatDemo /> : <ChatStatusDemo />}
    </div>
  );
}

export default App;
