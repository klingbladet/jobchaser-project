import { useState, useEffect } from 'react'
import JobList from "../components/JobList"
import SearchBar from "../components/SearchBar"
import CreateJobAd from '../components/CreateJobAd'
import type { Job } from '../types/types'
import { useAuthStore } from '../store/authStore'
import { useFilter } from '../context/FilterContext' // Importera useFilter
import FilterJobs from '../components/FilterJobs'
import Footer from '../components/Footer'

interface LocalJobResponse {
  id: string;
  headline: string;
  employerName: string;
  municipality: string;
  descriptionText: string;
  workingHoursLabel: string;
  durationLabel: string;
  occupationField: string;
  publicationDate: string;
  logoUrl: string;
}

export default function Jobs() {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { state } = useFilter(); // Använd useFilter
  const { searchTerm, filterLocation, filterCategory } = state;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobAds, setJobAds] = useState<Job[]>([]); 
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)
  
  const limit = 50;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setOffset(0); 
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchSavedJobs() {
      if (!isAuthenticated || !token) {
        setSavedJobIds(new Set());
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/jobs/saved', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const ids = new Set<string>(data.map((j: { id: string }) => j.id));
          setSavedJobIds(ids);
        }
      } catch (err) {
        console.error("Kunde inte hämta sparade jobb-IDn:", err);
      }
    }
    fetchSavedJobs();
  }, [isAuthenticated, token]);

  useEffect(() => {
    async function getJobApi(currentOffset: number) {
      const url = `https://jobsearch.api.jobtechdev.se/search?q=${encodeURIComponent(debouncedSearch)}&limit=${limit}&offset=${currentOffset}`;


      console.log("Fetching from API:", url)

      const localUrl = "http://localhost:3000/jobs"
      try {
        setLoading(true);
        const [apiResponse, localResponse] = await Promise.all([
          fetch(url, { headers: {'accept': 'application/json'} }),
          fetch(localUrl)
        ]);

        if(!apiResponse.ok) throw new Error(`API Error: ${apiResponse.status}`);
        if (!localResponse.ok) throw new Error(`local Backend Error: ${localResponse.status}`);

        const [apiResult, localResult] = await Promise.all([
          apiResponse.json(),
          localResponse.json()
        ])
        if (currentOffset === 0) {
        setJobs(apiResult.hits || []);
        } else {
          setJobs(prev => [...prev, ...(apiResult.hits || [])]); // Vid "Fler jobb"
        }

        const mappedLocalJobs: Job[] = localResult.map((job: LocalJobResponse) => ({
          id: job.id,
          headline: job.headline,
          employer: { name: job.employerName },
          workplace_address: { municipality: job.municipality },
          description: { text: job.descriptionText },
          working_hours_type: { label: job.workingHoursLabel },
          duration: { label: job.durationLabel },
          publication_date: job.publicationDate,
          occupation_field: { label: job.occupationField },
          webpage_url: job.logoUrl
        }))
        console.log(apiResult.hits);

        setJobAds(mappedLocalJobs)
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false)
      }
    }
    getJobApi(offset)
  }, [debouncedSearch, offset, filterLocation, filterCategory]);

  useEffect(() => {
    setOffset(0);
  }, [filterLocation, filterCategory]);

  // Funktion för att lägga till nya jobb manuellt
  const handleAddJobAd = (newJob: Job) => {
    setJobAds((prevAds) => [newJob, ...prevAds]);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLocation = 
      filterLocation.length === 0 ||
      filterLocation.includes(job.workplace_address?.municipality || "")

    const matchesCategory =
      filterCategory.length === 0 ||
      filterCategory.includes(job.occupation_field?.label || "")

    return matchesSearch && matchesLocation && matchesCategory
  });

  const filteredJobAds = jobAds.filter(jobAd => {
    const matchesSearch = 
      jobAd.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobAd.employer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLocation = 
      filterLocation.length === 0 || 
      filterLocation.includes(jobAd.workplace_address?.municipality || "")
    
    const matchesCategory = 
      filterCategory.length === 0 ||
      filterCategory.includes(jobAd.occupation_field?.label || "")
    
    return matchesSearch && matchesLocation && matchesCategory
  });



  return (
    <div>
      <header className="mb-30 mt-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-red-200 sm:text-5xl">
            JobChaser
          </h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-red-200">
            Vad söker du för jobb?
          </p>
      </header>
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between">
        <div className="mb-20 bg-none md:ml-30 md:mr-20 w-90 md:w-100 ml-5 mr-5 flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900  text-slate-900 font-sans">
          <SearchBar />
          <CreateJobAd onAddJob={handleAddJobAd} />
          <FilterJobs />  
        </div>  
        <div className="flex flex-col md-flex-col w-full justify-start md:mr-30">
          <div className="w-full">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-300 mb-4"></div>
                <p className="text-slate-200 animate-pulse">Hämtar de senaste jobben...</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl mb-6 flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-bold">Ett fel uppstod</p>
                  <p className="text-sm">{error.message}</p>
                </div>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="ml-7 mr-7 flex md:justify-between items-center mb-6 border-b border-slate-100 ">
                  <h2 className="dark:text-red-100 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Alla annonser ({filteredJobs.length + filteredJobAds.length})
                  </h2>
                </div>
                <JobList jobs={filteredJobs} jobAds={filteredJobAds} savedJobIds={savedJobIds} />
              </>
            )}
          </div>
          <button 
            className="flex flex-row justify-center mb-10 mt-5 mx-auto bg-none dark:text-white px-4 py-2 cursor-pointer " 
            onClick={() => setOffset(prev => prev + limit)}>Ladda fler jobb
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}