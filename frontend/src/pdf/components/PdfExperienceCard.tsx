import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFTheme } from '../PDFTheme';

const styles = StyleSheet.create({
  container: {
    marginBottom: PDFTheme.spacing[4],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  position: {
    fontSize: PDFTheme.fontSize.base,
    fontFamily: 'Helvetica-Bold',
    color: PDFTheme.colors.black,
  },
  date: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray600,
  },
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PDFTheme.spacing[2],
  },
  company: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica-Oblique',
    color: PDFTheme.colors.gray800,
  },
  location: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray600,
  },
  description: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray700,
    lineHeight: 1.5,
  }
});

interface PdfExperienceCardProps {
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  primaryColor?: string;
}

export const PdfExperienceCard = ({
  position,
  company,
  location,
  startDate,
  endDate,
  isCurrent,
  description,
  primaryColor
}: PdfExperienceCardProps) => (
  <View style={styles.container} wrap={false}>
    <View style={styles.headerRow}>
      <Text style={[styles.position, primaryColor ? { color: primaryColor } : {}]}>{position}</Text>
      <Text style={styles.date}>{startDate} - {isCurrent ? 'Present' : endDate}</Text>
    </View>
    <View style={styles.companyRow}>
      <Text style={styles.company}>{company}</Text>
      {location && <Text style={styles.location}>{location}</Text>}
    </View>
    {description && (
      <Text style={styles.description}>
        {description}
      </Text>
    )}
  </View>
);
