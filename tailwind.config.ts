import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { defaultTheme } from "@maany_shr/rage-ui-kit";
export default {
  content: [
    "node_modules/@maany_shr/rage-ui-kit/dist/**/*.js",
    "./src/**/*.tsx"
  ],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  theme: {
    ...defaultTheme,
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
