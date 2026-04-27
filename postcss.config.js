export default {
  plugins: {
    // K15t primitive CSS uses Sass-like `&--variant` nesting; flatten before Tailwind + minify.
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    autoprefixer: {},
  },
};
