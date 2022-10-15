/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whiteblue: "#6e8aca",
        green: "#369298",
        gold: "rgba(89, 83, 34, 0.974)",
        success: "rgb(47 181 47 / 74%)",
        lowgrey: "#ebebeb",
        whitesmoke: "#f5f5f5",
        $transition: "all 0.2s ease-out",
        lightgrey: "#ececec",
      },
    },
  },
  plugins: [],
};
