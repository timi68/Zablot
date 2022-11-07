/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  important: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./views/*.ejs",
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
        $skyblue: "rgba(173, 199, 215, 0.38)",
        $error: "#9d353540",
        "$text-primary": "#3c6063",
        "$text-success": "#2bdd3d",
        "$text-secondary": "rgba(0,0,0,0.8)",
        "$btn-primary": "#82b5d2",
        "$btn-secondary": "#369298",
        $transition: "all 0.3s ease-in-out",
        $hover: "#135062",
        "$shadow-primary": "0 0 50px 3px rgba(173, 199, 215, 0.38)",
        "$shadow-secondary": "0 0 20px 0px rgba(173, 199, 215, 0.38)",
        "$shadow-error": "0 0 20px 0px #9d353540",
      },
    },
  },
  plugins: [],
};
