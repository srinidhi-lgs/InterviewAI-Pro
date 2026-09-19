import React, { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Send, Mic, Square, Paperclip, ChevronDown, Download, 
  FileText, User, StopCircle, RefreshCw, Copy, Check 
} from 'lucide-react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const AI_MODES = [
  'Career Mentor',
  'Resume Expert',
  'Interview Coach',
  'Coding Assistant',
  'Placement Guide'
];

const QUICK_PROMPTS = [
  'Improve Resume', 'Review ATS', 'Generate Projects', 'Top Companies',
  'Mock HR Question', 'Java Interview', 'React Interview', 'SQL Practice',
  'System Design', 'Behavioral Interview'
];

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#4f46e5' },
  messageBlock: { marginBottom: 15, padding: 10, borderRadius: 5 },
  userBlock: { backgroundColor: '#f3f4f6', alignSelf: 'flex-end', width: '80%' },
  aiBlock: { backgroundColor: '#eef2ff', alignSelf: 'flex-start', width: '90%' },
  sender: { fontSize: 10, fontWeight: 'bold', marginBottom: 5, color: '#6b7280' },
  text: { fontSize: 12, lineHeight: 1.5, color: '#1f2937' }
});

const PdfDocument = ({ messages, title }: { messages: any[], title: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      {messages.map((m, i) => (
        <View key={i} style={[styles.messageBlock, m.sender === 'USER' ? styles.userBlock : styles.aiBlock]}>
          <Text style={styles.sender}>{m.sender === 'USER' ? 'You' : 'AI Copilot'}</Text>
          <Text style={styles.text}>{m.message}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default function ChatWindow() {
  const { accessToken } = useAuthStore();
  const { 
    activeSessionId, 
    messages, 
    selectedMode, 
    setSelectedMode, 
    sendMessage,
    isSending,
    fetchMessages,
    sessions,
    createSession
  } = useChatStore();

  const [input, setInput] = useState('');
  const [useResume, setUseResume] = useState(false);
  const [useProfile, setUseProfile] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeSessionId && accessToken) {
      fetchMessages(accessToken, activeSessionId);
    }
  }, [activeSessionId, accessToken, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isRecordingRef = useRef(false);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;

      rec.onstart = () => {
        isRecordingRef.current = true;
        setIsRecording(true);
      };
      
      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (currentTranscript) {
          setInput(prev => prev + currentTranscript);
        }
      };

      rec.onerror = (event: any) => {
        isRecordingRef.current = false;
        setIsRecording(false);
        if (event.error !== 'aborted') {
          console.error('Speech recognition error', event.error);
        }
      };
      
      rec.onend = () => {
        isRecordingRef.current = false;
        setIsRecording(false);
      };

      setRecognition(rec);

      return () => {
        isRecordingRef.current = false;
        try {
          rec.abort();
        } catch (e) {}
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) return alert('Speech recognition not supported in this browser.');
    
    if (isRecordingRef.current || isRecording) {
      isRecordingRef.current = false;
      try {
        recognition.stop();
      } catch (e) {}
      setIsRecording(false);
    } else {
      if (isRecordingRef.current) return;
      isRecordingRef.current = true;
      try {
        recognition.start();
      } catch (e: any) {
        isRecordingRef.current = false;
        setIsRecording(false);
        if (e?.name !== 'InvalidStateError') {
          console.error('Failed to start speech recognition', e);
        }
      }
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || !accessToken) return;
    
    let targetSessionId = activeSessionId;
    
    if (!targetSessionId) {
      targetSessionId = await createSession(accessToken, selectedMode);
    }

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const isATS = text.toLowerCase().includes('ats') || selectedMode === 'Resume Expert';
    const finalUseResume = useResume || isATS;

    await sendMessage(accessToken, targetSessionId, text, finalUseResume, useProfile);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = async (format: 'PDF' | 'TXT' | 'MD') => {
    if (messages.length === 0) return;
    const session = sessions.find(s => s.id === activeSessionId);
    const title = session?.title || 'Chat Export';
    const filename = `${title.replace(/\s+/g, '_')}_Export`;

    if (format === 'TXT' || format === 'MD') {
      let content = `# ${title}\n\n`;
      messages.forEach(m => {
        content += `### ${m.sender === 'USER' ? 'You' : 'AI Copilot'}\n`;
        content += `${m.message}\n\n`;
      });
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format.toLowerCase()}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'PDF') {
      const blob = await pdf(<PdfDocument messages={messages} title={title} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setShowExportDropdown(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950 relative">
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        
        <div className="relative">
          <button 
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-medium text-zinc-800 dark:text-zinc-200"
          >
            {selectedMode}
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>
          
          {showModeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 py-1">
              {AI_MODES.map(mode => (
                <button
                  key={mode}
                  onClick={() => { setSelectedMode(mode); setShowModeDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${selectedMode === mode ? 'text-indigo-600 font-semibold' : 'text-zinc-700 dark:text-zinc-300'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setUseResume(!useResume)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              useResume 
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' 
                : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Use My Resume
          </button>
          
          <button
            onClick={() => setUseProfile(!useProfile)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              useProfile 
                ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300' 
                : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Use My Profile
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              disabled={messages.length === 0}
              className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {showExportDropdown && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 py-1">
                {['PDF', 'TXT', 'MD'].map(format => (
                  <button
                    key={format}
                    onClick={() => handleExport(format as any)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    Export {format}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
        
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto text-center px-4">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
              <span className="text-4xl font-bold">AI</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-10">
              InterviewAI Copilot is here to help with your Resume, Placement, Coding, and Career.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
              {QUICK_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 hover:shadow-md transition-all text-left truncate"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {messages.map((msg, idx) => (
              <div key={msg.id || idx} className={`flex gap-4 ${msg.sender === 'USER' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-sm ${
                  msg.sender === 'USER' 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black' 
                    : 'bg-indigo-600 text-white'
                }`}>
                  {msg.sender === 'USER' ? 'U' : 'AI'}
                </div>
                
                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs font-semibold text-zinc-500">
                    {msg.sender === 'USER' ? 'You' : 'InterviewAI Copilot'}
                  </span>
                  
                  <div className={`p-4 rounded-2xl ${
                    msg.sender === 'USER'
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-tr-sm'
                      : 'bg-transparent text-zinc-800 dark:text-zinc-200'
                  }`}>
                    {msg.sender === 'USER' ? (
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    ) : (
                      <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({node, inline, className, children, ...props}: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 my-4 bg-[#1d1f21]">
                                  <div className="flex justify-between items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                                    <span className="text-xs font-mono text-zinc-500">{match[1]}</span>
                                    <button 
                                      onClick={() => copyToClipboard(String(children).replace(/\n$/, ''), msg.id + match[1])}
                                      className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                    >
                                      {copiedId === msg.id + match[1] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                  </div>
                                  <SyntaxHighlighter
                                    {...props}
                                    style={atomDark}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                </div>
                              ) : (
                                <code {...props} className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600 dark:text-indigo-400">
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  
                  {msg.sender === 'AI' && (
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={() => copyToClipboard(msg.message, msg.id)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button 
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors"
                        title="Regenerate"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isSending && (
              <div className="flex gap-4">
                <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-sm bg-indigo-600 text-white">AI</div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-zinc-500">InterviewAI Copilot</span>
                  <div className="flex items-center gap-1.5 p-4">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all shadow-sm">
          
          <button 
            className="p-2.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors shrink-0"
            title="Attach file (Coming Soon)"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Listening..." : "Message Copilot..."}
            className="w-full max-h-48 min-h-[44px] bg-transparent resize-none py-2.5 px-1 outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400"
            rows={1}
            disabled={isSending}
          />
          
          <div className="flex items-center gap-1 shrink-0 pb-1">
            <button 
              onClick={toggleRecording}
              className={`p-2.5 rounded-xl transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400' 
                  : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
              }`}
              title={isRecording ? 'Stop Recording' : 'Start Voice Input'}
            >
              {isRecording ? <StopCircle className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isSending}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              {isSending ? <Square className="w-5 h-5 fill-current" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-zinc-500 mt-2">
          AI can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  );
}
