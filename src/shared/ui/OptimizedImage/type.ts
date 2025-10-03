// src/shared/ui/OptimizedImage/types.ts
import type { HTMLAttributes } from 'astro/types';

// Определяем интерфейс для изображения, так как Astro не экспортирует Image напрямую
export interface OptimizedImageProps extends HTMLAttributes<'img'> {
  /** Путь к изображению */
  src: string;
  /** Описание изображения для SEO и доступности */
  alt: string;
  /** Ширина изображения */
  width: number;
  /** Высота изображения */
  height: number;
  /** Стратегия загрузки изображения */
  loading?: 'lazy' | 'eager';
  /** Стратегия декодирования изображения */
  decoding?: 'async' | 'sync' | 'auto';
  /** CSS классы */
  class?: string;
  /** Атрибут sizes для responsive изображений */
  sizes?: string;
  /** Приоритет загрузки (для изображений выше первой видимости) */
  priority?: boolean;
}
