import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        'gray-text': '#1A1A1A',
        'gray-neutral': '#555555',
        'gray-light': '#F5F5F5',
        border: '#CCCCCC',
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        articulat: ['var(--font-articulat)', 'Helvetica Neue', 'system-ui', 'sans-serif'],
      },
      screens: {
        sm: '375px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
