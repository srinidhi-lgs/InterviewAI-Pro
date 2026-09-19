'use client';

import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useBuilderStore } from '@/store/builderStore';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowLeft, Download, LayoutTemplate } from 'lucide-react';
import { downloadResumePdf } from '@/pdf/pdfDownloader';
import LivePreview from './LivePreview';

const TEMPLATES: Record<string, { name: string; description: string }> = {
  professional: { name: 'Professional', description: 'Classic and ATS-friendly.' },
  modern: { name: 'Modern', description: 'Sleek two-column design.' },
  minimal: { name: 'Minimal', description: 'Clean and highly readable.' },
  executive: { name: 'Executive', description: 'Traditional and structured.' }
};

export default function ResumePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const resumeId = unwrappedParams.id;
  
  const { accessToken } = useAuthStore();
  const { currentResume, setCurrentResume } = useBuilderStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  }, [resumeId, accessToken, setCurrentResume]);



  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push('/dashboard/resume-builder')}>Back to Resumes</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const templateInfo = TEMPLATES[currentResume.templateName] || TEMPLATES.professional;

  return (
    <div className="h-[calc(100vh-8rem)] -mt-4 -mb-8 -mx-4 sm:-mx-8 flex flex-col md:flex-row overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      
      {/* Left Pane - Actions */}
      <div className="w-full md:w-1/3 lg:w-[35%] xl:w-[30%] flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10 p-6 md:p-8 overflow-y-auto">
        
        <button 
          onClick={() => router.push(`/dashboard/resume-builder/${resumeId}/templates`)}
          className="flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Templates
        </button>

        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">Final Preview</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10">Review your final resume. Ensure all details are correct before downloading.</p>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <LayoutTemplate className="h-5 w-5 text-blue-500" />
            <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Active Template: {templateInfo.name}</h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 pl-8">{templateInfo.description}</p>
          
          <Button 
            variant="outline" 
            className="w-full mt-6 bg-white dark:bg-zinc-900"
            onClick={() => router.push(`/dashboard/resume-builder/${resumeId}/templates`)}
          >
            Change Template
          </Button>
          <Button 
            variant="outline" 
            className="w-full mt-3 bg-white dark:bg-zinc-900"
            onClick={() => router.push(`/dashboard/resume-builder/${resumeId}`)}
          >
            Edit Content
          </Button>
        </div>

        <div className="space-y-4 mt-auto pt-8">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base shadow-md"
            onClick={() => downloadResumePdf(currentResume)}
          >
            <Download className="h-5 w-5 mr-2" /> Generate PDF
          </Button>
        </div>
      </div>

      {/* Right Pane - Full Resume Preview */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 flex justify-center items-start">
        <div className="shadow-2xl rounded-sm shrink-0 origin-top flex justify-center" style={{ backgroundColor: '#ffffff', width: '850px', height: '1100px' }}>
          <div ref={previewRef} className="w-full h-full p-0" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
            <LivePreview resume={currentResume} zoom={1.0} />
          </div>
        </div>
      </div>

    </div>
  );
}
