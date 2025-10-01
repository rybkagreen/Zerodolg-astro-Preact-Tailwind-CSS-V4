// Утилиты для генерации Schema.org разметки для документов команды
import type { TeamMember } from '../../core/team-members';

// Интерфейс для Schema.org Document
interface DocumentSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string;
  url: string;
  keywords: string;
  about: {
    '@type': string;
    name: string;
  };
  creator: {
    '@type': string;
    name: string;
    jobTitle: string;
  };
  dateCreated?: string | undefined;
  inLanguage: string;
  publisher: {
    '@type': string;
    name: string;
    url: string;
  };
}

// Генерация Schema.org разметки для документа
export function generateDocumentSchema(
  document: NonNullable<TeamMember['documents']>[0],
  member: TeamMember,
  baseUrl: string = 'https://zerodolg.ru'
): DocumentSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: document.seoTitle,
    description: document.seoDescription,
    image: `${baseUrl}${document.image}`,
    url: `${baseUrl}/team/${member.id}/documents/${encodeURIComponent(document.title)}`,
    keywords: document.keywords.join(', '),
    about: {
      '@type': 'EducationalOccupationalProgram',
      name: document.title,
    },
    creator: {
      '@type': 'Person',
      name: member.name,
      jobTitle: member.position,
    },
    dateCreated: document.issueDate,
    inLanguage: 'ru-RU',
    publisher: {
      '@type': 'LegalService',
      name: 'ZeroDolg - Банкротство физических лиц',
      url: baseUrl,
    },
  };
}

// Генерация всех схем документов для участника команды
export function generateMemberDocumentsSchemas(
  member: TeamMember,
  baseUrl: string = 'https://zerodolg.ru'
): DocumentSchema[] {
  if (!member.documents) return [];

  return member.documents.map((document) => generateDocumentSchema(document, member, baseUrl));
}

// Генерация JSON-LD скрипта для документов
export function generateDocumentsJsonLd(documents: DocumentSchema[]): string {
  if (documents.length === 0) return '';

  const jsonLd =
    documents.length === 1
      ? documents[0]
      : {
          '@context': 'https://schema.org',
          '@graph': documents,
        };

  return JSON.stringify(jsonLd, null, 2);
}

// Генерация мета-тегов для документа
export function generateDocumentMetaTags(
  document: NonNullable<TeamMember['documents']>[0],
  member: TeamMember,
  baseUrl: string = 'https://zerodolg.ru'
): Array<{ name?: string; property?: string; content: string }> {
  const imageUrl = `${baseUrl}${document.image}`;

  return [
    // Basic meta tags
    { name: 'description', content: document.seoDescription },
    { name: 'keywords', content: document.keywords.join(', ') },

    // Open Graph
    { property: 'og:title', content: document.seoTitle },
    { property: 'og:description', content: document.seoDescription },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:alt', content: document.alt },
    { property: 'og:type', content: 'article' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: document.seoTitle },
    { name: 'twitter:description', content: document.seoDescription },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:image:alt', content: document.alt },

    // Article specific
    { name: 'article:author', content: member.name },
    { name: 'article:section', content: 'Образование и квалификация' },
    { name: 'article:tag', content: document.hashtags.join(', ') },
  ];
}

// Генерация структурированных данных для изображения документа
export function generateImageStructuredData(
  document: NonNullable<TeamMember['documents']>[0],
  member: TeamMember,
  baseUrl: string = 'https://zerodolg.ru'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: document.title,
    description: document.alt,
    url: `${baseUrl}${document.image}`,
    contentUrl: `${baseUrl}${document.image}`,
    keywords: document.keywords.join(', '),
    caption: document.description,
    creator: {
      '@type': 'Person',
      name: member.name,
      jobTitle: member.position,
    },
    copyrightHolder: {
      '@type': 'LegalService',
      name: 'ZeroDolg',
      url: baseUrl,
    },
    license: `${baseUrl}/terms`,
    acquireLicensePage: `${baseUrl}/terms`,
    creditText: `${member.name} - ${member.position}`,
    about: {
      '@type': 'EducationalOccupationalCredential',
      name: document.title,
      description: document.description,
    },
  };
}
