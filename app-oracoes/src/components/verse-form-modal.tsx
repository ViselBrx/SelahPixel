import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PixelBible } from '@/components/pixel-art';
import { PixelButton } from '@/components/ui';
import { useProgress } from '@/context/progress-context';
import { themes, Verse, VerseTheme } from '@/data/content';
import { colors, fonts, pixelShadow } from '@/theme';

type VerseFormModalProps = {
  visible: boolean;
  verse?: Verse | null;
  onClose: () => void;
};

export function VerseFormModal({ visible, verse, onClose }: VerseFormModalProps) {
  const insets = useSafeAreaInsets();
  const { addVerse, updateVerse } = useProgress();
  const [reference, setReference] = useState(() => verse?.reference ?? '');
  const [book, setBook] = useState(() => verse?.book ?? '');
  const [text, setText] = useState(() => verse?.text ?? '');
  const [theme, setTheme] = useState<VerseTheme>(() => verse?.theme ?? 'Promessas');
  const [testament, setTestament] = useState<'Antigo' | 'Novo'>(() => verse?.testament ?? 'Novo');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = () => {
    if (submitting) return;
    if (!reference.trim() || !text.trim()) {
      setError('Informe a referência e o texto do versículo.');
      return;
    }
    setSubmitting(true);
    const draft = {
      reference: reference.trim(),
      book: book.trim() || reference.trim().split(/\s+/)[0],
      text: text.trim(),
      theme,
      testament,
    };
    if (verse) updateVerse(verse.id, draft);
    else addVerse(draft);
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
              <PixelBible size={56} />
              <View style={styles.headerCopy}>
                <Text style={styles.eyebrow}>{verse ? 'ATUALIZAR CONTEÚDO' : 'NOVO CONTEÚDO'}</Text>
                <Text style={styles.title}>{verse ? 'Editar versículo' : 'Adicionar versículo'}</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Fechar formulário de versículo" hitSlop={8} onPress={onClose} style={styles.close}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <Field label="REFERÊNCIA *" value={reference} onChangeText={setReference} placeholder="Ex.: João 14:6" />
            <Field label="LIVRO" value={book} onChangeText={setBook} placeholder="Ex.: João" />
            <Field label="TEXTO DO VERSÍCULO *" value={text} onChangeText={setText} placeholder="Digite o versículo..." multiline />

            <View style={styles.group}>
              <Text style={styles.label}>TEMA</Text>
              <View style={styles.wrapOptions}>
                {themes.map((item) => (
                  <Option key={item} label={item} active={theme === item} onPress={() => setTheme(item)} />
                ))}
              </View>
            </View>

            <View style={styles.group}>
              <Text style={styles.label}>TESTAMENTO</Text>
              <View style={styles.optionsRow}>
                {(['Antigo', 'Novo'] as const).map((item) => (
                  <Option key={item} label={item} active={testament === item} onPress={() => setTestament(item)} grow />
                ))}
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            <PixelButton
              label={submitting ? 'Salvando...' : verse ? 'Salvar alterações' : 'Adicionar versículo'}
              disabled={submitting}
              onPress={handleSave}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, multiline, ...props }: { label: string; multiline?: boolean; value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label.replace(' *', '')}
        multiline={multiline}
        placeholderTextColor="#8D806A"
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

function Option({ label, active, onPress, grow = false }: { label: string; active: boolean; onPress: () => void; grow?: boolean }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: active }}
      onPress={onPress}
      style={[styles.option, grow && styles.optionGrow, active && styles.optionActive]}>
      <Text style={[styles.optionText, active && styles.optionTextActive]}>{label}</Text>
    </Pressable>
  );
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
  textArea: { minHeight: 105, paddingTop: 12, lineHeight: 21 },
  wrapOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionsRow: { flexDirection: 'row', gap: 8 },
  option: { paddingHorizontal: 11, paddingVertical: 9, backgroundColor: '#E1D2B0', borderWidth: 2, borderColor: '#B9A47B' },
  optionGrow: { flex: 1, alignItems: 'center' },
  optionActive: { backgroundColor: colors.gold, borderColor: colors.goldDark },
  optionText: { color: '#675A46', fontFamily: fonts.pixel, fontSize: 9 },
  optionTextActive: { color: colors.night },
  error: { color: colors.rubyDark, fontFamily: fonts.body, fontSize: 13 },
});
