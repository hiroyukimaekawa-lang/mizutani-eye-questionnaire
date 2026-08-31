import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: '#5E969E',
        'brand-dark': '#3F747C',
        'brand-pale': '#EAF3F4',
        ink: '#24383B',
        muted: '#5D6D70',
        canvas: '#F5F9F9',
        error: '#B42318',
      },
      boxShadow: {
        card: '0 12px 36px rgba(48, 91, 97, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
