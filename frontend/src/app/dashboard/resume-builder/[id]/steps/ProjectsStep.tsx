import { useBuilderStore } from '@/store/builderStore';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function ProjectsStep() {
  const { currentResume, updateField } = useBuilderStore();
  const list = currentResume.projects || [];

  const handleAdd = () => {
    updateField('projects', [...list, { 
      id: crypto.randomUUID(),
      name: '',
      description: '',
      url: '',
      technologies: ''
    }]);
  };

  const handleUpdate = (index: number, field: string, value: any) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    updateField('projects', newList);
  };

  const handleRemove = (index: number) => {
    const newList = [...list];
    newList.splice(index, 1);
    updateField('projects', newList);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Projects</h2>
        <p className="text-sm text-zinc-500 mt-1">Add your projects history.</p>
      </div>
      
      <div className="space-y-6">
        {list.map((item: any, index: number) => (
          <div key={item.id || index} className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 relative group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleRemove(index)} className="text-zinc-400 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              
              <div className="space-y-1 ">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Project Name</label>
                
                <input 
                  type="text" 
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={item.name || ''}
                  onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                  placeholder="e.g. E-Commerce Platform"
                />
                
              </div>
              
              <div className="space-y-1 ">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Project URL</label>
                
                <input 
                  type="text" 
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={item.url || ''}
                  onChange={(e) => handleUpdate(index, 'url', e.target.value)}
                  placeholder="e.g. https://github.com/..."
                />
                
              </div>
              
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Technologies Used</label>
                
                <input 
                  type="text" 
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={item.technologies || ''}
                  onChange={(e) => handleUpdate(index, 'technologies', e.target.value)}
                  placeholder="e.g. React, Node.js, PostgreSQL"
                />
                
              </div>
              
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                
                <textarea 
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                  value={item.description || ''}
                  onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                  placeholder="What was the project?"
                />
                
              </div>
              
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleAdd} className="w-full border-dashed border-2">
        <Plus className="h-4 w-4 mr-2" /> Add Project
      </Button>
    </div>
  );
}
