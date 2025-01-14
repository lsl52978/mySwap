import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ["12px", "20px"],
        sm: ["14px", "22px"],
        base: ["16px", "24px"],
        lg: ["16px", "24px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["30px", "36px"],
        "4xl": ["36px", "44px"],
        "5xl": ["48px", "56px"],
      },
      colors: {
        primary: "#7B3FE4", // 主题色
        secondary: "#1FC7D4", // 备用主题色
        dark: "#374151", // 深色
        light: "#F9FAFB", // 浅色
      },
    },
  },
  plugins: [],
} satisfies Config;
