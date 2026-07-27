/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f5f7",
        ink: "#12141a",
        muted: "#5c6470",
        faint: "#8b93a0",
        accent: {
          DEFAULT: "#1f5b4d",
          soft: "rgba(31, 91, 77, 0.1)",
          hover: "#17483d",
        },
      },
      fontFamily: {
        display: ['"Syne"', "sans-serif"],
        body: ['"IBM Plex Sans"', "sans-serif"],
      },
      maxWidth: {
        content: "1100px",
      },
    },
  },
  plugins: [],
};
