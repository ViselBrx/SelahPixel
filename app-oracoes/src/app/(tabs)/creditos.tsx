import * as Linking from 'expo-linking';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { PixelNavIcon, PixelSparkles } from '@/components/pixel-art';
import { Page, PixelBadge, PixelButton, ScreenTitle } from '@/components/ui';
import { colors, fonts, pixelShadow } from '@/theme';

const GITHUB_URL = 'https://github.com/ViselBrx';
const EMAIL = 'viselgtw@gmail.com';
const EMAIL_URL = `mailto:${EMAIL}?subject=Contato%20sobre%20o%20SelahPixel`;

async function openLink(url: string, destination: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      'Não foi possível abrir',
      `O SelahPixel não conseguiu abrir ${destination}. Tente novamente ou copie o endereço exibido na tela.`,
      [{ text: 'Entendi' }],
    );
  }
}

export default function CreditsScreen() {
  return (
    <Page>
      <ScreenTitle title="Créditos & gratidão" />

      <View style={styles.gratitudeCard}>
        <View pointerEvents="none" style={styles.sparkles}>
          <PixelSparkles size={58} color={colors.goldDark} />
        </View>
        <View style={styles.gratitudeCopy}>
          <PixelBadge label="Uma pausa de gratidão" color={colors.ruby} />
          <Text style={styles.gratitudeTitle}>Obrigado por caminhar com o SelahPixel.</Text>
          <Text style={styles.gratitudeText}>
            Que cada versículo guardado e cada oração registrada seja uma pausa de fé, presença e paz no seu dia.
          </Text>
          <Text style={styles.enjoy}>ENJOY SUA JORNADA!</Text>
        </View>
      </View>

      <View style={styles.creatorCard}>
        <Text style={styles.eyebrow}>CRIADO POR</Text>
        <Text style={styles.creatorName}>ViselBrx</Text>
        <Text style={styles.creatorText}>
          Obrigado por conhecer este projeto. Se quiser acompanhar outros trabalhos, enviar uma ideia ou simplesmente
          conversar, os canais abaixo estão abertos.
        </Text>

        <View style={styles.contactBlock}>
          <View style={styles.contactCopy}>
            <Text style={styles.contactLabel}>GITHUB</Text>
            <Text selectable style={styles.contactValue}>github.com/ViselBrx</Text>
          </View>
          <PixelButton
            compact
            label="Visitar GitHub"
            icon={<PixelNavIcon name="credits" size={20} color={colors.night} filled />}
            onPress={() => void openLink(GITHUB_URL, 'o GitHub')}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.contactBlock}>
          <View style={styles.contactCopy}>
            <Text style={styles.contactLabel}>CONTATO</Text>
            <Text selectable style={styles.contactValue}>{EMAIL}</Text>
          </View>
          <PixelButton
            compact
            tone="parchment"
            label="Enviar e-mail"
            icon={<PixelNavIcon name="spark" size={18} color={colors.ink} />}
            onPress={() => void openLink(EMAIL_URL, 'seu aplicativo de e-mail')}
          />
        </View>
      </View>

      <View style={styles.finalMessage}>
        <PixelSparkles size={42} />
        <Text style={styles.finalTitle}>Provérbios 29:18</Text>
        <Text style={styles.finalText}>“O que guarda a lei, esse é bem-aventurado.”</Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  gratitudeCard: {
    minHeight: 254,
    overflow: 'hidden',
    padding: 18,
    backgroundColor: colors.parchment,
    borderWidth: 3,
    borderColor: colors.parchmentLight,
    borderBottomWidth: 8,
    borderBottomColor: '#9C8964',
    ...pixelShadow,
  },
  sparkles: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.28,
  },
  gratitudeCopy: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 11,
    zIndex: 1,
  },
  gratitudeTitle: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 29,
  },
  gratitudeText: {
    color: '#544A3B',
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  enjoy: {
    color: colors.rubyDark,
    fontFamily: fonts.pixel,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  creatorCard: {
    gap: 13,
    padding: 19,
    backgroundColor: colors.panel,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 6,
    borderBottomColor: colors.black,
  },
  eyebrow: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    fontSize: 10,
    letterSpacing: 1,
  },
  creatorName: {
    color: colors.parchmentLight,
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
  },
  creatorText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  contactBlock: {
    gap: 11,
  },
  contactCopy: {
    gap: 4,
  },
  contactLabel: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    fontSize: 9,
    letterSpacing: 0.8,
  },
  contactValue: {
    color: colors.parchmentLight,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  divider: {
    height: 2,
    backgroundColor: colors.line,
  },
  finalMessage: {
    alignItems: 'center',
    gap: 8,
    padding: 22,
  },
  finalTitle: {
    color: colors.goldBright,
    fontFamily: fonts.display,
    fontSize: 19,
    textAlign: 'center',
  },
  finalText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
