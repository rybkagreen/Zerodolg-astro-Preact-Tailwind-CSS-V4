import { useState, useEffect } from 'preact/hooks';

export default function TestButton() {
  const [count, setCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Подтверждаем, что мы на клиенте
    setIsClient(true);
    console.log('TestButton component mounted');

    // Находим все кнопки с data-test-button
    const buttons = document.querySelectorAll('[data-test-button]');
    console.log('Found test buttons:', buttons.length);

    const handlers: Array<{ element: Element; handler: EventListener }> = [];

    buttons.forEach((button, index) => {
      const handler = (e: Event) => {
        e.preventDefault();
        console.log(`Test button ${index + 1} clicked!`);
        setCount((c) => c + 1);
      };

      button.addEventListener('click', handler);
      handlers.push({ element: button, handler });
      console.log(`Added handler to button ${index + 1}`);
    });

    // Cleanup
    return () => {
      console.log('TestButton cleanup');
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
