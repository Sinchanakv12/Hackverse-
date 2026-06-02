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
          black: '#050508',
          dark: '#0a0a0f',
          surface: '#0f0f1a',
          border: '#1a1a2e',
          cyan: '#00f5ff',
          'cyan-dim': '#00b8c8',
          'cyan-glow': 'rgba(0,245,255,0.15)',
          red: '#ff2d55',
          'red-dim': '#cc2244',
          'red-glow': 'rgba(255,45,85,0.15)',
          green: '#39ff14',
          'green-dim': '#2acc0f',
          'green-glow': 'rgba(57,255,20,0.15)',
          yellow: '#ffd60a',
          gray: '#8892a4',
          'gray-light': '#b0bec5',
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
