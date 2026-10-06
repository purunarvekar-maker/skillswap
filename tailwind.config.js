/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FAF6F0',
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F5EFE6',
          300: '#EDE5D8',
          400: '#E0D5C3',
          500: '#C9BBA8',
        },
        cherry: {
          DEFAULT: '#800020',
          50: '#FFE5EB',
          100: '#FFC2CF',
          200: '#E07080',
          300: '#B04050',
          400: '#900028',
          500: '#800020',
          600: '#6B0019',
          700: '#5B0015',
          800: '#460010',
          900: '#2E000A',
        },
        cream: {
          DEFAULT: '#FFF9E6',
          light: '#FFFDF5',
          dark: '#FFF3CC',
        },
        mint: {
          DEFAULT: '#C8E6D5',
          light: '#E8F5EF',
          dark: '#9AD0B8',
        },
        lavender: {
          DEFAULT: '#D6C7E8',
          light: '#F0EBF7',
          dark: '#B89DD4',
        },
        butter: {
          DEFAULT: '#FFE89A',
          light: '#FFF8D6',
          dark: '#FFD96A',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Caveat"', 'cursive'],
        display: ['"Caveat"', 'cursive'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'pop-in': 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'tape-peel': 'tapePeel 0.3s ease-out',
        'stamp-in': 'stampIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        tapePeel: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
        stampIn: {
          '0%': { transform: 'scale(2) rotate(-15deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(-8deg)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
