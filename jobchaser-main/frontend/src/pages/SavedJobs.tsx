import type { Job } from '../types/types'
import JobItem from '../components/JobItem'
import {useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import Footer from '../components/Footer'

export default function SavedJobs() {
  const {token, isAuthenticated} = useAuthStore();
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }
    fetch('http://localhost:3000/jobs/saved', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if(!res.ok) {
        throw new Error('Kunde inte hämta jobb'); 
      } 
      return res.json()
    })
    .then(data => {
      if(Array.isArray(data)) {
      setSavedJobs(data);
      } else {
        console.error('Backend skickade inte en lista', data);
        setSavedJobs([])
      }
      setIsLoading(false);
    })
    .catch(err => {
      console.error("Fel vid hämtning:", err);
      setIsLoading(false);
      setSavedJobs([])
    });
  }, [token]);

  if (!isAuthenticated) {
    return <p className="text-center mt-20">
        Logga in för att se dina sparade jobb.
    </p>
  }
  if(isLoading) {
    return <p className="text-center mt-20">
      Laddar dina jobb...
    </p>
  }
    
  return (
    <>
      <div className="flex-col mx-auto max-w-200">
        <h1 className='mt-20 mb-20 text-dark-bg-primary text-center dark:text-red-200 text-2xl font-bold'>
          Mina sparade jobb
        </h1>
        {savedJobs.length === 0 ? (
          <p>Du har inte sparat några jobb ännu.</p>
        ) : (
          <div className="grid gap-4 m-5">
            {savedJobs.map(job => (
              <JobItem key={job.id} job={job} initialIsSaved={true} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}