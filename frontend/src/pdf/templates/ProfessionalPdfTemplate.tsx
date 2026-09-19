import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { BuilderResume } from '@/store/builderStore';
import { PDFTheme, globalStyles } from '../PDFTheme';
import { PdfSectionTitle } from '../components/PdfSectionTitle';
import { PdfExperienceCard } from '../components/PdfExperienceCard';
import { PdfEducationCard } from '../components/PdfEducationCard';
import { PdfBulletList } from '../components/PdfBulletList';
import { PdfSkillChip } from '../components/PdfSkillChip';

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginBottom: PDFTheme.spacing[6],
  },
  name: {
    fontSize: PDFTheme.fontSize['3xl'],
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: PDFTheme.spacing[2],
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: PDFTheme.spacing[4],
  },
  contactItem: {
    fontSize: PDFTheme.fontSize.sm,
    color: PDFTheme.colors.gray800,
  },
  summaryText: {
    fontSize: PDFTheme.fontSize.sm,
    lineHeight: 1.5,
    color: PDFTheme.colors.gray700,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  projectTech: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray600,
  },
  projectUrl: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray600,
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: PDFTheme.spacing[1],
  },
  certName: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica-Bold',
  },
  certIssuer: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica-Oblique',
    color: PDFTheme.colors.gray700,
  },
  certDate: {
    fontSize: PDFTheme.fontSize.sm,
    color: PDFTheme.colors.gray600,
  },
  certUrl: {
    fontSize: PDFTheme.fontSize.sm,
    fontFamily: 'Helvetica',
    color: PDFTheme.colors.gray600,
  },
  certItem: {
    marginBottom: PDFTheme.spacing[2],
  }
});

interface Props {
  resume: BuilderResume;
}

export const ProfessionalPdfTemplate = ({ resume }: Props) => {
  const primaryColor = resume.themeColor === 'emerald' ? PDFTheme.colors.emerald : PDFTheme.colors.black;

  return (
    <View style={globalStyles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.name, { color: primaryColor }]}>{resume.fullName || 'YOUR NAME'}</Text>
        <View style={styles.contactRow}>
          {resume.email && <Text style={styles.contactItem}>{resume.email}</Text>}
          {resume.phone && <Text style={styles.contactItem}>{resume.phone}</Text>}
          {resume.location && <Text style={styles.contactItem}>{resume.location}</Text>}
          {resume.linkedin && <Text style={styles.contactItem}>{resume.linkedin}</Text>}
          {resume.website && <Text style={styles.contactItem}>{resume.website}</Text>}
        </View>
      </View>

      {/* Summary */}
      {resume.summary && (
        <View style={globalStyles.section} wrap={false}>
          <PdfSectionTitle title="Professional Summary" color={primaryColor} borderColor={primaryColor} />
          <Text style={styles.summaryText}>{resume.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <View style={globalStyles.section}>
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
            />
          ))}
        </View>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <View style={globalStyles.section}>
          <PdfSectionTitle title="Education" color={primaryColor} borderColor={primaryColor} />
          {resume.education.map((edu: any, i: number) => (
            <PdfEducationCard
              key={i}
              institution={edu.institution}
              degree={edu.degree}
              fieldOfStudy={edu.fieldOfStudy}
              startDate={edu.startDate}
              endDate={edu.endDate}
              isCurrent={edu.isCurrent}
              gpa={edu.gpa}
              description={edu.description}
            />
          ))}
        </View>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <View style={globalStyles.section}>
          <PdfSectionTitle title="Projects" color={primaryColor} borderColor={primaryColor} />
          {resume.projects.map((proj: any, i: number) => (
            <View key={i} style={{ marginBottom: PDFTheme.spacing[3] }} wrap={false}>
              <View style={styles.projectRow}>
                <Text style={styles.projectName}>
                  {proj.name} {proj.technologies ? <Text style={styles.projectTech}> | {proj.technologies}</Text> : null}
                </Text>
                {proj.url && <Text style={styles.projectUrl}>{proj.url}</Text>}
              </View>
              {proj.description && <PdfBulletList text={proj.description} />}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <View style={globalStyles.section} wrap={false}>
          <PdfSectionTitle title="Skills" color={primaryColor} borderColor={primaryColor} />
          <View style={styles.skillsContainer}>
            {resume.skills.map((skill: any, i: number) => (
              <PdfSkillChip key={i} name={skill.name} proficiency={skill.proficiency} />
            ))}
          </View>
        </View>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <View style={globalStyles.section} wrap={false}>
          <PdfSectionTitle title="Certifications" color={primaryColor} borderColor={primaryColor} />
          {resume.certifications.map((cert: any, i: number) => (
            <View key={i} style={styles.certItem}>
              <View style={styles.certRow}>
                <Text style={styles.certName}>{cert.name}</Text>
                {cert.issueDate && <Text style={styles.certDate}>{cert.issueDate}</Text>}
              </View>
              <View style={styles.certRow}>
                {cert.issuer && <Text style={styles.certIssuer}>{cert.issuer}</Text>}
                {cert.url && <Text style={styles.certUrl}>{cert.url}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}

    </View>
  );
};
