/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // slate-900 (深めの背景)
        surface: '#1e293b',    // slate-800 (カード背景)
        primary: '#a855f7',    // purple-500 (ネオンパープル)
        secondary: '#06b6d4',  // cyan-500 (シアン)
        accent: '#f43f5e',     // rose-500 (アクセント)
        text: '#f8fafc',       // slate-50 (テキスト)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
