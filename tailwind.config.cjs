/** @type {import('tailwindcss').Config} */
// Colores y fuentes viven como variables CSS en src/styles.css (una sola fuente de verdad).
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};
