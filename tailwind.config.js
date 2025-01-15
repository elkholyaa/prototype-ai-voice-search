import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Noto Kufi Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config; 