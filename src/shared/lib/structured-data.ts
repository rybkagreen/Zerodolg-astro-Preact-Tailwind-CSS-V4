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
  logo: 'https://zerodolg.ru/images/logo.svg',
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

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>): BreadcrumbSchema => {
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

// FAQ Schema
interface FAQSchema {
  '@context': string;
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export const faqSchema = (questions: Array<{ question: string; answer: string }>): FAQSchema => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
};

// HowTo Schema
interface HowToSchema {
  '@context': string;
  '@type': 'HowTo';
  name: string;
  description: string;
  image?: string;
  totalTime?: string;
  estimatedCost?: {
    '@type': 'MonetaryAmount';
    currency: string;
    value: string;
  };
  step: Array<{
    '@type': 'HowToStep';
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
}

export const howToSchema = (howTo: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string;
  estimatedCost?: { currency: string; value: string };
  steps: Array<{
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
}): HowToSchema => {
  const schema: HowToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };

  if (howTo.image) {
    schema.image = howTo.image;
  }

  if (howTo.totalTime) {
    schema.totalTime = howTo.totalTime;
  }

  if (howTo.estimatedCost) {
    schema.estimatedCost = {
      '@type': 'MonetaryAmount',
      currency: howTo.estimatedCost.currency,
      value: howTo.estimatedCost.value,
    };
  }

  return schema;
};

// LocalBusiness Schema (more detailed than Organization)
interface LocalBusinessSchema {
  '@context': string;
  '@type': 'LegalService';
  name: string;
  image: string;
  url: string;
  telephone: string;
  email?: string;
  priceRange: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    '@type': 'GeoCoordinates';
    latitude: string;
    longitude: string;
  };
  openingHoursSpecification: Array<{
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  sameAs: string[];
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
    bestRating: string;
  };
  areaServed?: {
    '@type': 'City';
    name: string;
  };
}

export const localBusinessSchema = (business: {
  name: string;
  image: string;
  url: string;
  telephone: string;
  email?: string;
  priceRange: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: string;
    longitude: string;
  };
  openingHours: Array<{
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  sameAs: string[];
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
    bestRating: string;
  };
  areaServed?: string;
}): LocalBusinessSchema => {
  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: business.name,
    image: business.image,
    url: business.url,
    telephone: business.telephone,
    priceRange: business.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
      ...(business.address.addressRegion && { addressRegion: business.address.addressRegion }),
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHoursSpecification: business.openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
    sameAs: business.sameAs,
  };

  if (business.email) {
    schema.email = business.email;
  }

  if (business.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.aggregateRating.ratingValue,
      reviewCount: business.aggregateRating.reviewCount,
      bestRating: business.aggregateRating.bestRating,
    };
  }

  if (business.areaServed) {
    schema.areaServed = {
      '@type': 'City',
      name: business.areaServed,
    };
  }

  return schema;
};

// Review Schema
interface ReviewSchema {
  '@context': string;
  '@type': 'Review';
  author: {
    '@type': 'Person';
    name: string;
  };
  datePublished: string;
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  reviewBody: string;
  itemReviewed: {
    '@type': 'LegalService';
    name: string;
  };
}

export const reviewSchema = (review: {
  author: string;
  datePublished: string;
  rating: number;
  reviewBody: string;
  serviceName: string;
}): ReviewSchema => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    datePublished: review.datePublished,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.reviewBody,
    itemReviewed: {
      '@type': 'LegalService',
      name: review.serviceName,
    },
  };
};

// Image Object Schema
interface ImageObjectSchema {
  '@context': string;
  '@type': 'ImageObject';
  url: string;
  contentUrl: string;
  width?: string;
  height?: string;
  caption?: string;
  description?: string;
}

export const imageSchema = (image: {
  url: string;
  width?: string;
  height?: string;
  caption?: string;
  description?: string;
}): ImageObjectSchema => {
  const schema: ImageObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: image.url,
    contentUrl: image.url,
  };

  if (image.width) schema.width = image.width;
  if (image.height) schema.height = image.height;
  if (image.caption) schema.caption = image.caption;
  if (image.description) schema.description = image.description;

  return schema;
};
