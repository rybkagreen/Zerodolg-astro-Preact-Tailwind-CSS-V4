import { defineCollection, z } from 'astro:content';

// Пример коллекции для блога (можно расширить по необходимости)
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

// Коллекция для отзывов
const reviews = defineCollection({
  type: 'data',
  schema: z.object({
    author: z.string(),
    rating: z.number().min(1).max(5),
    date: z.string(),
    text: z.string(),
    caseDetails: z
      .object({
        debt: z.string(),
        duration: z.string(),
        result: z.string(),
      })
      .optional(),
  }),
});

// Коллекция для членов команды
const team = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    position: z.string(),
    photo: z.string().optional(),
    bio: z.string(),
    experience: z.string(),
    specializations: z.array(z.string()),
    achievements: z.array(z.string()),
    contacts: z.object({
      phone: z.string().optional(),
      email: z.string().optional(),
    }),
  }),
});

export const collections = {
  blog,
  reviews,
  team,
};