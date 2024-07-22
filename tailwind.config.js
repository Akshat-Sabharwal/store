export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "accent-200": "hsl(180, 60%, 95%)",
        "accent-400": "hsl(180, 42%, 93%)",
        "accent-600": "hsl(180, 30%, 75%)",
        "accent-800": "hsl(180, 16%, 52%)",
      },
      fontFamily: {
        code: "Consolas, monaco, monospace",
      },
    },
  },
  plugins: [],
};
