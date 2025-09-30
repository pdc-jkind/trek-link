import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core Colors
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--on-primary) / <alpha-value>)',
          container: 'rgb(var(--primary-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--on-primary-container) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--on-secondary) / <alpha-value>)',
          container: 'rgb(var(--secondary-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--on-secondary-container) / <alpha-value>)',
        },
        tertiary: {
          DEFAULT: 'rgb(var(--tertiary) / <alpha-value>)',
          foreground: 'rgb(var(--on-tertiary) / <alpha-value>)',
          container: 'rgb(var(--tertiary-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--on-tertiary-container) / <alpha-value>)',
        },
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--on-background) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          foreground: 'rgb(var(--on-surface) / <alpha-value>)',
          variant: 'rgb(var(--surface-variant) / <alpha-value>)',
          'variant-foreground': 'rgb(var(--on-surface-variant) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--error) / <alpha-value>)',
          foreground: 'rgb(var(--on-error) / <alpha-value>)',
          container: 'rgb(var(--error-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--on-error-container) / <alpha-value>)',
        },
        
        // Neutral & Outline
        outline: {
          DEFAULT: 'rgb(var(--outline) / <alpha-value>)',
          variant: 'rgb(var(--outline-variant) / <alpha-value>)',
        },
        inverse: {
          surface: 'rgb(var(--inverse-surface) / <alpha-value>)',
          'surface-foreground': 'rgb(var(--inverse-on-surface) / <alpha-value>)',
          primary: 'rgb(var(--inverse-primary) / <alpha-value>)',
        },
        
        // State Colors
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          foreground: 'rgb(var(--on-success) / <alpha-value>)',
          container: 'rgb(var(--success-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--on-success-container) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          foreground: 'rgb(var(--on-warning) / <alpha-value>)',
          container: 'rgb(var(--warning-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--on-warning-container) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--info) / <alpha-value>)',
          foreground: 'rgb(var(--on-info) / <alpha-value>)',
          container: 'rgb(var(--info-container) / <alpha-value>)',
          'container-foreground': 'rgb(var(--on-info-container) / <alpha-value>)',
        },
        disabled: {
          DEFAULT: 'rgb(var(--disabled) / <alpha-value>)',
          foreground: 'rgb(var(--on-disabled) / <alpha-value>)',
        },
        
        // Elevation Surfaces
        elevation: {
          1: 'rgb(var(--surface-1) / <alpha-value>)',
          2: 'rgb(var(--surface-2) / <alpha-value>)',
          3: 'rgb(var(--surface-3) / <alpha-value>)',
          4: 'rgb(var(--surface-4) / <alpha-value>)',
          5: 'rgb(var(--surface-5) / <alpha-value>)',
        },
        
        // Legacy aliases for backward compatibility
        border: 'rgb(var(--outline) / <alpha-value>)',
        muted: {
          DEFAULT: 'rgb(var(--surface-variant) / <alpha-value>)',
          foreground: 'rgb(var(--on-surface-variant) / <alpha-value>)',
        },
        ring: 'rgb(var(--primary) / <alpha-value>)',
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
      },
      
      borderRadius: {
        '2xs': '0.125rem',
        'xs': '0.25rem',
        '4xl': '2rem',
      },
      
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'elevation-1': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'elevation-2': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'elevation-3': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'glow': '0 0 20px rgb(var(--primary) / 0.15)',
        'glow-lg': '0 0 40px rgb(var(--primary) / 0.2)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-1rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

export default config