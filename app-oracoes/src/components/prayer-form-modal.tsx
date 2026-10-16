import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PixelCandle, PixelHeart, PixelPrayer, PixelScroll, PixelShield } from '@/components/pixel-art';
import { PixelButton } from '@/components/ui';
import { markColors, useProgress } from '@/context/progress-context';
import { Prayer } from '@/data/content';
import { colors, fonts, pixelShadow } from '@/theme';
import { DayPeriod, periodLabels } from '@/utils/date';

type PrayerFormModalProps = { visible: boolean; prayer?: Prayer | null; onClose: () => void };
type PrayerIcon = Prayer['icon'];
const prayerIconLabels: Record<PrayerIcon, string> = {
  candle: 'Vela',
  shield: 'Escudo',
  heart: 'Coração',
  scroll: 'Palavra',
};

export function PrayerFormModal({ visible, prayer, onClose }: PrayerFormModalProps) {
  const insets = useSafeAreaInsets();
  const { addPrayer, updatePrayer } = useProgress();
  const [title, setTitle] = useState(() => prayer?.title ?? '');
  const [subtitle, setSubtitle] = useState(() => prayer?.subtitle ?? '');
  const [duration, setDuration] = useState(() => prayer?.duration ?? '3 min');
  const [focus, setFocus] = useState(() => prayer?.focus ?? 'Minha oração');
  const [text, setText] = useState(() => prayer?.text ?? '');
  const [verseReference, setVerseReference] = useState(() => prayer?.verseReference ?? '');
  const [period, setPeriod] = useState<DayPeriod | 'qualquer'>(() => prayer?.period ?? 'qualquer');
  const [color, setColor] = useState(() => prayer?.color ?? markColors[0]);
  const [icon, setIcon] = useState<PrayerIcon>(() => prayer?.icon ?? 'candle');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = () => {
    if (submitting) return;
    if (!title.trim() || !text.trim()) {
      setError('Informe o título e o texto da oração.');
      return;
    }
    setSubmitting(true);
    const draft = {
      title: title.trim(),
      subtitle: subtitle.trim() || 'Oração pessoal',
      duration: duration.trim() || '3 min',
      focus: focus.trim() || 'Oração pessoal',
      text: text.trim(),
      verseReference: verseReference.trim() || 'Oração pessoal',
      period,
      color,
      icon,
    };
    if (prayer) updatePrayer(prayer.id, draft);
    else addPrayer(draft);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" presentationStyle="overFullScreen" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[
          styles.root,
          { paddingTop: Math.max(insets.top, 10), paddingBottom: Math.max(insets.bottom, 10) },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable accessibilityLabel="Fechar formulário" style={styles.backdrop} onPress={onClose} />
        <View accessibilityViewIsModal style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <PixelPrayer size={54} />
              <View style={styles.headerCopy}>
                <Text style={styles.eyebrow}>{prayer ? 'ATUALIZAR ORAÇÃO' : 'NOVA ORAÇÃO'}</Text>
                <Text style={styles.title}>{prayer ? 'Editar oração' : 'Adicionar oração'}</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Fechar formulário de oração" hitSlop={8} onPress={onClose} style={styles.close}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <Field label="TÍTULO *" value={title} onChangeText={setTitle} placeholder="Ex.: Oração pela minha família" />
            <Field label="DESCRIÇÃO CURTA" value={subtitle} onChangeText={setSubtitle} placeholder="Ex.: Proteção e união" />
            <View style={styles.doubleRow}>
              <View style={styles.half}><Field label="DURAÇÃO" value={duration} onChangeText={setDuration} placeholder="3 min" /></View>
              <View style={styles.half}><Field label="FOCO" value={focus} onChangeText={setFocus} placeholder="Família" /></View>
            </View>
            <Field label="TEXTO DA ORAÇÃO *" value={text} onChangeText={setText} placeholder="Escreva sua oração..." multiline />
            <Field label="REFERÊNCIA BÍBLICA" value={verseReference} onChangeText={setVerseReference} placeholder="Ex.: Salmos 91" />

            <View style={styles.group}>
              <Text style={styles.label}>MELHOR PERÍODO</Text>
              <View style={styles.wrapOptions}>
                {(['manha', 'tarde', 'noite', 'qualquer'] as const).map((item) => (
                  <Option key={item} label={item === 'qualquer' ? 'Qualquer hora' : periodLabels[item]} active={period === item} onPress={() => setPeriod(item)} />
                ))}
              </View>
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>ÍCONE</Text>
              <View style={styles.iconRow}>
                {(['candle', 'shield', 'heart', 'scroll'] as const).map((item) => (
                  <Pressable
                    key={item}
                    accessibilityRole="radio"
                    accessibilityLabel={`Ícone ${prayerIconLabels[item]}`}
                    accessibilityState={{ checked: icon === item }}
                    onPress={() => setIcon(item)}
                    style={[styles.iconOption, icon === item && styles.iconOptionActive]}>
                    <PrayerIconArt icon={item} />
                    <Text style={[styles.iconLabel, icon === item && styles.iconLabelActive]}>{prayerIconLabels[item]}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>COR</Text>
              <View style={styles.colorRow}>
                {markColors.map((item, index) => (
                  <Pressable
                    key={item}
                    accessibilityRole="radio"
                    accessibilityLabel={`Cor ${['dourada', 'verde', 'azul', 'vermelha', 'violeta'][index]}`}
                    accessibilityState={{ checked: color === item }}
                    onPress={() => setColor(item)}
                    style={[styles.colorOption, { backgroundColor: item }, color === item && styles.colorOptionActive]}>
                    {color === item ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                ))}
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            <PixelButton
              label={submitting ? 'Salvando...' : prayer ? 'Salvar alterações' : 'Adicionar oração'}
              disabled={submitting}
              onPress={handleSave}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function PrayerIconArt({ icon }: { icon: PrayerIcon }) {
  if (icon === 'shield') return <PixelShield size={38} />;
  if (icon === 'heart') return <PixelHeart size={38} />;
  if (icon === 'scroll') return <PixelScroll size={38} />;
  return <PixelCandle size={38} />;
}

function Field({ label, multiline, ...props }: { label: string; multiline?: boolean; value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return <View style={styles.group}><Text style={styles.label}>{label}</Text><TextInput {...props} accessibilityLabel={label.replace(' *', '')} multiline={multiline} placeholderTextColor="#8D806A" textAlignVertical={multiline ? 'top' : 'center'} style={[styles.input, multiline && styles.textArea]} /></View>;
}

function Option({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="radio" accessibilityLabel={label} accessibilityState={{ checked: active }} onPress={onPress} style={[styles.option, active && styles.optionActive]}><Text style={[styles.optionText, active && styles.optionTextActive]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 10 },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(4,5,9,0.82)' },
  sheet: { width: '100%', maxHeight: '100%', alignSelf: 'center', maxWidth: 620, backgroundColor: colors.parchment, borderWidth: 3, borderColor: colors.parchmentLight, borderBottomColor: colors.goldDark, ...pixelShadow },
  content: { padding: 20, paddingBottom: 24, gap: 17 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.goldDark, fontFamily: fonts.pixel, fontSize: 9, letterSpacing: 0.8 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 24 },
  close: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.parchmentDark, borderWidth: 2, borderColor: '#B7A37B' },
  closeText: { color: colors.ink, fontFamily: fonts.pixel, fontSize: 22, lineHeight: 23 },
  group: { gap: 8 },
  label: { color: '#655944', fontFamily: fonts.pixel, fontSize: 10, letterSpacing: 0.7 },
  input: { minHeight: 48, color: colors.ink, backgroundColor: colors.parchmentLight, borderWidth: 2, borderColor: colors.parchmentDark, paddingHorizontal: 12, fontFamily: fonts.body, fontSize: 14 },
  textArea: { minHeight: 120, paddingTop: 12, lineHeight: 21 },
  doubleRow: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  wrapOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { paddingHorizontal: 11, paddingVertical: 9, backgroundColor: '#E1D2B0', borderWidth: 2, borderColor: '#B9A47B' },
  optionActive: { backgroundColor: colors.gold, borderColor: colors.goldDark },
  optionText: { color: '#675A46', fontFamily: fonts.pixel, fontSize: 9 },
  optionTextActive: { color: colors.night },
  iconRow: { flexDirection: 'row', gap: 9 },
  iconOption: { flex: 1, minHeight: 68, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: '#E1D2B0', borderWidth: 2, borderColor: '#B9A47B' },
  iconOptionActive: { backgroundColor: colors.gold, borderColor: colors.goldDark },
  iconLabel: { color: '#675A46', fontFamily: fonts.pixel, fontSize: 8 },
  iconLabelActive: { color: colors.night },
  colorRow: { flexDirection: 'row', gap: 11 },
  colorOption: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.ink },
  colorOptionActive: { transform: [{ translateY: -3 }], borderWidth: 3 },
  check: { width: 21, height: 21, color: colors.night, backgroundColor: colors.parchmentLight, borderWidth: 1, borderColor: colors.ink, fontFamily: fonts.pixel, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  error: { color: colors.rubyDark, fontFamily: fonts.body, fontSize: 13 },
});
