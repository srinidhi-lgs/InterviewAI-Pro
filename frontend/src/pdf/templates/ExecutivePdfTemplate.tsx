import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { BuilderResume } from '@/store/builderStore';
import { PDFTheme, globalStyles } from '../PDFTheme';
import { PdfSectionTitle } from '../components/PdfSectionTitle';
import { PdfExperienceCard } from '../components/PdfExperienceCard';
import { PdfEducationCard } from '../components/PdfEducationCard';
import { PdfBulletList } from '../components/PdfBulletList';

const styles = StyleSheet.create({
  page: {
    padding: PDFTheme.spacing[10],
    backgroundColor: PDFTheme.colors.white,
    fontFamily: 'Times-Roman', // Using Times-Roman as the closest to serif without custom fonts
    color: PDFTheme.colors.gray900,
  },
  header: {
    textAlign: 'center',
    marginBottom: PDFTheme.spacing[6],
    paddingBottom: PDFTheme.spacing[4],
    borderBottomWidth: 2,
  },
  name: {
    fontSize: PDFTheme.fontSize['3xl'],
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: PDFTheme.spacing[2],
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: PDFTheme.spacing[3],
  },
  contactItem: {
    fontSize: PDFTheme.fontSize.base,
    color: PDFTheme.colors.gray800,
  },
  section: {
    marginBottom: PDFTheme.spacing[6],
  },
  sectionTitle: {
    fontSize: PDFTheme.fontSize.lg,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: PDFTheme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: PDFTheme.colors.gray300,
    paddingBottom: PDFTheme.spacing[1],
  },
  summaryText: {
    fontSize: PDFTheme.fontSize.sm,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PDFTheme.spacing[4],
  },
  skillItem: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica', // Keeps sans-serif for skills just like html template
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PDFTheme.spacing[1],
  },
  projectName: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Times-Bold',
  },
  projectTech: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Times-Italic',
    color: PDFTheme.colors.gray700,
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PDFTheme.spacing[1],
  },
  certName: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Times-Bold',
  },
  certIssuer: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Times-Italic',
  }
});

interface Props {
  resume: BuilderResume;
}

export const ExecutivePdfTemplate = ({ resume }: Props) => {
  const primaryColor = resume.themeColor === 'emerald' ? PDFTheme.colors.emeraldDark : PDFTheme.colors.blueDark;

  return (
    <View style={styles.page}>
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: primaryColor }]}>
        <Text style={[styles.name, { color: primaryColor }]}>{resume.fullName || 'YOUR NAME'}</Text>
        <View style={styles.contactRow}>
          {resume.location && <Text style={styles.contactItem}>{resume.location}</Text>}
          {resume.phone && <Text style={styles.contactItem}>{resume.phone}</Text>}
          {resume.email && <Text style={styles.contactItem}>{resume.email}</Text>}
          {resume.linkedin && <Text style={styles.contactItem}>{resume.linkedin}</Text>}
        </View>
      </View>

      {/* Summary */}
      {resume.summary && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.summaryText}>{resume.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>Professional Experience</Text>
          {resume.experience.map((exp: any, i: number) => (
            <View key={i} style={{ marginBottom: PDFTheme.spacing[6] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ fontSize: PDFTheme.fontSize.base, fontFamily: 'Times-Bold' }}>{exp.position}</Text>
                <Text style={{ fontSize: PDFTheme.fontSize.sm, fontFamily: 'Times-Roman', color: PDFTheme.colors.gray700 }}>
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: PDFTheme.spacing[2] }}>
                <Text style={{ fontSize: PDFTheme.fontSize.sm, fontFamily: 'Times-Italic' }}>{exp.company}</Text>
                {exp.location && <Text style={{ fontSize: PDFTheme.fontSize.sm, fontFamily: 'Times-Roman', color: PDFTheme.colors.gray700 }}>{exp.location}</Text>}
              </View>
              {exp.description && <PdfBulletList text={exp.description} />}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>Education</Text>
          {resume.education.map((edu: any, i: number) => (
            <View key={i} style={{ marginBottom: PDFTheme.spacing[4] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ fontSize: PDFTheme.fontSize.base, fontFamily: 'Times-Bold' }}>{edu.institution}</Text>
                <Text style={{ fontSize: PDFTheme.fontSize.sm, fontFamily: 'Times-Roman', color: PDFTheme.colors.gray700 }}>
                  {edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: PDFTheme.spacing[1] }}>
                <Text style={{ fontSize: PDFTheme.fontSize.sm, fontFamily: 'Times-Roman' }}>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </Text>
                {edu.gpa && <Text style={{ fontSize: PDFTheme.fontSize.sm, color: PDFTheme.colors.gray700 }}>GPA: {edu.gpa}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>Core Competencies</Text>
          <View style={styles.skillsContainer}>
            {resume.skills.map((skill: any, i: number) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={[styles.skillItem, { fontFamily: 'Helvetica-Bold' }]}>{skill.name}</Text>
                {skill.proficiency && <Text style={[styles.skillItem, { color: PDFTheme.colors.gray600, marginLeft: 4 }]}>({skill.proficiency})</Text>}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={[styles.sectionTitle, { color: primaryColor }]}>Certifications</Text>
          {resume.certifications.map((cert: any, i: number) => (
            <View key={i} style={{ marginBottom: PDFTheme.spacing[2] }}>
              <View style={styles.certRow}>
                <Text style={styles.certName}>{cert.name}</Text>
                {cert.issueDate && <Text style={{ fontSize: PDFTheme.fontSize.sm, color: PDFTheme.colors.gray700 }}>{cert.issueDate}</Text>}
              </View>
              <View style={styles.certRow}>
                <Text style={styles.certIssuer}>{cert.issuer}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

    </View>
  );
};
