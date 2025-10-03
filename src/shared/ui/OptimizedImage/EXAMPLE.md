// Пример замены обычного изображения на OptimizedImage в Hero.astro

---

// Было: // <img // src='/images/team/mashulia.webp' // alt='Масхулиа Леван
Зурабович - Арбитражный управляющий' // class='w-full h-full object-cover' //
style='object-position: center 25%' // />

// Стало: import OptimizedImage from '@/shared/ui/OptimizedImage';

---

<!-- Экспертная карточка в Hero секции -->
<div class='relative flex-shrink-0'>
  <div
    class='w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-2xl shadow-blue-400/30'
  >
    <OptimizedImage
      src='/images/team/mashulia.webp'
      alt='Масхулиа Леван Зурабович - Арбитражный управляющий'
      width={128}
      height={128}
      class='w-full h-full object-cover'
      style='object-position: center 25%'
    />
  </div>
</div>
