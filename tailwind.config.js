module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{js,html}"],
  theme: {
    extend: {
      colors: {
        primary: "#22336B",
        gold: "#D1A648"
      },
      fontFamily: {
        sans: ["Montserrat", "Poppins", "sans-serif"],
        brand: ["BreweryNo2W01-Regular", "Brewery No2", "serif"],
        "brand-black": ["Brewery No2 W06 Black", "Brewery No2", "serif"],
        secondary: ["Montserrat", "Poppins", "sans-serif"]
      }
    }
  },
  plugins: []
};