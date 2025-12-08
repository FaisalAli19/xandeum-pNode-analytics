import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customTheme = defineConfig({
  theme: {
    tokens: {
      colors: {
        cream: {
          50: { value: 'rgba(252, 252, 249, 1)' },
          100: { value: 'rgba(255, 255, 253, 1)' },
        },
        gray: {
          100: { value: 'rgba(240, 240, 240, 1)' },
          200: { value: 'rgba(245, 245, 245, 1)' },
          300: { value: 'rgba(167, 169, 169, 1)' },
          400: { value: 'rgba(119, 124, 124, 1)' },
        },
        slate: {
          500: { value: 'rgba(98, 108, 113, 1)' },
          900: { value: 'rgba(19, 52, 59, 1)' },
        },
        brown: {
          600: { value: 'rgba(94, 82, 64, 1)' },
        },
        charcoal: {
          700: { value: 'rgba(31, 33, 33, 1)' },
          800: { value: 'rgba(38, 40, 40, 1)' },
        },
        teal: {
          300: { value: 'rgba(50, 184, 198, 1)' },
          400: { value: 'rgba(45, 166, 178, 1)' },
          500: { value: 'rgba(33, 128, 141, 1)' },
          600: { value: 'rgba(29, 116, 128, 1)' },
          700: { value: 'rgba(26, 104, 115, 1)' },
          800: { value: 'rgba(20, 90, 100, 1)' },
        },
        red: {
          400: { value: 'rgba(255, 84, 89, 1)' },
          500: { value: 'rgba(192, 21, 47, 1)' },
        },
        orange: {
          400: { value: 'rgba(230, 129, 97, 1)' },
          500: { value: 'rgba(168, 75, 47, 1)' },
        },
        green: {
          500: { value: 'rgba(34, 197, 94, 1)' },
        },
      },
      fonts: {
        body: { value: 'Inter, "Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, sans-serif' },
        heading: {
          value: 'Inter, "Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
        },
      },
      fontSizes: {
        xs: { value: '10px' },
        sm: { value: '12px' },
        md: { value: '14px' },
        lg: { value: '16px' },
        xl: { value: '18px' },
        '2xl': { value: '20px' },
        '3xl': { value: '24px' },
      },
      fontWeights: {
        normal: { value: '400' },
        medium: { value: '500' },
        semibold: { value: '550' },
        bold: { value: '600' },
      },
      radii: {
        sm: { value: '6px' },
        md: { value: '8px' },
        lg: { value: '10px' },
        xl: { value: '12px' },
      },
      spacing: {
        4: { value: '4px' },
        8: { value: '8px' },
        12: { value: '12px' },
        16: { value: '16px' },
        20: { value: '20px' },
        24: { value: '24px' },
        32: { value: '32px' },
      },
      shadows: {
        sm: { value: '0 1px 3px rgba(0, 0, 0, 0.04)' },
        md: { value: '0 4px 6px -1px rgba(0, 0, 0, 0.04)' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          value: {
            base: '{colors.gray.100}',
            _dark: '{colors.charcoal.700}',
          },
        },
        surface: {
          value: {
            base: '{colors.gray.200}',
            _dark: '{colors.charcoal.800}',
          },
        },
        fg: {
          value: {
            base: '{colors.slate.900}',
            _dark: '{colors.gray.200}',
          },
        },
        'fg.muted': {
          value: {
            base: '{colors.slate.500}',
            _dark: 'rgba(167, 169, 169, 0.7)',
          },
        },
        primary: {
          value: {
            base: '{colors.teal.500}',
            _dark: '{colors.teal.300}',
          },
        },
        'primary.hover': {
          value: {
            base: '{colors.teal.600}',
            _dark: '{colors.teal.400}',
          },
        },
        'primary.active': {
          value: {
            base: '{colors.teal.700}',
            _dark: '{colors.teal.800}',
          },
        },
        secondary: {
          value: {
            base: 'rgba(94, 82, 64, 0.12)',
            _dark: 'rgba(119, 124, 124, 0.15)',
          },
        },
        'secondary.hover': {
          value: {
            base: 'rgba(94, 82, 64, 0.2)',
            _dark: 'rgba(119, 124, 124, 0.25)',
          },
        },
        border: {
          value: {
            base: 'rgba(94, 82, 64, 0.2)',
            _dark: 'rgba(119, 124, 124, 0.3)',
          },
        },
        'card.border': {
          value: {
            base: 'rgba(94, 82, 64, 0.12)',
            _dark: 'rgba(119, 124, 124, 0.2)',
          },
        },
        error: {
          value: {
            base: '{colors.red.500}',
            _dark: '{colors.red.400}',
          },
        },
        success: {
          value: {
            base: '{colors.green.500}',
            _dark: '{colors.green.500}',
          },
        },
        warning: {
          value: {
            base: '{colors.orange.500}',
            _dark: '{colors.orange.400}',
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customTheme);
