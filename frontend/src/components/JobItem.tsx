import { useState, useEffect } from 'react'
import type { Job } from '../types/types'
import { Bookmark } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

interface JobsProps {
  job: Job;
  initialIsSaved?: boolean;
}

export default function JobItem({ job, initialIsSaved = false }: JobsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  async function handleSaveButton() {

    if (!isAuthenticated) {
      alert("Du måste vara inloggad för att spara jobb!");
      return;
    }

    const method = isSaved ? 'DELETE' : 'POST';
    const url = isSaved 
      ? `http://localhost:3000/jobs/saved/${job.id}`
      : `http://localhost:3000/jobs/saved`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: !isSaved ? JSON.stringify({ 
          jobId: job.id,
          jobData: job
        }) : undefined

      });

      if (response.ok) {
        setIsSaved(!isSaved);
        alert(isSaved ? "Borttaget!" : "Sparat");
      }
    } catch (err) {
      console.error("Kunde inte uppdatera sparade jobb", err)
    }
  }

  return (
    <div className="p-6 bg-slate-800 dark:bg-red-200 border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all group">
      <div className="flex justify-between items-start">
        <div>
          <img 
            src={job.logo_url} 
            alt="logo"
            className="w-10 mr-5" 
          /> 
            
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-100 dark:text-slate-800 transition-colors">
            {job.headline}
          </h3>
          <p className="text-slate-100 dark:text-slate-800 font-medium mt-1">{job.employer?.name}</p>
        </div>
        <span className="text-xs text-red-100 dark:text-slate-800 px-2 py-1 rounded-md">
          {new Date(job.publication_date).toLocaleDateString()}
        </span>
        <button 
            onClick={handleSaveButton}
            className="flex items-center gap-2 e ml-5 rounded-lg cursor-pointer text-white">
            <Bookmark className="" size={20} fill={isSaved ? "white" : "none"} /> 
        </button>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <small className="dark:text-slate-800 text-gray-300  font-mono">ID: {job.id}</small>
        <button 
          className="text-sm font-semibold text-red-100 dark:text-slate-800 hover:text-slate-700 transition-colors cursor-pointer"
          onClick={() => setIsOpen(true)}  
          >
          Visa annons →
        </button>
      </div>
            { /*THE MODAL*/ }
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur" 
            onClick={() => setIsOpen(false)}
          ></div>
 
          {/*Open Modal*/}
          <div className="relative text-black bg-red-50 dark:bg-red-200 rounded-2xl shadow-xl max-w-lg w-full max-h-full overflow-y-auto p-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{job.headline}</h2>
            <p className="font-semibold mb-4">{job.employer?.name}</p>
            <p className="font-semibold mb-4">Stad: {job.workplace_address?.municipality}</p>
            <p><span className="font-semibold text-black">Anställning:</span> {job.duration?.label} </p>
            <p><span className="font-semibold text-black">Tid:</span> {job.working_hours_type?.label}</p>
            <h3 className="font-semibold mt-3">Om jobbet</h3>
            <p className="text-sm mt-3 mb-3">{job.description?.text}</p>
            <a className="font-semibold hover:text-slate-700" href={job.webpage_url} target="_blank">Gå till ursprunglig annons →</a>
            <div className="prose prose-slate mb-6 mt-3">
              <p>ID: {job.id}.</p>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </div>
    
  );
}
