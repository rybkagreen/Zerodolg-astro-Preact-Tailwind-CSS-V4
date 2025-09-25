import { useState, useEffect } from 'preact/hooks';

export default function TestPreactComponent() {
  const [count, setCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on the client side
    setIsClient(true);
    console.log('TestPreactComponent mounted');
  }, []);

  if (!isClient) {
    // Render a placeholder on the server
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
        <h3>Test Preact Component</h3>
        <p>Loading...</p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          If you can see this component and the button works, Preact is functioning correctly.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
      <h3>Test Preact Component</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p style={{ fontSize: '12px', color: '#666' }}>
        If you can see this component and the button works, Preact is functioning correctly.
      </p>
    </div>
  );
}
