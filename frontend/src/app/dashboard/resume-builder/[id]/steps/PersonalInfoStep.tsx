import { useBuilderStore } from '@/store/builderStore';

export default function PersonalInfoStep() {
  const { currentResume, updateField } = useBuilderStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Personal Information</h2>
        <p className="text-sm text-zinc-500 mt-1">Add your contact details to help recruiters reach you.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
          <input 
            type="text" 
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={currentResume.fullName || ''}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="e.g. John Doe"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
          <input 
            type="email" 
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={currentResume.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="e.g. john@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number</label>
          <input 
            type="tel" 
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={currentResume.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="e.g. +1 234 567 890"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Location</label>
          <input 
            type="text" 
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={currentResume.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="e.g. San Francisco, CA"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">LinkedIn URL</label>
          <input 
            type="url" 
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={currentResume.linkedin || ''}
            onChange={(e) => updateField('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">GitHub URL</label>
          <input 
            type="url" 
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={currentResume.github || ''}
            onChange={(e) => updateField('github', e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Personal Website / Portfolio</label>
          <input 
            type="url" 
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={currentResume.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://johndoe.com"
          />
        </div>
      </div>
    </div>
  );
}
