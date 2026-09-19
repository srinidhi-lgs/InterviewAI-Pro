import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { BuilderResume } from '@/store/builderStore';
import { PDFTheme, globalStyles } from '../PDFTheme';
import { PdfExperienceCard } from '../components/PdfExperienceCard';
import { PdfEducationCard } from '../components/PdfEducationCard';
import { PdfBulletList } from '../components/PdfBulletList';

const styles = StyleSheet.create({
  header: {
    marginBottom: PDFTheme.spacing[10],
  },
  name: {
    fontSize: PDFTheme.fontSize['3xl'],
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    color: PDFTheme.colors.gray900,
    marginBottom: PDFTheme.spacing[2],
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PDFTheme.spacing[4],
  },
  contactItem: {
    fontSize: PDFTheme.fontSize.sm,
    color: PDFTheme.colors.gray600,
  },
  section: {
    marginBottom: PDFTheme.spacing[10],
  },
  sectionTitle: {
    fontSize: PDFTheme.fontSize.xs,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: PDFTheme.colors.gray400,
    marginBottom: PDFTheme.spacing[6],
  },
  summaryText: {
    fontSize: PDFTheme.fontSize.sm,
    lineHeight: 1.6,
    color: PDFTheme.colors.gray600,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: PDFTheme.spacing[10],
  },
  gridLeft: {
    width: '25%',
  },
  gridRight: {
    width: '75%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PDFTheme.spacing[2],
  },
  skillItem: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica-Bold',
    color: PDFTheme.colors.gray800,
    width: '48%',
    marginBottom: PDFTheme.spacing[1],
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PDFTheme.spacing[1],
  },
  projectName: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica-Bold',
    color: PDFTheme.colors.gray800,
  },
  certItem: {
    width: '48%',
    marginBottom: PDFTheme.spacing[2],
  },
  certName: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica-Bold',
    color: PDFTheme.colors.gray800,
  },
  certDetail: {
    fontSize: PDFTheme.fontSize.xs,
    color: PDFTheme.colors.gray500,
    marginTop: 2,
  }
});

interface Props {
  resume: BuilderResume;
}

export const MinimalPdfTemplate = ({ resume }: Props) => {
  return (
    <View style={[globalStyles.page, { color: PDFTheme.colors.gray800 }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{resume.fullName || 'YOUR NAME'}</Text>
        <View style={styles.contactRow}>
          {resume.email && <Text style={styles.contactItem}>{resume.email}</Text>}
          {resume.phone && <Text style={styles.contactItem}>{resume.phone}</Text>}
          {resume.location && <Text style={styles.contactItem}>{resume.location}</Text>}
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
          <Text style={styles.sectionTitle}>Experience</Text>
          {resume.experience.map((exp: any, i: number) => (
            <View key={i} style={{ marginBottom: PDFTheme.spacing[8] }}>
              <PdfExperienceCard
                position={exp.position}
                company={exp.company}
                location={exp.location}
                startDate={exp.startDate}
                endDate={exp.endDate}
                isCurrent={exp.isCurrent}
                description={exp.description}
              />
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {resume.education.map((edu: any, i: number) => (
            <View key={i} style={{ marginBottom: PDFTheme.spacing[6] }}>
              <PdfEducationCard
                institution={edu.institution}
                degree={edu.degree}
                fieldOfStudy={edu.fieldOfStudy}
                startDate={edu.startDate}
                endDate={edu.endDate}
                isCurrent={edu.isCurrent}
                gpa={edu.gpa}
                description={edu.description}
              />
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {resume.projects.map((proj: any, i: number) => (
            <View key={i} style={{ marginBottom: PDFTheme.spacing[6] }} wrap={false}>
              <View style={styles.projectRow}>
                <Text style={styles.projectName}>{proj.name}</Text>
              </View>
              {proj.description && <PdfBulletList text={proj.description} />}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <View style={styles.gridRow} wrap={false}>
          <View style={styles.gridLeft}>
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>
          <View style={styles.gridRight}>
            {resume.skills.map((skill: any, i: number) => (
              <Text key={i} style={styles.skillItem}>{skill.name}</Text>
            ))}
          </View>
        </View>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <View style={styles.gridRow} wrap={false}>
          <View style={styles.gridLeft}>
            <Text style={styles.sectionTitle}>Certifications</Text>
          </View>
          <View style={styles.gridRight}>
            {resume.certifications.map((cert: any, i: number) => (
              <View key={i} style={styles.certItem}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certDetail}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

    </View>
  );
};
