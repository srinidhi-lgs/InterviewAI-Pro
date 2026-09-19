import { BuilderResume } from '@/store/builderStore';

export default function ModernTemplate({ resume }: { resume: BuilderResume }) {
  const primaryColor = resume.themeColor === 'emerald' ? '#059669' : '#2563eb';

  return (
    <div className="resume-page font-sans flex h-full min-h-[1100px]" style={{ color: '#333' }}>
      
      {/* Left Sidebar */}
      <div className="w-1/3 p-8" style={{ backgroundColor: primaryColor, color: '#ffffff' }}>
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 leading-tight">
          {resume.fullName || 'YOUR NAME'}
        </h1>
        {resume.title && <div className="text-lg font-medium opacity-90 mb-8">{resume.title}</div>}

        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-3">Contact</h3>
            <div className="space-y-2 opacity-90">
              {resume.email && <div>{resume.email}</div>}
              {resume.phone && <div>{resume.phone}</div>}
              {resume.location && <div>{resume.location}</div>}
              {resume.linkedin && <div>{resume.linkedin}</div>}
              {resume.website && <div>{resume.website}</div>}
            </div>
          </div>

          {resume.skills && resume.skills.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-3">Skills</h3>
              <div className="space-y-1 opacity-90">
                {resume.skills.map((skill: any, i: number) => (
                  <div key={i}>{skill.name}</div>
                ))}
              </div>
            </div>
          )}

          {resume.education && resume.education.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-3">Education</h3>
              <div className="space-y-3 opacity-90">
                {resume.education.map((edu: any, i: number) => (
                  <div key={i}>
                    <div className="font-bold">{edu.degree}</div>
                    <div>{edu.institution}</div>
                    <div className="text-xs opacity-75">{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-8" style={{ backgroundColor: '#ffffff' }}>
        {resume.summary && (
          <div className="resume-section mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>Profile</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div className="resume-section mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4" style={{ color: primaryColor }}>Experience</h2>
            <div className="space-y-6">
              {resume.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <span className="text-sm font-medium" style={{ color: '#6b7280' }}>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-sm font-semibold mb-2" style={{ color: primaryColor }}>{exp.company} | {exp.location}</div>
                  {exp.description && (
                    <div className="text-sm whitespace-pre-wrap pl-4" style={{ listStyleType: 'disc', display: 'list-item', color: '#374151' }}>
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="resume-section mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4" style={{ color: primaryColor }}>Projects</h2>
            <div className="space-y-6">
              {resume.projects.map((proj: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base">{proj.name}</h3>
                  </div>
                  {proj.technologies && <div className="text-xs font-semibold mb-1" style={{ color: '#6b7280' }}>{proj.technologies}</div>}
                  {proj.description && (
                     <div className="text-sm whitespace-pre-wrap pl-4" style={{ listStyleType: 'disc', display: 'list-item', color: '#374151' }}>
                       {proj.description}
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div className="resume-section mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4" style={{ color: primaryColor }}>Certifications</h2>
            <div className="space-y-4">
              {resume.certifications.map((cert: any, i: number) => (
                <div key={i}>
                  <div className="font-bold text-base">{cert.name}</div>
                  <div className="text-sm" style={{ color: '#4b5563' }}>{cert.issuer} {cert.issueDate && `| ${cert.issueDate}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
