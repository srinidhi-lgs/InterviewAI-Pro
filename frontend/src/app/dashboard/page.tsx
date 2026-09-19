'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { API_URL } from '@/lib/api';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Video, 
  Clock, 
  FileText, 
  PenTool, 
  MessageSquare, 
  Play,
  CheckCircle2,
  AlertCircle,
  Inbox
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { email, accessToken } = useAuthStore();
  const name = email?.split('@')[0] || 'User';
  
  const { latestAnalysis, setLatestAnalysis, isLoading, setIsLoading } = useResumeStore();

  const [recentInterviews, setRecentInterviews] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<{ totalInterviews: number, completedInterviews: number, averageScore: number } | null>(null);
  
  useEffect(() => {
    const fetchLatestResume = async () => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/resume/latest`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.data.data) {
          setLatestAnalysis(res.data.data);
        } else {
          setLatestAnalysis(null);
        }
      } catch (error) {
        console.error('Failed to fetch latest resume:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchInterviewHistory = async () => {
      if (!accessToken) return;
      try {
        const res = await axios.get(`${API_URL}/interviews/history?size=5`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setRecentInterviews(res.data.content || res.data || []);
      } catch (error) {
        console.error('Failed to fetch interview history:', error);
      }
    };
    
    const fetchDashboardStats = async () => {
      if (!accessToken) return;
      try {
        const res = await axios.get(`${API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setDashboardStats(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };
    
    fetchLatestResume();
    fetchInterviewHistory();
    fetchDashboardStats();
  }, [accessToken, setLatestAnalysis, setIsLoading]);

  const hasResume = !!latestAnalysis;
  const hasInterviews = recentInterviews.length > 0;
  
  const completedInterviews = recentInterviews.filter(i => i.status === 'COMPLETED');
  const recentActivity = completedInterviews.map(interview => ({
    title: `Mock Interview: ${interview.jobRole}`,
    date: new Date(interview.createdAt).toLocaleDateString(),
    type: 'success',
    score: 'Ready' // Need result API call to get actual score here, but for now we'll just say Ready or navigate to report.
  }));

  const quickActions = [
    { title: 'Start Mock Interview', desc: 'Practice with AI interviewer', icon: Play, href: '/dashboard/interview/setup', color: 'bg-zinc-950 dark:bg-white text-white dark:text-black' },
    { title: 'Analyze Resume', desc: 'Get ATS compatibility score', icon: TrendingUp, href: '/dashboard/analyzer', color: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800' },
    { title: 'Build Resume', desc: 'Create a new AI-optimized resume', icon: PenTool, href: '/dashboard/resume-builder', color: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800' },
    { title: 'AI Career Assistant', desc: 'Ask career-related questions', icon: MessageSquare, href: '/chat', color: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800' },
  ];

  const progressBars = [
    { label: 'Technical Questions', progress: hasInterviews ? 75 : 0, color: 'bg-blue-500' },
    { label: 'System Design', progress: hasInterviews ? 45 : 0, color: 'bg-purple-500' },
    { label: 'Behavioral', progress: hasInterviews ? 90 : 0, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Welcome back, {name.charAt(0).toUpperCase() + name.slice(1)}! 👋
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            {hasInterviews ? "Here's what's happening with your interview preparation today." : "Start your first mock interview."}
          </p>
        </div>
        <Link href="/dashboard/interview/setup">
          <Button className="shrink-0 gap-2">
            <Play className="h-4 w-4" />
            Quick Start Interview
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Resume Score Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0 }}>
          <Card className={`flex flex-col justify-center h-full ${!hasResume ? 'items-center text-center p-4' : 'items-start'}`}>
            {hasResume ? (
              <div className="flex items-center gap-4 w-full">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Resume Score</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-zinc-950 dark:text-white">{latestAnalysis?.atsScore}/100</p>
                    {latestAnalysis?.jobMatchPercentage !== undefined && latestAnalysis.jobMatchPercentage > 0 && (
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full mb-1">
                        {latestAnalysis.jobMatchPercentage}% Match
                      </span>
                    )}
                  </div>
                  {latestAnalysis?.createdAt && (
                    <p className="text-xs text-zinc-400 mt-1">
                      Analyzed {new Date(latestAnalysis.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">No resume analyzed yet.</p>
                <Link href="/dashboard/analyzer">
                  <Button variant="secondary" size="sm" className="w-full">Upload Resume</Button>
                </Link>
              </>
            )}
          </Card>
        </motion.div>

        {/* AI Interview Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="flex items-center gap-4 h-full">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Target className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">AI Interview Score</p>
              <p className="text-2xl font-bold text-zinc-950 dark:text-white">
                {dashboardStats?.averageScore ? `${dashboardStats.averageScore}%` : '--'}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Mock Interviews Completed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="flex items-center gap-4 h-full">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Video className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Mock Interviews</p>
              <p className="text-2xl font-bold text-zinc-950 dark:text-white">{dashboardStats?.totalInterviews || '0'}</p>
            </div>
          </Card>
        </motion.div>

        {/* Practice Hours removed as duration data doesn't exist */}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action, i) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link href={action.href}>
                    <div className={`flex flex-col h-full rounded-2xl p-6 transition-transform hover:scale-[1.02] active:scale-95 ${action.color} ${action.color.includes('bg-zinc-100') ? 'border border-zinc-200 dark:border-zinc-800' : ''}`}>
                      <action.icon className="h-8 w-8 mb-4" />
                      <h3 className="font-bold text-lg">{action.title}</h3>
                      <p className="opacity-80 text-sm mt-1">{action.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white mb-4">Recent Activity</h2>
            <Card className="p-0 overflow-hidden">
              {recentActivity.length > 0 ? (
                <>
                  <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-4 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <div className="flex items-center gap-4">
                          {activity.type === 'success' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          )}
                          <div>
                            <h4 className="font-medium text-zinc-950 dark:text-white">{activity.title}</h4>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{activity.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                            Score: {activity.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 text-center">
                    <Link href="/dashboard/interviews" className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
                      View all activity &rarr;
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                    <Inbox className="h-8 w-8 text-zinc-400" />
                  </div>
                  <h3 className="font-medium text-zinc-950 dark:text-white">No activity yet</h3>
                  <p className="text-sm text-zinc-500 mt-1">Start practicing to see your progress here.</p>
                </div>
              )}
            </Card>
          </section>

        </div>

        {/* Right Sidebar (1/3 width) */}
        <div className="space-y-8">
          
          {/* Preparation Progress */}
          <section>
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white mb-4">Preparation Progress</h2>
            <Card className="space-y-6">
              {progressBars.map((item, i) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-zinc-950 dark:text-white">{item.label}</span>
                    <span className="text-zinc-500">{item.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <motion.div
                      className={`h-full rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Button variant="outline" className="w-full" disabled={!hasInterviews}>View Detailed Analytics</Button>
              </div>
            </Card>
          </section>

          {/* Upcomming Schedule (Placeholder for future) */}
          <section>
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white mb-4">Upcoming Schedule</h2>
            <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
              <Clock className="h-8 w-8 text-zinc-400 mb-3" />
              <h3 className="font-medium text-zinc-950 dark:text-white">No interviews scheduled</h3>
              <p className="text-sm text-zinc-500 mt-1 mb-4">Schedule a mock interview to start preparing.</p>
              <Link href="/dashboard/interview/setup">
                <Button variant="secondary" size="sm">Schedule Now</Button>
              </Link>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
