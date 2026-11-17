/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        canvas: "#d5dbe4",
        ink: "#121820",
        muted: "#4a5563",
        faint: "#6b7785",
        paper: "#eef2f6",
        accent: {
          DEFAULT: "#245c4e",
          soft: "rgba(36, 92, 78, 0.14)",
          hover: "#1a463b",
          bright: "#3d8f78",
        },
      },
      fontFamily: {
        display: ['"Syne"', "sans-serif"],
        body: ['"IBM Plex Sans"', "sans-serif"],
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};
