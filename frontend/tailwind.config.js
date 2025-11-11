/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',      // Vibrant Purple
        secondary: '#FF6B9D',    // Coral Pink
        accent: '#FCD34D',       // Sunny Yellow
        background: '#0F172A',   // Deep Navy
        surface: '#1E293B',      // Dark Slate
        text: '#F1F5F9',         // Off-White
      },
      fontFamily: {
        heading: ['Fredoka', 'Quicksand', 'sans-serif'],
        body: ['Inter', 'DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
