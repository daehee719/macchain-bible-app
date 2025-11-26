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
