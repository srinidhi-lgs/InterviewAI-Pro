'use client';

import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useBuilderStore } from '@/store/builderStore';
import { Button } from '@/components/ui/Button';
import { Loader2, Save, Download, ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { downloadResumePdf } from '@/pdf/pdfDownloader';
// Will be implemented next
import PersonalInfoStep from './steps/PersonalInfoStep';
import SummaryStep from './steps/SummaryStep';
import EducationStep from './steps/EducationStep';
import ExperienceStep from './steps/ExperienceStep';
import ProjectsStep from './steps/ProjectsStep';
import SkillsStep from './steps/SkillsStep';
import CertificationsStep from './steps/CertificationsStep';

import LivePreview from './preview/LivePreview';

const STEPS = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'summary', title: 'Professional Summary' },
  { id: 'experience', title: 'Experience' },
  { id: 'education', title: 'Education' },
  { id: 'projects', title: 'Projects' },
  { id: 'skills', title: 'Skills' },
  { id: 'certifications', title: 'Certifications' }
];

export default function ResumeBuilderWizard({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const resumeId = unwrappedParams.id;
  
  const { accessToken } = useAuthStore();
  const { currentResume, setCurrentResume, isSaving, setSaving, setLastSaved, lastSaved, reset } = useBuilderStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(0.75); // Default 75% zoom
  
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/builder/resumes/${resumeId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setCurrentResume(res.data);
      } catch (err: any) {
        console.error('Failed to fetch resume', err);
        setError('Resume not found or access denied.');
      } finally {
        setIsLoading(false);
      }
    };
    if (accessToken && resumeId) {
      fetchResume();
    }
    
    return () => reset(); // Reset store on unmount
  }, [resumeId, accessToken, setCurrentResume, reset]);

  // Auto-save debounced effect
  useEffect(() => {
    if (isLoading || error) return;
    
    const saveTimer = setTimeout(async () => {
      try {
        setSaving(true);
        await axios.put(`${API_URL}/builder/resumes/${resumeId}`, currentResume, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setLastSaved(new Date());
      } catch (err) {
        console.error('Auto-save failed', err);
      } finally {
        setSaving(false);
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(saveTimer);
  }, [currentResume, resumeId, accessToken, isLoading, error, setSaving, setLastSaved]);

  const handleManualSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${API_URL}/builder/resumes/${resumeId}`, currentResume, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setLastSaved(new Date());
    } catch (err) {
      console.error('Manual save failed', err);
    } finally {
      setSaving(false);
    }
  };


  const renderCurrentStep = () => {
    switch (STEPS[currentStepIndex].id) {
      case 'personal': return <PersonalInfoStep />;
      case 'summary': return <SummaryStep />;
      case 'experience': return <ExperienceStep />;
      case 'education': return <EducationStep />;
      case 'projects': return <ProjectsStep />;
      case 'skills': return <SkillsStep />;
      case 'certifications': return <CertificationsStep />;
      default: return <PersonalInfoStep />;
    }
  };

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push('/dashboard/resume-builder')}>Back to Resumes</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] -mt-4 -mb-8 -mx-4 sm:-mx-8 flex flex-col md:flex-row overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      
      {/* Left Pane - Wizard Controls */}
      <div className="w-full md:w-1/2 lg:w-[45%] xl:w-[40%] flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <button 
            onClick={() => router.push('/dashboard/resume-builder')}
            className="flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 flex items-center">
              {isSaving ? (
                <><Loader2 className="h-3 w-3 animate-spin mr-1"/> Saving...</>
              ) : lastSaved ? (
                <><CheckCircle2 className="h-3 w-3 text-emerald-500 mr-1"/> Saved {lastSaved.toLocaleTimeString()}</>
              ) : null}
            </span>
            <Button variant="outline" size="sm" onClick={handleManualSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-zinc-200 dark:border-zinc-800 shrink-0 p-2">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStepIndex(index)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors ${
                index === currentStepIndex
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              {index + 1}. {step.title}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {renderCurrentStep()}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <Button 
            variant="outline"
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          
          {currentStepIndex === STEPS.length - 1 ? (
            <Button 
              onClick={async () => {
                await handleManualSave();
                router.push(`/dashboard/resume-builder/${resumeId}/templates`);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Finish <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
            >
              Next Step <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Right Pane - Live Preview */}
      <div className="w-full md:w-1/2 lg:w-[55%] xl:w-[60%] bg-zinc-100 dark:bg-zinc-950 flex flex-col relative overflow-hidden">
        
        {/* Preview Actions & Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <div className="flex bg-white dark:bg-zinc-800 shadow-md rounded-md overflow-hidden mr-4">
            <button 
              onClick={() => setZoom(0.5)}
              className={`px-3 py-1.5 text-xs font-medium border-r border-zinc-200 dark:border-zinc-700 ${zoom === 0.5 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
            >
              50%
            </button>
            <button 
              onClick={() => setZoom(0.75)}
              className={`px-3 py-1.5 text-xs font-medium border-r border-zinc-200 dark:border-zinc-700 ${zoom === 0.75 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
            >
              75%
            </button>
            <button 
              onClick={() => setZoom(1.0)}
              className={`px-3 py-1.5 text-xs font-medium ${zoom === 1.0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-zinc-50 dark:hover:bg-zinc-700'}`}
            >
              100%
            </button>
          </div>
          <Button size="sm" onClick={() => downloadResumePdf(currentResume)} className="shadow-lg">
            <Download className="h-4 w-4 mr-2" /> Generate PDF
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
          {/* Zoom Wrapper */}
          <div className="shadow-2xl rounded-sm shrink-0 origin-top flex justify-center" style={{ backgroundColor: '#ffffff', width: `${850 * zoom}px`, height: `${1100 * zoom}px` }}>
            <div ref={previewRef} className="w-full h-full p-0" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
              <LivePreview resume={currentResume} zoom={zoom} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
