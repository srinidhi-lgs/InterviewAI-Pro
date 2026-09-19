import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFTheme } from '../PDFTheme';

const styles = StyleSheet.create({
  container: {
    marginBottom: PDFTheme.spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  institution: {
    fontSize: PDFTheme.fontSize.base,
    fontFamily: 'Helvetica-Bold',
    color: PDFTheme.colors.black,
  },
  date: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray600,
  },
  degreeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PDFTheme.spacing[1],
  },
  degree: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray800,
  },
  gpa: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray600,
  },
  description: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray700,
    marginTop: 2,
    lineHeight: 1.5,
  }
});

interface PdfEducationCardProps {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  gpa?: string;
  description?: string;
  primaryColor?: string;
}

export const PdfEducationCard = ({
  institution,
  degree,
  fieldOfStudy,
  startDate,
  endDate,
  isCurrent,
  gpa,
  description,
  primaryColor
}: PdfEducationCardProps) => (
  <View style={styles.container} wrap={false}>
    <View style={styles.headerRow}>
      <Text style={[styles.institution, primaryColor ? { color: primaryColor } : {}]}>{institution}</Text>
      <Text style={styles.date}>{startDate} - {isCurrent ? 'Present' : endDate}</Text>
    </View>
    <View style={styles.degreeRow}>
      <Text style={styles.degree}>{degree} {fieldOfStudy ? `in ${fieldOfStudy}` : ''}</Text>
      {gpa && <Text style={styles.gpa}>GPA: {gpa}</Text>}
    </View>
    {description && <Text style={styles.description}>{description}</Text>}
  </View>
);
