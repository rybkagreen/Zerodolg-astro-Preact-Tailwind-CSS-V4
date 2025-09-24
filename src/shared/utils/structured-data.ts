// Structured data helpers
export const organizationSchema: Record<string, any> = {
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

export const websiteSchema: Record<string, any> = {
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

export const breadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): Record<string, any> => {
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

export const articleSchema = (article: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  image: string;
}): Record<string, any> => {
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
