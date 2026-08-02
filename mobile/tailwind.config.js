/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1C2B39",
          dark: "#14202B",
          light: "#2A3D4E",
        },
        brand: {
          DEFAULT: "#3E7C74",
          dark: "#32655E",
          light: "#E8F5F2",
          muted: "#A8D1CB",
        },
        accent: {
          DEFAULT: "#3E7C74",
          light: "#E8F5F2",
        },
        background: {
          DEFAULT: "#F5F7F8",
          card: "#FFFFFF",
          input: "#FFFFFF",
        },
        text: {
          primary: "#1C2B39",
          secondary: "#6B7C8A",
          tertiary: "#9BA8B3",
          muted: "#B4C0C9",
        },
        status: {
          normal: "#3E7C74",
          caution: "#C4943E",
          critical: "#C44040",
          success: "#3E7C74",
        },
        sos: {
          DEFAULT: "#D94040",
          dark: "#B83232",
        },
        cardBorder: "#E5E9EC",
      },
      fontFamily: {
        poppins: ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semibold": ["Poppins_600SemiBold"],
        "poppins-bold": ["Poppins_700Bold"],
      },
      borderRadius: {
        'card': '12px',
        'button': '12px',
        'chip': '20px',
      },
    },
  },
  plugins: [],
};
