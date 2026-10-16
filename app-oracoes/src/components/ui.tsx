import { PropsWithChildren, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PixelBrandMark, PixelSparkles } from '@/components/pixel-art';
import { colors, fonts, layout, pixelShadow } from '@/theme';

type PageProps = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  scrollProps?: ScrollViewProps;
}>;

export function Page({ children, scroll = true, contentStyle, scrollProps }: PageProps) {
  const insets = useSafeAreaInsets();
  const tabBarClearance =
    layout.tabBarContentHeight +
    Math.max(insets.bottom, layout.tabBarMinBottom) +
    layout.tabBarContentGap;
  const content = (
    <View style={[styles.pageContent, { paddingBottom: tabBarClearance }, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View pointerEvents="none" style={styles.decorTop} />
      <View pointerEvents="none" style={styles.decorSide} />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          {...scrollProps}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function BrandMark() {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandRune}>
        <PixelBrandMark size={32} />
      </View>
      <View>
        <Text style={styles.brandName}>SELAHPIXEL</Text>
        <Text style={styles.brandTagline}>GUARDE A PALAVRA. ENCONTRE SUA PAZ.</Text>
      </View>
    </View>
  );
}

export function Eyebrow({ children, style }: PropsWithChildren<{ style?: StyleProp<TextStyle> }>) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.titleBlock}>
      <Text style={styles.screenTitle}>{title}</Text>
      {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionRune} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  tone?: 'gold' | 'dark' | 'parchment' | 'ruby';
  compact?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PixelButton({
  label,
  onPress,
  icon,
  tone = 'gold',
  compact = false,
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[`button_${tone}`],
        compact && styles.buttonCompact,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}>
      {icon}
      <Text
        style={[
          styles.buttonText,
          tone === 'parchment' && styles.buttonTextDark,
          (tone === 'dark' || tone === 'ruby') && styles.buttonTextLight,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function PixelProgress({ progress, color = colors.gold }: { progress: number; color?: string }) {
  const normalized = Math.max(0, Math.min(1, progress));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.round(normalized * 100)}%`, backgroundColor: color }]} />
      {[25, 50, 75].map((value) => (
        <View key={value} style={[styles.progressNotch, { left: `${value}%` }]} />
      ))}
    </View>
  );
}

export function PixelBadge({ label, color = colors.gold }: { label: string; color?: string }) {
  return (
    <View style={[styles.badge, { borderLeftColor: color }]}>
      <View style={[styles.badgeDot, { backgroundColor: color }]} />
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <View style={styles.emptyState}>
      <PixelSparkles size={54} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.night,
  },
  decorTop: {
    position: 'absolute',
    top: 38,
    right: -24,
    width: 96,
    height: 8,
    backgroundColor: colors.panel,
    transform: [{ rotate: '45deg' }],
  },
  decorSide: {
    position: 'absolute',
    top: 220,
    left: -4,
    width: 8,
    height: 46,
    backgroundColor: colors.goldDark,
    opacity: 0.35,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  pageContent: {
    width: '100%',
    maxWidth: layout.maxWidth,
    paddingHorizontal: layout.pagePadding,
    paddingTop: 12,
    gap: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandRune: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.goldBright,
    borderBottomColor: colors.goldDark,
    borderRightColor: colors.goldDark,
  },
  brandName: {
    color: colors.parchmentLight,
    fontFamily: fonts.display,
    fontSize: 17,
    letterSpacing: 1.2,
    lineHeight: 21,
  },
  brandTagline: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    maxWidth: 174,
    fontSize: 7,
    lineHeight: 10,
    letterSpacing: 0.35,
  },
  eyebrow: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  titleBlock: {
    gap: 6,
  },
  screenTitle: {
    color: colors.parchmentLight,
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 39,
  },
  screenSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  sectionRune: {
    width: 6,
    height: 18,
    backgroundColor: colors.gold,
    borderBottomWidth: 4,
    borderBottomColor: colors.goldDark,
  },
  sectionTitle: {
    color: colors.parchmentLight,
    fontFamily: fonts.display,
    fontSize: 20,
  },
  button: {
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 2,
    borderBottomWidth: 5,
    ...pixelShadow,
  },
  buttonCompact: {
    minHeight: 38,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderBottomWidth: 4,
  },
  button_gold: {
    backgroundColor: colors.gold,
    borderColor: colors.goldBright,
    borderBottomColor: colors.goldDark,
  },
  button_dark: {
    backgroundColor: colors.panelLight,
    borderColor: colors.line,
    borderBottomColor: colors.black,
  },
  button_parchment: {
    backgroundColor: colors.parchmentLight,
    borderColor: colors.white,
    borderBottomColor: colors.parchmentDark,
  },
  button_ruby: {
    backgroundColor: colors.ruby,
    borderColor: '#D97B6E',
    borderBottomColor: colors.rubyDark,
  },
  buttonPressed: {
    transform: [{ translateY: 3 }],
    borderBottomWidth: 2,
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: colors.night,
    fontFamily: fonts.pixel,
    fontSize: 12,
    flexShrink: 1,
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  buttonTextDark: {
    color: colors.ink,
  },
  buttonTextLight: {
    color: colors.parchmentLight,
  },
  progressTrack: {
    height: 12,
    backgroundColor: colors.night,
    borderWidth: 2,
    borderColor: colors.black,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressNotch: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.black,
    opacity: 0.5,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: colors.line,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: 'rgba(16,19,29,0.65)',
  },
  badgeDot: {
    width: 5,
    height: 5,
  },
  badgeText: {
    color: colors.parchmentLight,
    fontFamily: fonts.pixel,
    fontSize: 10,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 28,
    paddingVertical: 42,
    backgroundColor: colors.panel,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 6,
    borderBottomColor: colors.black,
  },
  emptyTitle: {
    color: colors.parchmentLight,
    fontFamily: fonts.display,
    fontSize: 22,
    textAlign: 'center',
  },
  emptyMessage: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});
