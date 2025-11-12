import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-ocean': 'var(--color-deep-ocean)',
        'dark-navy': 'var(--color-dark-navy)',
        'nautical-blue': 'var(--color-nautical-blue)',
        'ocean-teal': 'var(--color-ocean-teal)',
        'sonar-green': 'var(--color-sonar-green)',
        'warning-amber': 'var(--color-warning-amber)',
        'danger-red': 'var(--color-danger-red)',
        'panel-border': 'var(--color-panel-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
      },
    },
  },
  plugins: [],
};

export default config;
