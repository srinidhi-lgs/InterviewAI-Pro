'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useBuilderStore } from '@/store/builderStore';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import LivePreview from '../preview/LivePreview';

const TEMPLATES = [
  { id: 'professional', name: 'Professional', description: 'Classic and ATS-friendly.' },
  { id: 'modern', name: 'Modern', description: 'Sleek two-column design.' },
  { id: 'minimal', name: 'Minimal', description: 'Clean and highly readable.' },
  { id: 'executive', name: 'Executive', description: 'Traditional and structured.' }
];

export default function TemplateGallery({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const resumeId = unwrappedParams.id;
  
  const { accessToken } = useAuthStore();
  const { currentResume, setCurrentResume, reset } = useBuilderStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSelectTemplate = async (templateId: string) => {
    try {
      setIsSaving(true);
      const updatedResume = { ...currentResume, templateName: templateId };
      await axios.put(`${API_URL}/builder/resumes/${resumeId}`, updatedResume, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setCurrentResume(updatedResume);
      router.push(`/dashboard/resume-builder/${resumeId}/preview`);
    } catch (err) {
      console.error('Failed to save template', err);
      alert('Failed to update template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      <div className="flex items-center justify-between mb-10">
        <div>
          <button 
            onClick={() => router.push(`/dashboard/resume-builder/${resumeId}`)}
            className="flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Editor
          </button>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Template Gallery</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Choose a design that perfectly matches your professional brand.</p>
        </div>
        
        {/* Future AI Recommended Box */}
        <div className="hidden lg:flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 max-w-sm">
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">AI Recommendation (Coming Soon)</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">Our AI will automatically suggest the best template based on your industry.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {TEMPLATES.map((tmpl) => {
          const isActive = currentResume.templateName === tmpl.id;
          // Create a mock resume specifically for this template preview
          const mockResume = { ...currentResume, templateName: tmpl.id };

          return (
            <div 
              key={tmpl.id} 
              className={`flex flex-col bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border-2 transition-all hover:shadow-lg ${isActive ? 'border-blue-500' : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700'}`}
            >
              {/* Template Preview (Miniature) */}
              <div className="relative bg-zinc-100 dark:bg-zinc-950 h-[350px] w-full overflow-hidden flex items-start justify-center pt-6 group">
                <div 
                  className="bg-white shadow-xl origin-top transition-transform group-hover:scale-[0.32]" 
                  style={{ width: '850px', height: '1100px', transform: 'scale(0.3)' }}
                >
                  <LivePreview resume={mockResume} zoom={1.0} />
                </div>
                {isActive && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white p-1 rounded-full shadow-md z-10">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </div>

              {/* Template Info & Actions */}
              <div className="p-5 flex flex-col flex-1 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">{tmpl.name}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-1">{tmpl.description}</p>
                <Button 
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  variant={isActive ? 'primary' : 'outline'}
                  disabled={isSaving}
                  className={isActive ? 'bg-blue-600 hover:bg-blue-700 w-full' : 'w-full'}
                >
                  {isSaving && isActive ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</>
                  ) : isActive ? (
                    'Current Template'
                  ) : (
                    'Use Template'
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
