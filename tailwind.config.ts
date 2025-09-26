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
        // Primary - Elegant Blue Pastel (Base: #789DBC)
        primary: {
          50: '#f8fafc',   // Very light blue-gray
          100: '#f1f4f8',  // Light blue-gray
          200: '#e3e8f0',  // Lighter blue
          300: '#b8c5d9',  // Soft blue - VISIBLE NOW
          400: '#9fb0cc',  // Medium-light blue
          500: '#789DBC',  // Your base color
          600: '#6b8aac',  // Slightly darker blue
          700: '#5a7293',  // Medium dark blue - VISIBLE NOW
          800: '#475569',  // Dark blue-gray
          900: '#334155',  // Very dark blue - VISIBLE NOW
          950: '#1e293b',  // Darkest
          DEFAULT: '#789DBC',
          foreground: '#ffffff',
        },
        
        // Secondary - Warm Pink Pastel (Base: #FFE3E3)
        secondary: {
          50: '#fef7f7',   // Very light pink
          100: '#fde8e8',  // Light pink - VISIBLE NOW
          200: '#fbd5d5',  // Lighter pink
          300: '#f8b4b4',  // Soft pink
          400: '#f48888',  // Medium pink
          500: '#ef5a5a',  // Deeper pink
          600: '#dc2f2f',  // Strong pink-red - VISIBLE NOW
          700: '#b91c1c',  // Dark red
          800: '#991b1b',  // Darker red
          900: '#7f1d1d',  // Very dark red
          950: '#450a0a',  // Darkest
          DEFAULT: '#fde8e8', // Use lighter shade as default
          foreground: '#7f1d1d',
        },
        
        // Accent - Warm Cream (Base: #FEF9F2)
        accent: {
          50: '#fefbf7',   // Very light cream
          100: '#fdf4e7',  // Light cream
          200: '#fbe8d0',  // Cream
          300: '#f7d7b8',  // Warmer cream
          400: '#f2c29b',  // Light brown
          500: '#e6a87c',  // Warm brown - VISIBLE NOW
          600: '#d4915a',  // Medium brown - VISIBLE NOW
          700: '#b5753f',  // Darker brown
          800: '#92400e',  // Dark brown
          900: '#78350f',  // Very dark brown
          950: '#451a03',  // Darkest
          DEFAULT: '#fdf4e7',
          foreground: '#78350f',
        },
        
        // Success - Elegant Green Pastel (Base: #C9E9D2)
        success: {
          50: '#f0fdf4',   // Very light green
          100: '#dcfce7',  // Light green
          200: '#bbf7d0',  // Lighter green
          300: '#a7f3d0',  // Soft green
          400: '#6ee7b7',  // Medium-light green
          500: '#34d399',  // Medium green
          600: '#10b981',  // Strong green - VISIBLE NOW
          700: '#059669',  // Dark green
          800: '#065f46',  // Darker green
          900: '#064e3b',  // Very dark green
          950: '#022c22',  // Darkest
          DEFAULT: '#dcfce7', // Use lighter shade as default
          foreground: '#064e3b',
        },

        // Semantic Colors
        background: {
          DEFAULT: '#fafbfc',
          subtle: '#f8fafc',
          muted: '#f1f5f9',
        },
        foreground: {
          DEFAULT: '#1a202c',
          muted: '#4a5568',
          subtle: '#718096',
        },
        
        // Borders & Dividers
        border: {
          DEFAULT: '#e2e8f0',
          muted: '#f1f5f9',
        },
        
        // Interactive States
        muted: {
          DEFAULT: '#f8fafc',
          foreground: '#64748b',
        },
        
        // Ring/Focus color
        ring: {
          DEFAULT: '#789DBC', // Same as primary for consistency
        },
        
        // Dark Mode Variants (automatically handled by Tailwind)
        'dark-background': {
          DEFAULT: '#0f1419',
          subtle: '#1a1f2e',
          muted: '#242b3d',
        },
        'dark-foreground': {
          DEFAULT: '#f7fafc',
          muted: '#cbd5e1',
          subtle: '#94a3b8',
        },
        'dark-border': {
          DEFAULT: '#2d3748',
          muted: '#1a202c',
        },
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
        'glow': '0 0 20px rgb(120 157 188 / 0.15)',
        'glow-lg': '0 0 40px rgb(120 157 188 / 0.2)',
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