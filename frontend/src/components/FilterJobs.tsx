import { useState } from 'react';
import { useFilter } from '../context/FilterContext';

function FilterJobs() {
  const [isVisable, setIsVisable] = useState(false);
  const { state, dispatch } = useFilter();

  const popularLocations = ["Stockholm", "Uppsala", "Linköping", "Göteborg", "Malmö"]
  const moreLocations = ["Västerås", "Örebro", "Helsingborg", "Jönköping", "Norrköping", "Umeå", "Lund", "Borås", "Huddinge", "Nacka", "Eskilstuna", "Halmstad", "Gävle", "SöderTälje", "Haninge"];
  const categories = ["Bygg och anläggning", "Administration, ekonomi, juridik", "Chefer och verksamhetsledare", "Data/IT", "Försäljning, inköp, marknadsföring", "Hantverksyrken", "Hotell, restaurang, storhushåll", "Hälso- och sjukvård", "Industriell tillverkning", "Installation, drift, underhåll", "Pedagogik"]

  const handleCityChange = (city: string) => {
    const newLocations = state.filterLocation.includes(city)
      ? state.filterLocation.filter(c => c !== city)
      : [...state.filterLocation, city];
    
    dispatch({ type: 'SET_LOCATION', payload: newLocations });
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = state.filterCategory.includes(category)
      ? state.filterCategory.filter(c => c !== category)
      : [...state.filterCategory, category];
    
    dispatch({ type: 'SET_CATEGORY', payload: newCategories });
  };

  return (
    <div>
      <h2 className="dark:text-white text-slate-900 flex justify-start text-xl p-3 mb-0">Filter</h2>
      <div className="w-90 md:w-100 flex flex-col mt-0 mr-10 border rounded-xl dark:border-red-200 border-slate-900">
        <h3 className="dark:text-white text-slate-900 flex justify-center text-l w-40 mb-3 mt-3 font-bold">Popular Locations</h3>
        <div className="mb-3 flex flex-col justify-center pl-4 text-white rounded-xl">
          {popularLocations.map((city) => (
            <label key={city} className="flex p-1 text-sm text-slate-700 mb-0">
              <input
                type="checkbox"
                checked={state.filterLocation.includes(city)}
                onChange={() => handleCityChange(city)}
                className="accent-black text-black mr-2 w-5 h-5 rounded mb-3 border-slate-300 border-radius-10 text-whte focus:ring-blue-500 cursor-pointer"
              />
              <span className="dark:text-white text-slate-900 group-hover:text-slate-900 transition-colors">
                {city}
              </span>
            </label>
          ))}
          {isVisable &&
            <div>
              {moreLocations.map((city) => (
                <label key={city} className="flex p-1 text-sm text-slate-700">
                  <input 
                    type="checkbox"
                    checked={state.filterLocation.includes(city)}
                    onChange={() => handleCityChange(city)}
                    className="accent-black text-black mr-2 w-5 h-5 rounded mb-3 border-slate-300 border-radius-10 text-whte focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="dark:text-white text-slate-900 group-hover:text-slate-900 transition-colors">
                    {city}
                  </span>
                </label>
              ))}
            </div>
          }
          <button className="self-center text-xs bg-whitetext-3xl cursor-pointer dark:text-red-200 text-slate-900 hover:underline"  onClick={() => setIsVisable(!isVisable)}>
          {isVisable ? 'Show Less' : 'Show more Locations'}
          </button>
          
        <h3 className="dark:text-white text-slate-900 mb-3 mt-3 font-bold">Categories</h3>
        <div className="flex flex-col justify-start mb-6 text-white rounded-xl">
          {categories.map((category) => (
            <label key={category} className="flex p-1 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={state.filterCategory.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="accent-black text-black mr-2 w-5 h-5 rounded mb-3 border-slate-300 border-radius-10 text-whte focus:ring-blue-500 cursor-pointer"
              />
              <span className="dark:text-white text-slate-900 group-hover:text-slate-900 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
        {(state.filterLocation.length > 0 || state.filterCategory.length > 0) && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
            className="mb-5 mt-4 text-xs dark:text-red-200 text-slate-900 hover:underline cursor-pointer"
          >
            Rensa filter
          </button>
      )}
        </div>
      </div>
    </div>
  )
}

export default FilterJobs;
