// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#ffb300',
//         'primary-light': '#ffc929',
//         secondary: '#00b050',
//         'secondary-light': '#0b1a78',
//       },
//     },
//   },
//   plugins: [],
// };



/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🔹 Code-1 (UNCHANGED)
        primary: '#ffb300',
        'primary-light': '#ffc929',
        secondary: '#00b050',
        'secondary-light': '#0b1a78',

        // 🆕 Code-2 additions (ADDED ONLY)
        'primary-200': '#ffbf00',
        'primary-100': '#ffc929',
        'secondary-200': '#00b050',
        'secondary-100': '#0b1a78',
      },
    },
  },
  plugins: [],
};
