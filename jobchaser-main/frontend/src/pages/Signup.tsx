import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignupSchema } from '../lib/validation'
import { z } from 'zod'
import Footer from '../components/Footer'

type SignupFormData = z.infer<typeof SignupSchema>

export default function Signup() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema)
  })
  
  async function onSubmit(data: SignupFormData) {
    setError('')

    const url = "http://localhost:3000/users/signup"

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username: data.username, 
          email: data.email, 
          password: data.password
        })
      })

      const result = await response.json();

      if(!response.ok) {
        setError(result.error || 'Kunde inte skapa kontot');
        return;
      }

      console.log('Användaren skapad:', result);
      alert('Konto skapat! Du skickas nu till inloggningen.');
      navigate('/signin')
    } catch(err) {
      console.error('Nätverksfel:', err)
      setError('Kunde inte ansluta till servern')
    }
  } 
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4 transition-colors">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-red-200">Skapa konto</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm text-center">
              <strong>Går inte att skapa konto:</strong> {error}
          </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Användarnamn
                </label>
                <input
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="Ditt användarnamn"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-red-200 dark:bg-slate-700 dark:text-white outline-none transition-all ${errors.username ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'}`}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  E-postadress
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="text"
                  placeholder="Din e-postadress"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-red-200 dark:bg-slate-700 dark:text-white outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Lösenord
                </label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-red-200 dark:bg-slate-700 dark:text-white outline-none transition-all ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Repetera lösenord
                </label>
                <input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-red-200 dark:bg-slate-700 dark:text-white outline-none transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 dark:bg-red-200 text-white dark:text-slate-900 font-bold rounded-xl transition-all hover:bg-slate-800 dark:hover:bg-red-300 active:transform active:scale-[0.98] shadow-md"
            >
              Skapa konto
            </button>
          </form>
        </div>
      </div>
    <Footer />
    </>
  )
}