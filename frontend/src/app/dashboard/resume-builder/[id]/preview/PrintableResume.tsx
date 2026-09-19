import { BuilderResume } from '@/store/builderStore';

export default function PrintableResume({ resume }: { resume: BuilderResume }) {
  
  const getPrimaryColor = () => resume.themeColor === 'emerald' ? '#059669' : '#2563eb';

  // Helper for layout switching
  const renderTemplate = () => {
    switch (resume.templateName) {
      case 'modern':
        return renderModern();
      case 'minimal':
        return renderMinimal();
      case 'executive':
        return renderExecutive();
      case 'professional':
      default:
        return renderProfessional();
    }
  };

  const renderProfessional = () => (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#000000', fontSize: '14px', lineHeight: '1.5' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', color: getPrimaryColor(), margin: '0 0 8px 0' }}>
          {resume.fullName || 'YOUR NAME'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '14px' }}>
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.linkedin && <span>{resume.linkedin}</span>}
        </div>
      </div>

      {resume.summary && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #000000', marginBottom: '8px', textTransform: 'uppercase', margin: '0 0 8px 0', paddingBottom: '4px' }}>Professional Summary</h2>
          <p style={{ margin: 0, fontSize: '14px' }}>{resume.summary}</p>
        </div>
      )}

      {resume.experience && resume.experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #000000', marginBottom: '8px', textTransform: 'uppercase', margin: '0 0 8px 0', paddingBottom: '4px' }}>Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {resume.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                  <span>{exp.position}</span>
                  <span>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontStyle: 'italic', marginBottom: '4px' }}>
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                {exp.description && (
                  <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', paddingLeft: '16px', display: 'list-item', listStyleType: 'disc', margin: 0 }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.education && resume.education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #000000', marginBottom: '8px', textTransform: 'uppercase', margin: '0 0 8px 0', paddingBottom: '4px' }}>Education</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {resume.education.map((edu: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                  <span>{edu.institution}</span>
                  <span>{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #000000', marginBottom: '8px', textTransform: 'uppercase', margin: '0 0 8px 0', paddingBottom: '4px' }}>Projects</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {resume.projects.map((proj: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                  <span>{proj.name} {proj.technologies && `| ${proj.technologies}`}</span>
                  <span>{proj.url}</span>
                </div>
                {proj.description && (
                   <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', paddingLeft: '16px', display: 'list-item', listStyleType: 'disc', margin: 0 }}>
                     {proj.description}
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #000000', marginBottom: '8px', textTransform: 'uppercase', margin: '0 0 8px 0', paddingBottom: '4px' }}>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
            {resume.skills.map((skill: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>{skill.name}</span>
                {skill.proficiency && <span style={{ fontStyle: 'italic', color: '#4b5563' }}>({skill.proficiency})</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderModern = () => (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333333', display: 'flex', minHeight: '100%', height: '100%' }}>
      <div style={{ width: '33.333%', backgroundColor: getPrimaryColor(), color: '#ffffff', padding: '32px', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 8px 0', lineHeight: '1.2' }}>
          {resume.fullName || 'YOUR NAME'}
        </h1>
        {resume.title && <div style={{ fontSize: '18px', fontWeight: '500', opacity: 0.9, marginBottom: '32px' }}>{resume.title}</div>}

        <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px', margin: '0 0 12px 0' }}>Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.9 }}>
              {resume.email && <div>{resume.email}</div>}
              {resume.phone && <div>{resume.phone}</div>}
              {resume.location && <div>{resume.location}</div>}
              {resume.linkedin && <div>{resume.linkedin}</div>}
            </div>
          </div>
          {resume.skills && resume.skills.length > 0 && (
            <div>
              <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px', margin: '0 0 12px 0' }}>Skills</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.9 }}>
                {resume.skills.map((skill: any, i: number) => (
                  <div key={i}>{skill.name}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ width: '66.666%', backgroundColor: '#ffffff', padding: '32px', boxSizing: 'border-box' }}>
        {resume.summary && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: getPrimaryColor(), margin: '0 0 12px 0' }}>Profile</h2>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>{resume.summary}</p>
          </div>
        )}
        {resume.experience && resume.experience.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: getPrimaryColor(), margin: '0 0 16px 0' }}>Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {resume.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{exp.position}</h3>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: getPrimaryColor(), marginBottom: '8px' }}>{exp.company} | {exp.location}</div>
                  {exp.description && (
                    <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', paddingLeft: '16px', display: 'list-item', listStyleType: 'disc', color: '#374151', margin: 0 }}>
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#2d3748', backgroundColor: '#ffffff', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '300', margin: '0 0 16px 0', color: '#111827', letterSpacing: '1px' }}>{resume.fullName || 'YOUR NAME'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '14px', fontWeight: '300', color: '#6b7280' }}>
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.linkedin && <span>{resume.linkedin}</span>}
        </div>
      </div>
      {resume.summary && (
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '14px', lineHeight: '2', color: '#4b5563', fontWeight: '300', margin: 0 }}>{resume.summary}</p>
        </div>
      )}
      {resume.experience && resume.experience.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#9ca3af', margin: '0 0 24px 0' }}>Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {resume.experience.map((exp: any, i: number) => (
              <div key={i} style={{ display: 'flex' }}>
                <div style={{ width: '25%', fontSize: '12px', color: '#6b7280', paddingTop: '4px' }}>
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </div>
                <div style={{ width: '75%' }}>
                  <h3 style={{ fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0', fontSize: '16px' }}>{exp.position}</h3>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{exp.company}</div>
                  {exp.description && <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', whiteSpace: 'pre-wrap', margin: 0 }}>{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderExecutive = () => (
    <div style={{ fontFamily: 'Georgia, serif', color: '#111827', backgroundColor: '#ffffff' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: `2px solid ${getPrimaryColor()}` }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', margin: '0 0 12px 0' }}>{resume.fullName || 'YOUR NAME'}</h1>
        {resume.title && <div style={{ fontSize: '20px', fontWeight: 'bold', color: getPrimaryColor(), marginBottom: '12px', letterSpacing: '1px' }}>{resume.title}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
        </div>
      </div>
      {resume.summary && (
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.6', textAlign: 'justify', margin: 0 }}>{resume.summary}</p>
        </div>
      )}
      {resume.experience && resume.experience.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #d1d5db', margin: '0 0 16px 0', paddingBottom: '4px', color: getPrimaryColor() }}>Professional Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {resume.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>{exp.company}</h3>
                  <span style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>{exp.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <div style={{ fontStyle: 'italic', fontSize: '16px' }}>{exp.position}</div>
                  <div style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</div>
                </div>
                {exp.description && (
                  <div style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif', whiteSpace: 'pre-wrap', paddingLeft: '24px', display: 'list-item', listStyleType: 'disc', lineHeight: '1.6', margin: 0 }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div 
      style={{ 
        background: '#ffffff',
        backgroundColor: '#ffffff',
        color: '#000000',
        width: '816px',
        minHeight: '1056px',
        padding: '48px',
        boxSizing: 'border-box',
        margin: 0
      }}
    >
      {renderTemplate()}
    </div>
  );
}
