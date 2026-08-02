export const Fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export const Typography = {
  h1: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    lineHeight: 34,
    color: '#1C2B39',
  },
  h2: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
    color: '#1C2B39',
  },
  h3: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
    lineHeight: 24,
    color: '#1C2B39',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7C8A',
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: '#1C2B39',
  },
  bodySmall: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7C8A',
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#9BA8B3',
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: '#1C2B39',
  },
  sectionHeader: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: '#6B7C8A',
  },
} as const;
