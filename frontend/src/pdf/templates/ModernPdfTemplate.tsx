import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { BuilderResume } from '@/store/builderStore';
import { PDFTheme } from '../PDFTheme';
import { PdfSectionTitle } from '../components/PdfSectionTitle';
import { PdfExperienceCard } from '../components/PdfExperienceCard';
import { PdfEducationCard } from '../components/PdfEducationCard';
import { PdfBulletList } from '../components/PdfBulletList';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: PDFTheme.colors.white,
    fontFamily: 'Helvetica',
    minHeight: '100%',
  },
  leftColumn: {
    width: '35%',
    padding: PDFTheme.spacing[6],
    color: PDFTheme.colors.white,
  },
  rightColumn: {
    width: '65%',
    padding: PDFTheme.spacing[6],
    backgroundColor: PDFTheme.colors.white,
  },
  name: {
    fontSize: PDFTheme.fontSize['3xl'],
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: PDFTheme.spacing[6],
    color: PDFTheme.colors.white,
  },
  sidebarSection: {
    marginBottom: PDFTheme.spacing[6],
  },
  sidebarTitle: {
    fontSize: PDFTheme.fontSize.lg,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: PDFTheme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingBottom: PDFTheme.spacing[1],
  },
  contactItem: {
    fontSize: PDFTheme.fontSize.sm,
    marginBottom: PDFTheme.spacing[2],
    color: 'rgba(255,255,255,0.9)',
  },
  skillItem: {
    fontSize: PDFTheme.fontSize.sm,
    marginBottom: PDFTheme.spacing[2],
    color: 'rgba(255,255,255,0.9)',
  },
  summaryText: {
    fontSize: PDFTheme.fontSize.sm,
    lineHeight: 1.5,
    color: PDFTheme.colors.gray700,
  },
  section: {
    marginBottom: PDFTheme.spacing[6],
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PDFTheme.spacing[1],
  },
  projectName: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica-Bold',
    color: PDFTheme.colors.black,
  },
  projectUrl: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray600,
  },
});

interface Props {
  resume: BuilderResume;
}

export const ModernPdfTemplate = ({ resume }: Props) => {
  const primaryColor = resume.themeColor === 'emerald' ? PDFTheme.colors.emerald : PDFTheme.colors.blue;

  return (
    <View style={styles.page}>
      
      {/* Left Sidebar */}
      <View style={[styles.leftColumn, { backgroundColor: primaryColor }]}>
        <Text style={styles.name}>{resume.fullName || 'YOUR NAME'}</Text>
        
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Contact</Text>
          {resume.email && <Text style={styles.contactItem}>{resume.email}</Text>}
          {resume.phone && <Text style={styles.contactItem}>{resume.phone}</Text>}
          {resume.location && <Text style={styles.contactItem}>{resume.location}</Text>}
          {resume.linkedin && <Text style={styles.contactItem}>{resume.linkedin}</Text>}
          {resume.website && <Text style={styles.contactItem}>{resume.website}</Text>}
        </View>

        {resume.skills && resume.skills.length > 0 && (
          <View style={styles.sidebarSection} wrap={false}>
            <Text style={styles.sidebarTitle}>Skills</Text>
            {resume.skills.map((skill: any, i: number) => (
              <Text key={i} style={styles.skillItem}>
                {skill.name} {skill.proficiency ? `(${skill.proficiency})` : ''}
              </Text>
            ))}
          </View>
        )}

        {resume.education && resume.education.length > 0 && (
          <View style={styles.sidebarSection} wrap={false}>
            <Text style={styles.sidebarTitle}>Education</Text>
            {resume.education.map((edu: any, i: number) => (
              <View key={i} style={{ marginBottom: PDFTheme.spacing[3] }}>
                <Text style={[styles.contactItem, { fontFamily: 'Helvetica-Bold' }]}>{edu.institution}</Text>
                <Text style={styles.contactItem}>{edu.degree}</Text>
                <Text style={styles.contactItem}>{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Right Column */}
      <View style={styles.rightColumn}>
        {resume.summary && (
          <View style={styles.section} wrap={false}>
            <PdfSectionTitle title="Profile" color={primaryColor} borderColor={primaryColor} />
            <Text style={styles.summaryText}>{resume.summary}</Text>
          </View>
        )}

        {resume.experience && resume.experience.length > 0 && (
          <View style={styles.section}>
            <PdfSectionTitle title="Experience" color={primaryColor} borderColor={primaryColor} />
            {resume.experience.map((exp: any, i: number) => (
              <PdfExperienceCard
                key={i}
                position={exp.position}
                company={exp.company}
                location={exp.location}
                startDate={exp.startDate}
                endDate={exp.endDate}
                isCurrent={exp.isCurrent}
                description={exp.description}
                primaryColor={primaryColor}
              />
            ))}
          </View>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <View style={styles.section}>
            <PdfSectionTitle title="Projects" color={primaryColor} borderColor={primaryColor} />
            {resume.projects.map((proj: any, i: number) => (
              <View key={i} style={{ marginBottom: PDFTheme.spacing[3] }} wrap={false}>
                <View style={styles.projectRow}>
                  <Text style={styles.projectName}>{proj.name}</Text>
                  {proj.url && <Text style={styles.projectUrl}>{proj.url}</Text>}
                </View>
                {proj.description && <PdfBulletList text={proj.description} />}
              </View>
            ))}
          </View>
        )}

        {resume.certifications && resume.certifications.length > 0 && (
          <View style={styles.section} wrap={false}>
            <PdfSectionTitle title="Certifications" color={primaryColor} borderColor={primaryColor} />
            {resume.certifications.map((cert: any, i: number) => (
              <View key={i} style={{ marginBottom: PDFTheme.spacing[2] }}>
                <Text style={{ fontSize: PDFTheme.fontSize.base, fontFamily: 'Helvetica-Bold' }}>{cert.name}</Text>
                <Text style={{ fontSize: PDFTheme.fontSize.sm, color: PDFTheme.colors.gray600, marginTop: 2 }}>
                  {cert.issuer} {cert.issueDate && `| ${cert.issueDate}`}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

    </View>
  );
};
