/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          dark: '#0f172a',
          DEFAULT: '#1e3a8a',
          medium: '#1e40af',
          light: '#3b82f6',
          lighter: '#60a5fa',
        },
      },
      fontFamily: {
        'sans': ['Pretendard', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        'special-gothic': ['"Special Gothic Expanded One"', 'system-ui', 'sans-serif'],
        'host-grotesk': ['"Host Grotesk"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        'product': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'product-hover': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'keyring': '0 20px 40px rgba(0, 0, 0, 0.15), inset 0 -2px 8px rgba(0, 0, 0, 0.1), inset 0 2px 8px rgba(255, 255, 255, 0.3)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(60px) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}


