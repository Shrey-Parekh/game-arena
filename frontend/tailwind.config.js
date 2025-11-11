/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B9D',      // Bubblegum Pink
        secondary: '#FFB84D',    // Warm Orange
        accent: '#A78BFA',       // Soft Purple
        success: '#34D399',      // Mint Green
        background: '#FFF8F0',   // Cream
        surface: '#FFFFFF',      // Pure White
        text: '#1F2937',         // Dark Gray
        textLight: '#6B7280',    // Medium Gray
        border: '#E5E7EB',       // Light Gray
      },
      fontFamily: {
        heading: ['Fredoka', 'Quicksand', 'sans-serif'],
        body: ['Inter', 'DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'pop': 'pop 0.3s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'fun': '0 4px 0 0 rgba(0, 0, 0, 0.1)',
        'fun-lg': '0 8px 0 0 rgba(0, 0, 0, 0.1)',
        'fun-hover': '0 6px 0 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
