// Define proper type for schema.org structured data
interface SchemaOrgBase {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

interface OrganizationSchema extends SchemaOrgBase {
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
    availableLanguage: string;
  };
}

interface WebSiteSchema extends SchemaOrgBase {
  name: string;
  url: string;
  potentialAction: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

// Structured data helpers
export const organizationSchema: OrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ZeroDolg',
  url: 'https://zerodolg.ru',
  logo: 'https://zerodolg.ru/images/logo.png',
  sameAs: ['https://t.me/zerodolg', 'https://vk.com/zerodolg', 'https://youtube.com/zerodolg'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+7 (800) 555-33-87',
    contactType: 'customer service',
    availableLanguage: 'Russian',
  },
};

export const websiteSchema: WebSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ZeroDolg',
  url: 'https://zerodolg.ru',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://zerodolg.ru/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

interface BreadcrumbSchema {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export const breadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): BreadcrumbSchema => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

interface ArticleSchema {
  '@context': string;
  '@type': 'Article';
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  image: string;
  publisher: OrganizationSchema;
}

export const articleSchema = (article: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  image: string;
}): ArticleSchema => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    image: article.image,
    publisher: organizationSchema,
  };
};
