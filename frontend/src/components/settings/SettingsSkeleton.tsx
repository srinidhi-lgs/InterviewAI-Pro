export default function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/4"></div>
      </div>
      <div className="h-px bg-gray-200 dark:bg-gray-800" />
      
      <div className="space-y-6 max-w-xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          </div>
        ))}
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32 mt-4"></div>
      </div>
    </div>
  );
}
