/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                heritageTeal: "#0D9488",
                mantapOrange: "#F97316",
                stickyYellow: "#FEF9C3",
                lightBlue: "#E0F2FE",
                softGreen: "#DCFCE7",
                warmPink: "#FCE7F3",
            },
            fontFamily: {
                jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
                handwritten: ['"Gochi Hand"', "cursive"],
            },
        },
    },
    plugins: [],
}
