import { BuilderResume } from '@/store/builderStore';

export default function ExecutiveTemplate({ resume }: { resume: BuilderResume }) {
  const primaryColor = resume.themeColor === 'emerald' ? '#065f46' : '#1e3a8a';

  return (
    <div className="resume-page font-serif max-w-4xl mx-auto" style={{ backgroundColor: '#ffffff', color: '#111827' }}>
      
      {/* Header */}
      <div className="text-center mb-6 pb-6 border-b-2" style={{ borderColor: primaryColor }}>
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-3">{resume.fullName || 'YOUR NAME'}</h1>
        {resume.title && <div className="text-xl font-semibold mb-3 tracking-wide" style={{ color: primaryColor }}>{resume.title}</div>}
        <div className="flex flex-wrap justify-center gap-x-4 text-sm font-sans">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.linkedin && <span>{resume.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="resume-section mb-6">
          <p className="text-sm leading-relaxed text-justify">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b mb-4 pb-1" style={{ color: primaryColor, borderColor: '#d1d5db' }}>Professional Experience</h2>
          <div className="space-y-6">
            {resume.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg uppercase tracking-wide">{exp.company}</h3>
                  <span className="text-sm font-sans font-semibold">{exp.location}</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <div className="italic text-base">{exp.position}</div>
                  <div className="text-sm font-sans">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</div>
                </div>
                {exp.description && (
                  <div className="text-sm font-sans whitespace-pre-wrap pl-6 leading-relaxed" style={{ listStyleType: 'disc', display: 'list-item' }}>
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
          <h2 className="text-lg font-bold uppercase tracking-widest border-b mb-4 pb-1" style={{ color: primaryColor, borderColor: '#d1d5db' }}>Education</h2>
          <div className="space-y-4">
            {resume.education.map((edu: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{edu.institution}</h3>
                  <span className="text-sm font-sans">{edu.location}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div className="italic text-sm">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</div>
                  <div className="text-sm font-sans">{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b mb-3 pb-1" style={{ color: primaryColor, borderColor: '#d1d5db' }}>Core Competencies</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-sans">
            {resume.skills.map((skill: any, i: number) => (
              <div key={i} className="flex items-center">
                <span className="font-semibold">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
