import { useEffect, useState } from 'preact/hooks';

// Declare gtag global function
declare global {
  function gtag(command: string, ...args: any[]): void;
}

interface OnlineStickerLogicProps {
  minUsers?: number;
  maxUsers?: number;
  updateInterval?: number;
}

export default function OnlineStickerLogic({ 
  minUsers = 87, 
  maxUsers = 234, 
  updateInterval = 30000 
}: OnlineStickerLogicProps) {
  const [onlineCount, setOnlineCount] = useState(() => 
    Math.floor(Math.random() * (maxUsers - minUsers + 1)) + minUsers
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Pluralization function for Russian (currently unused)
  const _pluralize = (_count: number, _one: string, _few: string, _many: string) => {
    const mod10 = _count % 10;
    const mod100 = _count % 100;
    
    if (mod10 === 1 && mod100 !== 11) return _one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return _few;
    return _many;
  };

  // Generate random phrases
  const getRandomPhrase = () => {
    const phrases = [
      'сейчас на сайте',
      'человек онлайн',
      'пользователей активно',
      'посетителей на сайте',
      'клиентов онлайн'
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  // Update online count
  const updateCount = () => {
    const currentCount = onlineCount;
    let newCount: number;
    
    // Smooth variation logic
    const variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
    newCount = currentCount + variation;
    
    // Keep within bounds
    if (newCount < minUsers) newCount = minUsers + Math.floor(Math.random() * 10);
    if (newCount > maxUsers) newCount = maxUsers - Math.floor(Math.random() * 10);
    
    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    setOnlineCount(newCount);
    
    // Update text content
    const countEl = document.querySelector('.online-sticker__count');
    const textEl = document.querySelector('.online-sticker__text');
    
    if (countEl) {
      countEl.textContent = newCount.toString();
    }
    
    if (textEl) {
      // Occasionally change the phrase
      if (Math.random() > 0.7) {
        textEl.textContent = getRandomPhrase();
      }
    }
    
    // Send analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'online_sticker_update', {
        event_category: 'engagement',
        event_label: 'online_count',
        value: newCount
      });
    }
  };

  useEffect(() => {
    // Initial setup
    const stickerEl = document.querySelector('.online-sticker');
    if (stickerEl) {
      stickerEl.classList.add('online-sticker--active');
    }

    // Set up interval for updates
    const intervalId = setInterval(updateCount, updateInterval);
    
    // Also update on visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateCount();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onlineCount, minUsers, maxUsers, updateInterval]);

  // Add animation class handler
  useEffect(() => {
    const stickerEl = document.querySelector('.online-sticker');
    if (stickerEl) {
      if (isAnimating) {
        stickerEl.classList.add('online-sticker--updating');
      } else {
        stickerEl.classList.remove('online-sticker--updating');
      }
    }
  }, [isAnimating]);

  return null; // This component only handles logic, no UI
}
