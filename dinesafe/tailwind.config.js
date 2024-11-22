// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        josefin: ['"Josefin Sans"', "sans-serif"], // Define a custom key for Josefin Sans
      },
    },
  },
  plugins: [],
};
