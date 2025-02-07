import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "text-red-500",
    "text-blue-500",
    "grid",
    "grid-cols-2",
    "gap-2",
    "text-right"
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["Noto Kufi Arabic", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
