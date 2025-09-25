// Using CommonJS require statements is appropriate for PostCSS configuration files
// These are intentionally using require() and not ES modules

module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [require('cssnano')({ preset: 'default' })] : []),
  ],
};
