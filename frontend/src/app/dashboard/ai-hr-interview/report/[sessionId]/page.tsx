'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  ThumbsUp,
  AlertTriangle,
  Award
} from 'lucide-react';
import { api } from '@/lib/api';
import { downloadInterviewReportPdf } from '@/pdf/pdfDownloader';

export default function InterviewReportPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/ai-interview/session/${sessionId}/report`);
      setReport(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.status === 404 ? 'Report not found' : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchReport();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">
          {error === 'Report not found' ? 'Session Not Found' : 'Oops, something went wrong'}
        </h2>
        <p className="text-zinc-500 mb-6 text-center max-w-md">
          {error === 'Report not found' 
            ? 'We could not find a report for this interview session. It may have expired or does not exist.'
            : 'We encountered an error while trying to load your interview report.'}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg transition"
          >
            Go to Dashboard
          </button>
          {error !== 'Report not found' && (
            <button 
              onClick={fetchReport}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreBgLight = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 dark:bg-emerald-500/20';
    if (score >= 75) return 'bg-blue-100 dark:bg-blue-500/20';
    if (score >= 60) return 'bg-amber-100 dark:bg-amber-500/20';
    return 'bg-red-100 dark:bg-red-500/20';
  };

  const ScoreBar = ({ label, score }: { label: string, score: number }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}/100</span>
      </div>
      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5 overflow-hidden">
        <motion.div 
          className={`h-2.5 rounded-full ${getScoreBg(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-sm text-zinc-500 hover:text-indigo-600 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold dark:text-white">Interview Report</h1>
          <p className="text-zinc-500">
            {report.jobRole} • {report.interviewType} • {new Date(report.completedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => downloadInterviewReportPdf(report)}
            className="flex items-center px-4 py-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button 
            onClick={() => router.push('/dashboard/ai-hr-interview/setup')}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Interview
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
          <p className="text-sm text-zinc-500 mb-1 font-medium uppercase tracking-wider">Overall Score</p>
          <div className="flex items-end gap-2">
            <span className={`text-5xl font-black ${getScoreColor(report.overallScore)}`}>
              {report.overallScore}
            </span>
            <span className="text-xl text-zinc-400 mb-1">/100</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
          <p className="text-sm text-zinc-500 mb-2 font-medium uppercase tracking-wider">Recommendation</p>
          <div className="flex items-center gap-2">
            {report.hiringRecommendation === 'Highly Recommended' && <Award className="w-6 h-6 text-emerald-500" />}
            {report.hiringRecommendation === 'Recommended' && <ThumbsUp className="w-6 h-6 text-blue-500" />}
            {report.hiringRecommendation === 'Needs Improvement' && <AlertTriangle className="w-6 h-6 text-amber-500" />}
            <span className={`text-lg font-bold ${
              report.hiringRecommendation === 'Highly Recommended' ? 'text-emerald-500' :
              report.hiringRecommendation === 'Recommended' ? 'text-blue-500' : 'text-amber-500'
            }`}>
              {report.hiringRecommendation}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
          <p className="text-sm text-zinc-500 mb-1 font-medium uppercase tracking-wider">Duration</p>
          <span className="text-2xl font-bold dark:text-white">
            {Math.floor(report.interviewDurationSeconds / 60)}m {report.interviewDurationSeconds % 60}s
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
          <p className="text-sm text-zinc-500 mb-1 font-medium uppercase tracking-wider">Questions</p>
          <span className="text-2xl font-bold dark:text-white">
            {report.questionsAnswered} / {report.totalQuestions}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metrics & Strengths */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Performance Metrics</h3>
            <ScoreBar label="Technical Knowledge" score={report.technicalScore} />
            <ScoreBar label="Communication" score={report.communicationScore} />
            <ScoreBar label="Confidence" score={report.confidenceScore} />
            <ScoreBar label="Fluency" score={report.fluencyScore} />
            <ScoreBar label="Grammar" score={report.grammarScore} />
            <ScoreBar label="Response Quality" score={report.responseQualityScore} />
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <h3 className="text-lg font-bold mb-3 flex items-center text-emerald-800 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5 mr-2" /> Strengths
            </h3>
            <ul className="space-y-2">
              {report.strengths?.map((str: string, i: number) => (
                <li key={i} className="text-emerald-700 dark:text-emerald-500 flex items-start">
                  <span className="mr-2">•</span> {str}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30">
            <h3 className="text-lg font-bold mb-3 flex items-center text-amber-800 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5 mr-2" /> Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {report.areasForImprovement?.map((area: string, i: number) => (
                <li key={i} className="text-amber-700 dark:text-amber-500 flex items-start">
                  <span className="mr-2">•</span> {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Q&A Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold dark:text-white">Question Analysis</h2>
          
          {report.questions?.map((q: any, i: number) => (
            <div key={q.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  Question {i + 1}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreBgLight(q.score)} ${getScoreColor(q.score)}`}>
                  Score: {q.score}/100
                </span>
              </div>
              
              <h4 className="text-lg font-semibold mb-4 dark:text-white">{q.question}</h4>
              
              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Your Answer</p>
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">{q.candidateAnswer}</p>
                </div>
                
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-2">AI Feedback</p>
                  <p className="text-emerald-800 dark:text-emerald-400 text-sm leading-relaxed">{q.aiFeedback}</p>
                </div>
                
                {q.suggestedBetterAnswer && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-wider mb-2">Suggested Better Answer</p>
                    <p className="text-blue-800 dark:text-blue-400 text-sm leading-relaxed">{q.suggestedBetterAnswer}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
