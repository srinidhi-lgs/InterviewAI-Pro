import { useBuilderStore } from '@/store/builderStore';
import { Button } from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';

export default function SummaryStep() {
  const { currentResume, updateField } = useBuilderStore();

  const generateWithAI = () => {
    // Placeholder for future AI integration
    alert("AI generation will be available soon!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Professional Summary</h2>
          <p className="text-sm text-zinc-500 mt-1">Write a short summary highlighting your best skills and achievements.</p>
        </div>
        <Button size="sm" variant="outline" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-500/10" onClick={generateWithAI}>
          <Sparkles className="h-4 w-4 mr-2" /> Enhance with AI
        </Button>
      </div>
      
      <div className="space-y-2">
        <textarea 
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none min-h-[200px] resize-y"
          value={currentResume.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
          placeholder="E.g. Results-driven Software Engineer with 5+ years of experience in developing scalable web applications..."
        />
        <p className="text-xs text-zinc-400 flex justify-end">
          {(currentResume.summary || '').length} characters
        </p>
      </div>
    </div>
  );
}
