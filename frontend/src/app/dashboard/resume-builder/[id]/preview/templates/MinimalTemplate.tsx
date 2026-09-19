import { BuilderResume } from '@/store/builderStore';

export default function MinimalTemplate({ resume }: { resume: BuilderResume }) {
  return (
    <div className="resume-page font-sans max-w-4xl mx-auto" style={{ backgroundColor: '#ffffff', color: '#2d3748' }}>
      
      {/* Header */}
      <div className="mb-10 text-left">
        <h1 className="text-4xl font-light mb-4 tracking-wide" style={{ color: '#111827' }}>{resume.fullName || 'YOUR NAME'}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light" style={{ color: '#6b7280' }}>
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.linkedin && <span>{resume.linkedin}</span>}
          {resume.website && <span>{resume.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="resume-section mb-10">
          <p className="text-sm leading-loose font-light" style={{ color: '#4b5563' }}>{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="resume-section mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: '#9ca3af' }}>Experience</h2>
          <div className="space-y-8">
            {resume.experience.map((exp: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-4">
                <div className="col-span-3 text-xs mt-1" style={{ color: '#6b7280' }}>
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </div>
                <div className="col-span-9">
                  <h3 className="font-semibold" style={{ color: '#111827' }}>{exp.position}</h3>
                  <div className="text-sm mb-2" style={{ color: '#6b7280' }}>{exp.company}</div>
                  {exp.description && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#4b5563' }}>{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="resume-section mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: '#9ca3af' }}>Education</h2>
          <div className="space-y-6">
            {resume.education.map((edu: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-4">
                <div className="col-span-3 text-xs mt-1" style={{ color: '#6b7280' }}>
                  {edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}
                </div>
                <div className="col-span-9">
                  <h3 className="font-semibold" style={{ color: '#111827' }}>{edu.degree}</h3>
                  <div className="text-sm" style={{ color: '#6b7280' }}>{edu.institution} {edu.fieldOfStudy && `| ${edu.fieldOfStudy}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="resume-section mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: '#9ca3af' }}>Projects</h2>
          <div className="space-y-6">
            {resume.projects.map((proj: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-4">
                <div className="col-span-3 text-xs mt-1" style={{ color: '#6b7280' }}>
                  {proj.url || 'Project'}
                </div>
                <div className="col-span-9">
                  <h3 className="font-semibold" style={{ color: '#111827' }}>{proj.name}</h3>
                  {proj.technologies && <div className="text-xs mb-2" style={{ color: '#9ca3af' }}>{proj.technologies}</div>}
                  {proj.description && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#4b5563' }}>{proj.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="resume-section mb-10 grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Skills</h2>
          </div>
          <div className="col-span-9 text-sm leading-relaxed" style={{ color: '#4b5563' }}>
            {resume.skills.map((skill: any) => skill.name).join(', ')}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="resume-section mb-10 grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Certifications</h2>
          </div>
          <div className="col-span-9 space-y-2">
            {resume.certifications.map((cert: any, i: number) => (
              <div key={i} className="text-sm" style={{ color: '#1f2937' }}>
                <span className="font-semibold">{cert.name}</span> — <span style={{ color: '#6b7280' }}>{cert.issuer}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
