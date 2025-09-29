import { useState } from 'preact/hooks';

export default function TestReviews() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h2>Test Preact Component</h2>
      <p>Count: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        style={{ padding: '10px 20px', marginRight: '10px' }}
      >
        Increment
      </button>
      <button onClick={() => setCount(0)} style={{ padding: '10px 20px' }}>
        Reset
      </button>
    </div>
  );
}
