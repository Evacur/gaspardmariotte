/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '375px',
      md: '600px',
      lg: '1024px',
      xl: '1200px',
    },
    extend: {
      spacing: {
        section: '80px',
        gutter: '24px',
        xxl: '100px',
      },
      fontSize: {
        hero: '64px',
        h1: '48px',
        body: '16px',
      },
      colors: {
        primary: '#171717',
        secondary: '#ededed',
        accent: '#ff5c00',
      },
      fontFamily: {
        clash: ['"Clash Grotesk"', 'sans-serif'],
        satoshi: ['"Satoshi"', 'sans-serif'],
      },
      borderRadius: {
        card: '2px',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}

