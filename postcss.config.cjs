// PostCSS Configuration for Production-Quality CSS Architecture
// Optimized for Tailwind CSS v3 and modern web development

module.exports = {
  plugins: [
    // Import resolution
    require('postcss-import'),

    // Tailwind CSS v3
    require('tailwindcss'),

    // Modern CSS features
    require('postcss-nesting'),
    require('postcss-preset-env')({
      stage: 1,
      features: {
        'nesting-rules': false, // Handled by postcss-nesting
        'custom-media-queries': true,
        'custom-properties': true,
      },
    }),

    // Autoprefixer for browser compatibility
    require('autoprefixer'),

    // Production optimizations
    ...(process.env.NODE_ENV === 'production'
      ? [
          require('cssnano')({
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
                reduceIdents: false, // Prevent breaking CSS custom properties
                zindex: false, // Prevent z-index optimization conflicts
                normalizeWhitespace: true,
                colormin: true,
                convertValues: true,
                discardDuplicates: true,
                discardEmpty: true,
                minifyFontValues: true,
                minifyParams: true,
                minifySelectors: true,
              },
            ],
          }),
        ]
      : []),
  ],
};
