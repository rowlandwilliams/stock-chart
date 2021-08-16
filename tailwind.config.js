const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.5rem",
      },
    },
    colors: {
      ...colors,
      transparent: "transparent",
      current: "currentColor",
      background: "#100F36",
      chart_background: "#1a1b3e",
      bar_colour: "#B0A7FF",
    },
  },
  variants: {
    extend: {},
  },
};
