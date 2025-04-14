/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        "accent-cyan": "var(--accent-cyan)",
        "accent-green": "var(--accent-green)",
        "text-light": "var(--text-light)",
        "text-medium": "var(--text-medium)",
        "text-dark": "var(--text-dark)",
      },
      backgroundImage: {
        'circuit-pattern': "url('/images/circuit-pattern.svg')",
        'scan-gradient': "linear-gradient(to right, var(--accent-cyan), var(--accent-cyan))",
        'radial-gradient': "radial-gradient(circle at center, transparent, var(--primary) 70%)",
      },
      animation: {
        'blink': "blink 1.2s step-end infinite",
        'scan': "scan 1.6s ease-in-out infinite",
        'subtle-pan': "subtlePan 120s linear infinite",
        'bounce': "bounce 1s infinite",
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scan: {
          '0%': { backgroundSize: '0% 2px', backgroundPosition: '0% 100%' },
          '50%': { backgroundSize: '100% 2px', backgroundPosition: '100% 100%' },
          '50.1%': { backgroundSize: '100% 2px', backgroundPosition: '100% 100%' },
          '100%': { backgroundSize: '0% 2px', backgroundPosition: '100% 100%' },
        },
        subtlePan: {
          'from': { backgroundPosition: '0% 0%' },
          'to': { backgroundPosition: '100% 100%' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
} 