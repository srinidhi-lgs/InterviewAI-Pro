import { useBuilderStore } from '@/store/builderStore';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function ExperienceStep() {
  const { currentResume, updateField } = useBuilderStore();
  const list = currentResume.experience || [];

  const handleAdd = () => {
    updateField('experience', [...list, { 
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      isCurrent: false
    }]);
  };

  const handleUpdate = (index: number, field: string, value: any) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    updateField('experience', newList);
  };

  const handleRemove = (index: number) => {
    const newList = [...list];
    newList.splice(index, 1);
    updateField('experience', newList);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Experience</h2>
        <p className="text-sm text-zinc-500 mt-1">Add your experience history.</p>
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
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Job Title</label>
                
                <input 
                  type="text" 
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={item.position || ''}
                  onChange={(e) => handleUpdate(index, 'position', e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
                
              </div>
              
              <div className="space-y-1 ">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Company</label>
                
                <input 
                  type="text" 
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={item.company || ''}
                  onChange={(e) => handleUpdate(index, 'company', e.target.value)}
                  placeholder="e.g. Google"
                />
                
              </div>
              
              <div className="space-y-1 ">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Location</label>
                
                <input 
                  type="text" 
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={item.location || ''}
                  onChange={(e) => handleUpdate(index, 'location', e.target.value)}
                  placeholder="e.g. Mountain View, CA"
                />
                
              </div>
              
              <div className="space-y-1 ">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Start Date</label>
                
                <input 
                  type="text" 
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={item.startDate || ''}
                  onChange={(e) => handleUpdate(index, 'startDate', e.target.value)}
                  placeholder="e.g. Jan 2020"
                />
                
              </div>
              
              <div className="space-y-1 ">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">End Date</label>
                
                <input 
                  type="text" 
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={item.endDate || ''}
                  onChange={(e) => handleUpdate(index, 'endDate', e.target.value)}
                  placeholder="e.g. Present"
                />
                
              </div>
              
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300"></label>
                
                <div className="flex items-center h-full pt-6">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={item.isCurrent || false}
                    onChange={(e) => handleUpdate(index, 'isCurrent', e.target.checked)}
                  />
                  <span className="text-sm">I currently work here</span>
                </div>
                
              </div>
              
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                
                <textarea 
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                  value={item.description || ''}
                  onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                  placeholder="What did you do?"
                />
                
              </div>
              
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleAdd} className="w-full border-dashed border-2">
        <Plus className="h-4 w-4 mr-2" /> Add Experience
      </Button>
    </div>
  );
}
