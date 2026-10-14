import { Platform } from 'react-native';

export const colors = {
  night: '#10131D',
  nightSoft: '#171C2B',
  panel: '#202739',
  panelLight: '#2B3348',
  ink: '#28231D',
  parchment: '#F2E5C5',
  parchmentLight: '#FFF8E8',
  parchmentDark: '#D7C49D',
  gold: '#E7B85C',
  goldBright: '#FFD77A',
  goldDark: '#8E622A',
  ruby: '#A94C49',
  rubyDark: '#6E3032',
  sage: '#70A27A',
  sageDark: '#345C45',
  blue: '#668DB2',
  blueDark: '#354F70',
  violet: '#8C79A8',
  text: '#FFF8E8',
  textMuted: '#AAB0C0',
  line: '#394158',
  black: '#080A10',
  white: '#FFFFFF',
};

export const fonts = {
  display: Platform.select({
    ios: 'Georgia-Bold',
    android: 'serif',
    default: 'Georgia',
  }),
  body: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif',
    default: 'system-ui',
  }),
  pixel: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'Arial',
  }),
};

export const layout = {
  pagePadding: 20,
  radius: 4,
  maxWidth: 620,
  tabBarSpace: 94,
};

export const pixelShadow = {
  shadowColor: colors.black,
  shadowOffset: { width: 4, height: 5 },
  shadowOpacity: 0.35,
  shadowRadius: 0,
  elevation: 7,
};
