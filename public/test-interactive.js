// Тестовый скрипт для проверки интерактивности
console.log('=== ПРОВЕРКА ИНТЕРАКТИВНЫХ КОМПОНЕНТОВ ===');

// Проверяем загрузку документа
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM загружен');
  
  // Проверяем Timeline
  const timelineButtons = document.querySelectorAll('[data-action]');
  console.log(`Timeline кнопки найдены: ${timelineButtons.length}`);
  
  // Проверяем Header dropdown
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  console.log(`Header dropdowns найдены: ${dropdowns.length}`);
  
  // Проверяем Team tabs
  const teamTabs = document.querySelectorAll('.team-tab');
  console.log(`Team tabs найдены: ${teamTabs.length}`);
  
  // Добавляем простой обработчик для проверки
  timelineButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      console.log('Timeline button clicked:', btn.getAttribute('data-action'));
    });
  });
  
  // Проверяем загрузку Preact компонентов
  setTimeout(() => {
    console.log('=== ПРОВЕРКА ЧЕРЕЗ 2 СЕКУНДЫ ===');
    const activeElements = document.querySelectorAll('.active');
    console.log(`Активные элементы: ${activeElements.length}`);
  }, 2000);
});
