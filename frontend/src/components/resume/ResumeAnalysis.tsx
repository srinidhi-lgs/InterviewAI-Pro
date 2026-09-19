'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  FileText, 
  Download, 
  ExternalLink,
  Target,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  User,
  Mail,
  Phone,
  Calendar,
  HardDrive,
  Award,
  Layers,
  Search,
  Code,
  Database,
  Cloud,
  Terminal,
  MessageSquare
} from 'lucide-react';
import { ResumeAnalysis } from '@/store/resumeStore';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface ResumeAnalysisProps {
  analysis: ResumeAnalysis;
  onDelete: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-500 bg-emerald-500/10';
  if (score >= 60) return 'text-amber-500 bg-amber-500/10';
  return 'text-red-500 bg-red-500/10';
};

const CircularScore = ({ title, score, icon: Icon }: { title: string, score: number, icon: any }) => (
  <Card className="flex flex-col items-center justify-center p-6 gap-3">
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="100, 100"
          className="text-zinc-100 dark:text-zinc-800"
        />
        <motion.path
          initial={{ strokeDasharray: "0, 100" }}
          animate={{ strokeDasharray: `${score}, 100` }}
          transition={{ duration: 1, ease: "easeOut" }}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={`${getScoreColor(score).split(' ')[0]} drop-shadow-sm`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-zinc-950 dark:text-white">{score}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${getScoreColor(score).split(' ')[0]}`} />
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{title}</span>
    </div>
  </Card>
);

const StatCard = ({ label, value, icon: Icon }: { label: string, value: string | number, icon: any }) => (
  <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-zinc-950 dark:text-white">{value}</p>
    </div>
  </div>
);

const SkillBadgeList = ({ items, emptyMsg, colorClass }: { items: string[], emptyMsg: string, colorClass: string }) => {
  if (!items || items.length === 0) return <p className="text-sm text-zinc-500">{emptyMsg}</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span key={idx} className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
};

export default function ResumeAnalysisView({ analysis, onDelete }: ResumeAnalysisProps) {
  const { accessToken } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await api.delete(`/resume/${analysis.resumeId}`);
      onDelete();
    } catch (err: any) {
      console.error('Failed to delete resume', err);
      setError('Failed to delete resume. Please try again.');
      setIsDeleting(false);
    }
  };

  const handlePreview = async () => {
    try {
      setError(null);
      const res = await api.get('/resume/preview', { responseType: 'blob' });
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (err: any) {
      setError(err.response?.status === 404 ? 'Resume file not found.' : 'Failed to load preview.');
    }
  };

  const handleDownload = async () => {
    try {
      setError(null);
      const res = await api.get('/resume/download', { responseType: 'blob' });
      
      const contentDisposition = res.headers['content-disposition'];
      let filename = analysis.fileName || 'resume.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }

      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    } catch (err: any) {
      setError(err.response?.status === 404 ? 'Resume file not found.' : 'Failed to download resume.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">Analysis Report</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Detailed breakdown of your resume</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <ExternalLink className="h-4 w-4 mr-2" /> Preview
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Candidate Profile Card */}
      <Card className="p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
              {analysis.candidateName ? analysis.candidateName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2">
                {analysis.candidateName || 'Unknown Candidate'}
              </h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {analysis.email || 'No email found'}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {analysis.phone || 'No phone found'}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 md:border-l border-zinc-200 dark:border-zinc-800 md:pl-6">
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Calendar className="h-3 w-3"/> Analyzed On</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : 'Just now'}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><HardDrive className="h-3 w-3"/> File Size</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {analysis.fileSize ? (analysis.fileSize / (1024 * 1024)).toFixed(2) : '0.00'} MB
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quality Meters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <CircularScore title="Overall ATS" score={analysis.atsScore} icon={Target} />
        <CircularScore title="Completeness" score={analysis.completenessScore} icon={Layers} />
        <CircularScore title="Formatting" score={analysis.formattingScore} icon={FileText} />
        <CircularScore title="Grammar" score={analysis.grammarScore} icon={CheckCircle2} />
        <CircularScore title="Keyword Match" score={analysis.keywordMatchScore} icon={Search} />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Skills" value={(analysis.technicalSkills?.length || 0) + (analysis.softSkills?.length || 0) + (analysis.tools?.length || 0) + (analysis.frameworks?.length || 0) + (analysis.databases?.length || 0) + (analysis.cloud?.length || 0)} icon={Award} />
        <StatCard label="Experience Yrs" value={`${analysis.experienceYears || 0}+`} icon={Briefcase} />
        <StatCard label="Projects" value={analysis.projectsCount || 0} icon={Code} />
        <StatCard label="Certifications" value={analysis.certificatesCount || 0} icon={Target} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Categorized Skills */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg text-zinc-950 dark:text-white mb-6 flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" /> Skill Taxonomy
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">Technical Languages</h4>
                <SkillBadgeList items={analysis.technicalSkills} emptyMsg="No technical languages found." colorClass="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" />
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">Frameworks & Libraries</h4>
                <SkillBadgeList items={analysis.frameworks} emptyMsg="No frameworks found." colorClass="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">Databases</h4>
                <SkillBadgeList items={analysis.databases} emptyMsg="No databases found." colorClass="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">Cloud & DevOps</h4>
                <SkillBadgeList items={analysis.cloud} emptyMsg="No cloud skills found." colorClass="bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">Tools</h4>
                <SkillBadgeList items={analysis.tools} emptyMsg="No tools found." colorClass="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" />
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">Soft Skills</h4>
                <SkillBadgeList items={analysis.softSkills} emptyMsg="No soft skills found." colorClass="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" />
              </div>
            </div>
          </Card>

          {/* Keyword Match Analysis */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-zinc-950 dark:text-white flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-500" /> Keyword Analysis
              </h3>
              {analysis.jobMatchPercentage > 0 && (
                <div className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-sm font-bold">
                  {analysis.jobMatchPercentage}% Job Match
                </div>
              )}
            </div>
            
            {(!analysis.matchedKeywords || analysis.matchedKeywords.length === 0) && (!analysis.missingKeywords || analysis.missingKeywords.length === 0) ? (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No target keywords available. Upload a job description or select a target role.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Matched Keywords
                  </h4>
                  <SkillBadgeList items={analysis.matchedKeywords} emptyMsg="No exact keywords matched." colorClass="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" /> Missing Keywords
                  </h4>
                  <SkillBadgeList items={analysis.missingKeywords} emptyMsg="No missing keywords! Great job." colorClass="bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Missing Sections & Suggestions */}
        <div className="space-y-6">
          <Card className="p-6 border-amber-200 dark:border-amber-900/50">
            <h3 className="font-bold text-lg text-zinc-950 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Missing Sections
            </h3>
            {analysis.missingSections && analysis.missingSections.length > 0 ? (
              <div className="space-y-2">
                {analysis.missingSections.map((section, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 bg-amber-50 dark:bg-amber-500/5 p-2 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    {section}
                  </div>
                ))}
                <p className="text-xs text-zinc-500 mt-4">
                  Adding these sections will significantly improve your completeness score.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">All standard sections found!</p>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900/30">
            <h3 className="font-bold text-lg text-zinc-950 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" /> AI Suggestions
            </h3>
            <div className="space-y-3">
              {analysis.suggestions && analysis.suggestions.length > 0 ? (
                analysis.suggestions.map((suggestion, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3 items-start p-3 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-lg border border-white/20 dark:border-white/5"
                  >
                    <div className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed font-medium">
                      {suggestion}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">Your resume looks perfect. No suggestions right now.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
