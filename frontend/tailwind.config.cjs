module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          600: '#1d4ed8'
        },
        surface: '#ffffff',
        bg: '#f5f7fb',
        muted: '#6b7280',
        border: '#e6eef8'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', "'Segoe UI'", 'Roboto', 'Helvetica Neue', 'Arial']
      },
      borderRadius: {
        sm: '8px'
      }
    }
  },
  plugins: []
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        bg: '#f5f7fb',
        surface: '#ffffff',
        muted: '#6b7280',
        border: '#e6eef8'
      },
      borderRadius: {
        sm: '8px'
      }
    }
  },
  plugins: []
}
