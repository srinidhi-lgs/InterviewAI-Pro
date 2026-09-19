'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileType, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { API_URL } from '@/lib/api';
import axios from 'axios';
import { ResumeAnalysis } from '@/store/resumeStore';

interface ResumeUploadProps {
  onUploadComplete: (analysis: ResumeAnalysis) => void;
}

export default function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const { accessToken } = useAuthStore();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are supported.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !accessToken) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription.trim()) {
      formData.append('jobDescription', jobDescription.trim());
    }

    try {
      // 1. Upload the file
      const uploadRes = await axios.post(`${API_URL}/resume/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}` 
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      // 2. Fetch latest analysis
      if (uploadRes.data.success) {
        // Wait a small delay to simulate processing
        setTimeout(async () => {
          try {
            const analysisRes = await axios.get(`${API_URL}/resume/latest`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (analysisRes.data.data) {
              onUploadComplete(analysisRes.data.data);
            }
          } catch (err) {
            setError('Failed to fetch analysis results.');
          } finally {
            setIsUploading(false);
          }
        }, 1000);
      }
    } catch (err: any) {
      setIsUploading(false);
      setError(err.response?.data?.message || 'Failed to upload resume. Please try again.');
    }
  };

  return (
    <Card className="p-8">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' 
            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <UploadCloud className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-950 dark:text-white mb-2">
                Upload your resume
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
                Drag and drop your PDF file here, or click to browse. Maximum file size is 5MB.
              </p>
              <p className="text-zinc-500 text-sm mt-1 mb-6">Don&apos;t have a resume ready? Build one from scratch.</p>
              <Button onClick={() => inputRef.current?.click()} type="button">
                Select File
              </Button>
              <Button 
                id="load-sample-resume-btn"
                variant="outline" 
                className="ml-2"
                onClick={async () => {
                  try {
                    const res = await fetch('/sample_resume.pdf');
                    const blob = await res.blob();
                    const testFile = new File([blob], 'sample_resume.pdf', { type: 'application/pdf' });
                    validateAndSetFile(testFile);
                  } catch (e) {
                    console.error('Failed to load sample resume', e);
                  }
                }} 
                type="button"
              >
                Load Sample Resume
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="file-selected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <div className="flex items-center p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                <FileType className="h-8 w-8 text-blue-500 shrink-0 mr-4" />
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium text-zinc-950 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {!isUploading && (
                  <button 
                    onClick={() => setFile(null)}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className="mt-4">
                <label htmlFor="jd" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Job Description (Optional)
                </label>
                <textarea
                  id="jd"
                  rows={4}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Paste the job description here to see how well your resume matches..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={isUploading}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  We&apos;ll compare your resume against this job description to provide targeted suggestions.
                </p>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {isUploading && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {uploadProgress < 100 ? 'Uploading...' : 'Analyzing...'}
                    </span>
                    <span className="font-medium text-zinc-950 dark:text-white">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setFile(null)} disabled={isUploading}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    'Analyze Resume'
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
