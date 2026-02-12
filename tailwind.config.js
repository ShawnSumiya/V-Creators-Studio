/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // slate-900 (深めの背景)
        surface: '#1e293b',    // slate-800 (カード背景)
        primary: '#a855f7',    // ネオンパープル
        secondary: '#06b6d4',  // シアン
        accent: '#f43f5e',     // アクセント
        text: '#f8fafc',       // テキスト
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

