import { StyleSheet } from '@react-pdf/renderer';

export const PDFTheme = {
  colors: {
    black: '#000000',
    white: '#ffffff',
    gray900: '#111827',
    gray800: '#1f2937',
    gray700: '#374151',
    gray600: '#4b5563',
    gray500: '#6b7280',
    gray400: '#9ca3af',
    gray300: '#d1d5db',
    gray200: '#e5e7eb',
    emerald: '#059669',
    blue: '#2563eb',
    blueDark: '#1e3a8a',
    emeraldDark: '#065f46',
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
  },
  fontSize: {
    xs: 10,
    sm: 11,
    base: 12,
    lg: 14,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
  },
};

export const globalStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: PDFTheme.colors.white,
    padding: PDFTheme.spacing[10],
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: PDFTheme.spacing[6],
  },
  header: {
    marginBottom: PDFTheme.spacing[6],
  },
  title: {
    fontSize: PDFTheme.fontSize['2xl'],
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: PDFTheme.fontSize.lg,
    color: PDFTheme.colors.gray700,
  },
  text: {
    fontSize: PDFTheme.fontSize.sm,
    color: PDFTheme.colors.gray800,
    lineHeight: 1.5,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  italic: {
    fontFamily: 'Helvetica-Oblique',
  },
  link: {
    color: PDFTheme.colors.gray600,
    textDecoration: 'none',
  },
});
