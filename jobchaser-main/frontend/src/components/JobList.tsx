import type { Job } from '../types/types'
import JobItem from './JobItem'

interface JobsListProps {
  jobs: Job[]
  jobAds: Job[]
  savedJobIds?: Set<string>
}

export default function JobList({ jobs, jobAds, savedJobIds }: JobsListProps) {
  const allJobs = [...jobAds, ...jobs]; 

  if (allJobs.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500 font-medium">Inga jobb matchar din sökning.</p>
      </div>
    );
  }
    
  return (
    <div className="p-5 flex flex-col gap-4">
      {allJobs.map((jobItem) => (
        <JobItem
          key={jobItem.id}
          job={jobItem}
          initialIsSaved={savedJobIds?.has(jobItem.id) || false}
        />
      ))}
    </div>
  );

}