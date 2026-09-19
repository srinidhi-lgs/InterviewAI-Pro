import { BuilderResume } from '@/store/builderStore';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';

interface LivePreviewProps {
  resume: BuilderResume;
  zoom?: number;
}

export default function LivePreview({ resume, zoom = 1 }: LivePreviewProps) {
  
  // Choose template
  const renderTemplate = () => {
    switch (resume.templateName) {
      case 'modern':
        return <ModernTemplate resume={resume} />;
      case 'minimal':
        return <MinimalTemplate resume={resume} />;
      case 'executive':
        return <ExecutiveTemplate resume={resume} />;
      case 'professional':
      default:
        return <ProfessionalTemplate resume={resume} />;
    }
  };

  return (
    <div 
      className="origin-top overflow-hidden" 
      style={{ 
        backgroundColor: '#ffffff',
        transform: `scale(${zoom})`,
        width: '850px',
        minHeight: '1100px'
      }}
    >
      {renderTemplate()}
    </div>
  );
}
