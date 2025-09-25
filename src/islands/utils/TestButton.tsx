import { type VNode } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface TestButtonProps {
  // This component doesn't accept any props
}

export default function TestButton({}: TestButtonProps): VNode {
  const [count, setCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Подтверждаем, что мы на клиенте
    setIsClient(true);

    // Находим все кнопки с data-test-button
    const buttons = document.querySelectorAll('[data-test-button]');

    const handlers: Array<{ element: Element; handler: EventListener }> = [];

    buttons.forEach((button) => {
      const handler = (e: Event) => {
        e.preventDefault();
        setCount((c) => c + 1);
      };

      button.addEventListener('click', handler);
      handlers.push({ element: button, handler });
    });

    // Cleanup
    return () => {
      handlers.forEach(({ element, handler }) => {
        element.removeEventListener('click', handler);
      });
    };
  }, []); // Пустой массив зависимостей - выполняется только при монтировании

  if (!isClient) {
    return null; // Ничего не рендерим на сервере
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        background: 'white',
        padding: '10px',
        border: '1px solid black',
      }}
    >
      <p>Test Counter: {count}</p>
      <button data-test-button onClick={() => setCount((c) => c + 1)}>
        Click me (Direct)
      </button>
    </div>
  );
}
