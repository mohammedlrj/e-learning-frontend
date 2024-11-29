/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors (optional)
        professorBlue: '#1E40AF', // Example for professor role
        studentGreen: '#16A34A',  // Example for student role
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], // Example custom font family
      },
    },
  },
  plugins: [],
}

