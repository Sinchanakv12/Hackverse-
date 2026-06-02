/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cyber: {
          black: '#09090b',
          dark: '#09090b',
          surface: '#121214',
          border: '#27272a',
          cyan: '#6366f1',
          'cyan-dim': '#4f46e5',
          'cyan-glow': 'rgba(99,102,241,0.15)',
          red: '#f43f5e',
          'red-dim': '#e11d48',
          'red-glow': 'rgba(244,63,94,0.15)',
          green: '#10b981',
          'green-dim': '#059669',
          'green-glow': 'rgba(16,185,129,0.15)',
          yellow: '#f59e0b',
          gray: '#71717a',
          'gray-light': '#d4d4d8',
        },
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.8' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.9' },
          '97%': { opacity: '1' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(255,45,85,0.4)' },
          '50%': { boxShadow: '0 0 24px rgba(255,45,85,0.9), 0 0 48px rgba(255,45,85,0.4)' },
        },
        pulseCyan: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,245,255,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(0,245,255,0.8), 0 0 48px rgba(0,245,255,0.3)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-2px, 1px)' },
          '66%': { transform: 'translate(2px, -1px)' },
        },
      },
      animation: {
        flicker: 'flicker 4s infinite',
        pulseRed: 'pulseRed 2s ease-in-out infinite',
        pulseCyan: 'pulseCyan 3s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite',
        blink: 'blink 1s step-end infinite',
        slideInRight: 'slideInRight 0.4s ease-out',
        glitch: 'glitch 0.3s ease-in-out infinite',
      },
      backgroundImage: {
        'cyber-grid': `
          linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid-sm': '40px 40px',
      },
    },
  },
  plugins: [],
}
