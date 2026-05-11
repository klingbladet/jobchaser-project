import { useState } from 'react';
import type { Job } from '../types/types';
import { useAuthStore } from '../store/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobSchema } from '../lib/validation';
import { z } from 'zod';

interface CreateJobAdProps {
  onAddJob: (job: Job) => void;
}

type JobFormData = z.infer<typeof JobSchema>;

export default function CreateJobAd({ onAddJob }: CreateJobAdProps) {
  const { token, isAuthenticated } = useAuthStore();
  const [isVisable, setIsVisable] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<JobFormData>({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      headline: '',
      employerName: '',
      municipality: '',
      descriptionText: '',
      workingHoursLabel: '',
      durationLabel: '',
      webpageUrl: ''
    }
  });

  async function onSubmit (data: JobFormData) {
    setError('')
    
    const url = "http://localhost:3000/jobs"
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      const result = await response.json();

      if(!response.ok) {
        setError(result.error || 'Kunde inte skapa jobb');
        return;
      } 

      console.log("Jobb Skapat:", result);
      alert('Nytt jobb skapat!');

      // Map flat backend response to nested Job structure the frontend expects
      const mappedJob: Job = {
        id: result.job.id,
        headline: result.job.headline,
        employer: { name: result.job.employerName },
        workplace_address: { municipality: result.job.municipality },
        description: { text: result.job.descriptionText },
        working_hours_type: { label: result.job.workingHoursLabel },
        duration: { label: result.job.durationLabel },
        publication_date: result.job.publicationDate,
        webpage_url: result.job.webpageUrl,
        logo_url: result.job.logoUrl,
        occupation_field: {
          label: ''
        }
      };
      onAddJob(mappedJob);

      reset();
      setIsVisable(false);

    } catch (err) {
      console.error('Nätverksfel:', err)
      setError('Kunde inte ansluta till servern')
    }
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-slate-800 dark:bg-red-200 p-6 rounded-2xl border border-none shadow-sm mb-10">
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold text-slate-100 dark:text-slate-800 font-sans">Lägg till ny jobbannons</h3>
        <button className="text-3xl cursor-pointer text-slate-100 dark:text-slate-800" onClick={() => setIsVisable(!isVisable)}>
          {isVisable ? 'ꜛ' : 'ꜜ'}
        </button>
      </div>
      {isVisable && (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-slate-300 dark:text-slate-600 mb-1 ml-1">Jobbtitel</label>
          <input
            {...register("headline")}
            type="text" 
            placeholder="t.ex. Frontend Developer"
            className={`w-full px-4 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all ${errors.headline ? 'border-red-500' : 'border-slate-200'}`}
          />
          {errors.headline && <p className="text-red-400 text-xs mt-1">{errors.headline.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 dark:text-slate-600 mb-1 ml-1">Företag</label>
          <input
            {...register("employerName")}
            type="text" 
            placeholder="t.ex. Tech AB"
            className={`w-full px-4 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all ${errors.employerName ? 'border-red-500' : 'border-slate-200'}`}
          />
          {errors.employerName && <p className="text-red-400 text-xs mt-1">{errors.employerName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 dark:text-slate-600 mb-1 ml-1">Stad</label>
          <input
            {...register("municipality")}
            type="text" 
            placeholder="t.ex. Stockholm"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 dark:text-slate-600 mb-1 ml-1">Anställningstyp</label>
          <input
            {...register("workingHoursLabel")}
            type="text" 
            placeholder="Tillsvidare"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 dark:text-slate-600 mb-1 ml-1">Tid</label>
          <input
            {...register("durationLabel")}
            type="text" 
            placeholder="Heltid"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 dark:text-slate-600 mb-1 ml-1">Beskrivning</label>
          <textarea 
            {...register("descriptionText")}
            placeholder="Beskrivning"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 dark:text-slate-600 mb-1 ml-1">Länk till din annons (valfritt)</label>
          <input
            {...register("webpageUrl")}
            type="text" 
            placeholder="https://..."
            className={`w-full px-4 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all ${errors.webpageUrl ? 'border-red-500' : 'border-slate-200'}`}
          />
          {errors.webpageUrl && <p className="text-red-400 text-xs mt-1">{errors.webpageUrl.message}</p>}
        </div>
        
        <button 
          type="submit"
          className="cursor-pointer mt-2 w-full bg-slate-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all active:transform active:scale-[0.98]"
        >
          Publicera annons
        </button>
      </form>
      )}
    </div>
  )
}
