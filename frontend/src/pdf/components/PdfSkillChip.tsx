import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFTheme } from '../PDFTheme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: PDFTheme.spacing[4],
    marginBottom: PDFTheme.spacing[2],
  },
  name: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica-Bold',
    color: PDFTheme.colors.black,
  },
  proficiency: {
    fontSize: PDFTheme.fontSize.xs,
    fontFamily: 'Helvetica-Oblique',
    color: PDFTheme.colors.gray600,
    marginLeft: 4,
  }
});

interface PdfSkillChipProps {
  name: string;
  proficiency?: string;
  primaryColor?: string;
}

export const PdfSkillChip = ({ name, proficiency, primaryColor }: PdfSkillChipProps) => (
  <View style={styles.container}>
    <Text style={[styles.name, primaryColor ? { color: primaryColor } : {}]}>{name}</Text>
    {proficiency && <Text style={styles.proficiency}>({proficiency})</Text>}
  </View>
);
