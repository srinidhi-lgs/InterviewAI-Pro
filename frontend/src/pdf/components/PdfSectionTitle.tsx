import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFTheme } from '../PDFTheme';

const styles = StyleSheet.create({
  container: {
    marginBottom: PDFTheme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: PDFTheme.colors.gray300,
    borderBottomStyle: 'solid',
    paddingBottom: PDFTheme.spacing[1],
  },
  title: {
    fontSize: PDFTheme.fontSize.lg,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

interface PdfSectionTitleProps {
  title: string;
  color?: string;
  borderColor?: string;
}

export const PdfSectionTitle = ({ title, color = PDFTheme.colors.black, borderColor = PDFTheme.colors.gray300 }: PdfSectionTitleProps) => (
  <View style={[styles.container, { borderBottomColor: borderColor }]} wrap={false}>
    <Text style={[styles.title, { color }]}>{title}</Text>
  </View>
);
