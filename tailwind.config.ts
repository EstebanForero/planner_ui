import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      gridTemplateRows: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))'
      },
      gridRowStart: {
        '14': '14'
      }
    },
  },
  safelist: [
    ...Array.from({ length: 6 }, (_, i) => `col-start-${i + 2}`),
    ...Array.from({ length: 13 }, (_, i) => `row-start-${i + 2}`),
    {
      pattern: /(bg|border|text|ring)-(red|green|blue|yellow|purple|pink|gray|indigo|teal|cyan|orange|lime)-(100|200|300|400|500|600|700|800|900)/,
      variants: ['hover'],
    },
    {
      pattern: /(bg|border|text)-(red|green|blue|yellow|purple|pink|gray|indigo|teal|cyan|orange|lime)-(100|200|300|400|500|600|700|800|900)\/(10|15|20|25|30|40|50|60|70|75|80|90)/,
    }
  ],
  plugins: [],
} satisfies Config;
