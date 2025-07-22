import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors from Flutter app
        orange: '#FF6B01',
        yellow: '#EBCA10',
        goldenYellow: '#FFCE00',
        blue: '#0F9FFF',
        darkBlue: '#2C60F0',
        blueV1: '#4357BA',
        blueGreyDark: '#232E33',
        purple: '#800080',
        deepPurple: '#5F259D',
        purpleDark: '#723B72',
        purpleBright: '#9600FF',
        red: '#DE3D31',
        darkRed: '#FD1100',
        green: '#70BF73',
        teal: '#008080',
        cyan: '#00BCD4',
        // Neutral colors
        black: '#1E1E1E',
        grey: '#666666',
        darkGrey: '#343434',
        lightGrey: '#9D9D9D',
        lightWhite: '#F8F8F8',
        extraLightGrey: '#FEFEFE',
        lavenderWhite: '#F5EEFC',
        darkBg: '#0D0C0C',
        commonPink: '#F2E4FF',
        indigo: '#3F51B5',
        disabled: '#BDBDBD',
        brown: '#8B4513',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '32': '32px',
        '16': '16px',
        '8': '8px',
      },
    },
  },
  plugins: [],
}

export default config