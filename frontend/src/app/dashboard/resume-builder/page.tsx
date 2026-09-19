'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, FileText, Edit2, Trash2, Clock, Loader2, Download, Eye } from 'lucide-react';
import { BuilderResume } from '@/store/builderStore';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ResumeBuilderDashboard() {
  const [resumes, setResumes] = useState<BuilderResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await axios.get(`${API_URL}/builder/resumes`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setResumes(res.data);
      } catch (err) {
        console.error('Failed to fetch builder resumes', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (accessToken) fetchResumes();
  }, [accessToken]);

  const handleCreateNew = async () => {
    try {
      const res = await axios.post(`${API_URL}/builder/resumes`, {
        title: 'Untitled Resume',
        themeColor: 'emerald',
        templateName: 'modern'
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      router.push(`/dashboard/resume-builder/${res.data.id}`);
    } catch (err) {
      console.error('Failed to create resume', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await axios.delete(`${API_URL}/builder/resumes/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete resume', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Resume Builder
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Create and manage your AI-optimized professional resumes.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <motion.div
            key={resume.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="flex flex-col h-full hover:border-blue-500/50 transition-colors group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-500">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {resume.templateName}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-950 dark:text-white mb-2">
                  {resume.title || 'Untitled Resume'}
                </h3>
                <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                  {resume.summary || 'No summary added yet.'}
                </p>
                <div className="flex items-center text-xs text-zinc-400 mt-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  Updated {new Date(resume.updatedAt!).toLocaleDateString()}
                </div>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-4 flex gap-2">
                <Link href={`/dashboard/resume-builder/${resume.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full gap-2 text-xs">
                    <Edit2 className="h-3 w-3" /> Edit
                  </Button>
                </Link>
                <Link href={`/dashboard/resume-builder/${resume.id}/preview`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20">
                    <Eye className="h-3 w-3" /> Preview
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-3"
                  onClick={() => handleDelete(resume.id!)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}

        {resumes.length === 0 && (
          <Card className="col-span-full p-12 flex flex-col items-center justify-center text-center border-dashed">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-950 dark:text-white">No resumes yet</h3>
            <p className="mt-1 text-sm text-zinc-500 mb-6">
              Get started by creating your first AI-powered resume.
            </p>
            <Button onClick={handleCreateNew}>Create New Resume</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
