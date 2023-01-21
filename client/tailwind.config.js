module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  variants: {
    textTruncate: ["responsive"],
  },
  theme: {
    extend: {
      borderRadius: {
        circle: "50%",
      },

      // fixed: {
      //   position: "fixed",
      //   top: 0,
      //   left: 0,
      //   width: "100%",
      //   height: "100%",
      // },
    },
    // that is animation class
    keyframes: {
      "fade-in-down": {
        "0%": {
          opacity: "0",
          transform: "translateY(-20px)",
        },
        "100%": {
          opacity: "1",
          transform: "translateY(0)",
        },
      },
      pulse: {
        "0%, 100%": {
          opacity: 1,
        },
        "50%": {
          opacity: 0.5,
        },
      },
    },
    animation: {
      "fade-in-down": "fade-in-down 0.5s ease-out",
      "fade-in-down-slow": "fade-in-down 2s ease-out",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },

    screens: {
      xs: "400px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/aspect-ratio"),
    function ({ addVariant, e }) {
      addVariant("textTruncate", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`textTruncate${separator}${className}`)} {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }`;
        });
      });
    },
  ],
};
