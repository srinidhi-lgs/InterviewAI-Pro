import React from 'react';
import { useChatStore } from '@/store/chatStore';
import { Lightbulb, BookOpen, Briefcase, Code, GraduationCap } from 'lucide-react';

export default function ChatContextPanel() {
  const { selectedMode } = useChatStore();

  const getTips = () => {
    switch (selectedMode) {
      case 'Resume Expert':
        return {
          icon: <BookOpen className="w-5 h-5 text-blue-500" />,
          title: 'Resume Tips',
          tips: [
            'Quantify your achievements (e.g., "Increased sales by 20%").',
            'Tailor your resume to the specific job description.',
            'Use strong action verbs like "Developed", "Led", "Optimized".',
            'Keep it to one page if you have less than 10 years of experience.'
          ]
        };
      case 'Interview Coach':
        return {
          icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
          title: 'Interview Tips',
          tips: [
            'Use the STAR method (Situation, Task, Action, Result) for behavioral questions.',
            'Research the company culture and recent news.',
            'Prepare 3-5 thoughtful questions to ask the interviewer.',
            'Practice your "Tell me about yourself" pitch.'
          ]
        };
      case 'Coding Assistant':
        return {
          icon: <Code className="w-5 h-5 text-orange-500" />,
          title: 'Coding Tips',
          tips: [
            'Always consider edge cases before writing code.',
            'Explain your thought process out loud.',
            'Analyze time and space complexity of your solution.',
            'Write clean, modular, and self-documenting code.'
          ]
        };
      case 'Placement Guide':
        return {
          icon: <GraduationCap className="w-5 h-5 text-purple-500" />,
          title: 'Placement Tips',
          tips: [
            'Focus on core subjects: OS, DBMS, Computer Networks.',
            'Build at least two strong, unique projects.',
            'Consistently practice DSA on platforms like LeetCode.',
            'Leverage campus placements and off-campus referrals.'
          ]
        };
      default: // Career Mentor
        return {
          icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
          title: 'Career Tips',
          tips: [
            'Set clear short-term and long-term career goals.',
            'Network actively on LinkedIn with industry professionals.',
            'Continuously upskill and learn new technologies.',
            'Seek mentorship from seniors in your field.'
          ]
        };
    }
  };

  const currentTips = getTips();

  return (
    <div className="w-64 bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 hidden lg:flex flex-col h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
            {currentTips.icon}
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {currentTips.title}
          </h2>
        </div>

        <div className="space-y-4">
          {currentTips.tips.map((tip, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
          <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium text-center">
            Mode: {selectedMode}
          </p>
          <p className="text-xs text-indigo-600/70 dark:text-indigo-500/70 text-center mt-1">
            Responses are tailored to this mode.
          </p>
        </div>
      </div>
    </div>
  );
}
