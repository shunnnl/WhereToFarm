/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard Variable", "sans-serif"],
      },
      colors: {
        // Primary colors
        primaryGreen: {
          DEFAULT: "#166534",
        },
        // Secondary colors
        secondaryGreen: {
          DEFAULT: "#8DB78F",
        },
        secondaryYellow: {
          DEFAULT: "#FFEC8D",
          light:"#FFF4C2",
        },
        secondaryBrown: {
          DEFAULT: "#B5A37F",
        },
        supportGreen: {
          DEFAULT: "#5EA770",
        },
        // Accent colors
        accentGreen: {
          DEFAULT: "#D0DFB8",
          light: "#EDF2E3",
        },
        accentBrown: {
          DEFAULT: "#D5C6A7",
        },
        // Background colors
        background: {
          DEFAULT: "#F7F6F2",
          alt1: "#EFF2E3",
          alt2: "#F0EFEB",
          alt3: "#EBF5EC",
          alt4: "#F9F6ED",
        },
        // Text colors
        textColor: {
          white: "#FFFFFF",
          black: "#273129",
          darkgray: "#616161",
          gray: "#9E9E9E",
          lightgray: "#BDBDBD",
        },
        // State colors
        notice: {
          DEFAULT: "#CBE4FA",
          highlight: "#348CF6",
        },
        fail: {
          DEFAULT: "#FADCDA",
          highlight: "#E54F50",
        },
        success: {
          DEFAULT: "#D4FAD4",
          highlight: "#4CAF50",
        },
      },
    },
  },
  plugins: [],
};