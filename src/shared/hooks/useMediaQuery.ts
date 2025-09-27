import { useState, useEffect } from 'preact/hooks';

/**
 * Хук для определения медиа-запросов
 * @param query - строка медиа-запроса (например, '(min-width: 768px)')
 * @returns boolean - соответствует ли медиа-запрос
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => {
      media.removeEventListener('change', listener);
    };
  }, [matches, query]);

  return matches;
}