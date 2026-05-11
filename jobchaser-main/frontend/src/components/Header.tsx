import { NavLink } from "react-router";
import DarkModeToggle from './DarkModeToggle'
import Logo from '../assets/jobchaser-logo.svg?react'
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();
    }
  };

  return(
    <div className="flex justify-between mb-10 mt-10 items-center">
      <div className="flex ml-20">
        <NavLink to="/">
          <Logo className="w-12 h-12 text-slate-800
            dark:text-red-200 transition-color" />
        </NavLink>
      </div>
      <div className="flex gap-10 mr-20 items-center">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="cursor-pointer text-slate-700 dark:text-white  transition-colors hover:underline decoration-1 underline-offset-4"
          >
            Log out
          </button> 
        ) : (
        <NavLink 
          to="/signin" 
          className={({ isActive }) => 
            `transition-colors hover:underline decoration-1 underline-offset-4 ${isActive ? 'text-slate-800 dark:text-red-200' : 'text-slate-700 dark:text-white '}`
          }
        >
          Log in
        </NavLink>
        )}
        <NavLink to="/savedjobs" className="cursor-pointer text-slate-700 dark:text-white  transition-colors hover:underline decoration-1 underline-offset-4" >
          Saved Jobs
        </NavLink>
        <DarkModeToggle />
      </div>
    </div>
  )
}