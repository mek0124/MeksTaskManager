/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#506d8f',
        secondary: '#3f9ca8',
        tertiary: '#81cfd9',
        accent: '#c3c8cc',
        fontColor: '#f2f4f7',
      },
    },
  },
  plugins: [],
}

