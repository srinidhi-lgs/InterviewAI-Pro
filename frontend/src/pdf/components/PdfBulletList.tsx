import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFTheme } from '../PDFTheme';

const styles = StyleSheet.create({
  container: {
    marginTop: PDFTheme.spacing[1],
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 10,
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray700,
  },
  bulletText: {
    flex: 1,
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray700,
    lineHeight: 1.4,
  }
});

interface PdfBulletListProps {
  text: string;
}

export const PdfBulletList = ({ text }: PdfBulletListProps) => {
  if (!text) return null;
  
  // Split by newlines, filter empty lines
  const items = text.split('\n').map(t => t.trim()).filter(t => t.length > 0);

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletRow}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};
