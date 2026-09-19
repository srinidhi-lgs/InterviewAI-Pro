import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import { BuilderResume } from '@/store/builderStore';
import { ProfessionalPdfTemplate } from './templates/ProfessionalPdfTemplate';
import { ModernPdfTemplate } from './templates/ModernPdfTemplate';
import { MinimalPdfTemplate } from './templates/MinimalPdfTemplate';
import { ExecutivePdfTemplate } from './templates/ExecutivePdfTemplate';

// Global document styling if needed
const styles = StyleSheet.create({
  page: {
    // The individual templates handle padding and layout, but we ensure A4 size here
  }
});

interface Props {
  resume: BuilderResume;
}

export const ResumeDocument = ({ resume }: Props) => {
  const templateName = resume.templateName?.toLowerCase() || 'professional';

  // Determine which template to render
  const renderTemplate = () => {
    switch (templateName) {
      case 'modern':
        return <ModernPdfTemplate resume={resume} />;
      case 'minimal':
        return <MinimalPdfTemplate resume={resume} />;
      case 'executive':
        return <ExecutivePdfTemplate resume={resume} />;
      case 'professional':
      default:
        return <ProfessionalPdfTemplate resume={resume} />;
    }
  };

  return (
    <Document 
      title={`${resume.fullName || 'Resume'}`}
      author={resume.fullName || ''}
      subject="Resume"
    >
      <Page size="A4" style={styles.page}>
        {renderTemplate()}
      </Page>
    </Document>
  );
};
