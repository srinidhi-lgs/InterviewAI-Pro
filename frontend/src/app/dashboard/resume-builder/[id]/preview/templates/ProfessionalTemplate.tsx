import { BuilderResume } from '@/store/builderStore';

export default function ProfessionalTemplate({ resume }: { resume: BuilderResume }) {
  const primaryColor = resume.themeColor === 'emerald' ? '#059669' : '#000';

  return (
    <div className="resume-page font-sans text-gray-800 bg-white max-w-4xl mx-auto p-10 h-full min-h-[1100px]">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{resume.fullName || 'YOUR NAME'}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 text-sm">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.linkedin && <span>{resume.linkedin}</span>}
          {resume.github && <span>{resume.github}</span>}
          {resume.website && <span>{resume.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 mb-3 pb-1" style={{ borderColor: primaryColor, color: primaryColor }}>Professional Summary</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 mb-3 pb-1" style={{ borderColor: primaryColor, color: primaryColor }}>Experience</h2>
          <div className="space-y-4">
            {resume.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{exp.position}</span>
                  <span>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div className="flex justify-between text-sm italic mb-1">
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                {exp.description && (
                  <div className="text-sm whitespace-pre-wrap pl-4 leading-relaxed" style={{ listStyleType: 'disc', display: 'list-item' }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 mb-3 pb-1" style={{ borderColor: primaryColor, color: primaryColor }}>Education</h2>
          <div className="space-y-3">
            {resume.education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{edu.institution}</span>
                  <span>{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
                {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 mb-3 pb-1" style={{ borderColor: primaryColor, color: primaryColor }}>Projects</h2>
          <div className="space-y-4">
            {resume.projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-sm mb-1">
                  <span>{proj.name} {proj.technologies && `| ${proj.technologies}`}</span>
                  <span>{proj.url}</span>
                </div>
                {proj.description && (
                   <div className="text-sm whitespace-pre-wrap pl-4 leading-relaxed" style={{ listStyleType: 'disc', display: 'list-item' }}>
                     {proj.description}
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 mb-3 pb-1" style={{ borderColor: primaryColor, color: primaryColor }}>Skills</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {resume.skills.map((skill: any, i: number) => (
              <div key={i} className="flex gap-1">
                <span className="font-bold">{skill.name}</span>
                {skill.proficiency && <span className="italic" style={{ color: '#4b5563' }}>({skill.proficiency})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 mb-3 pb-1" style={{ borderColor: primaryColor, color: primaryColor }}>Certifications</h2>
          <div className="space-y-2">
            {resume.certifications.map((cert: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{cert.name}</span>
                  {cert.issueDate && <span>{cert.issueDate}</span>}
                </div>
                <div className="flex justify-between text-sm italic mb-1">
                  {cert.issuer && <span>{cert.issuer}</span>}
                  {cert.url && <span>{cert.url}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
