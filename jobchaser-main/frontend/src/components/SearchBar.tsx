import { useFilter } from '../context/FilterContext';

export default function SearchBar() {
  const { state, dispatch } = useFilter();
  
  return (
    <div className="mb-8">
      <input 
        type="text"  
        placeholder="Sök på titel eller företag..."
        value={state.searchTerm}
        onChange={(e) => dispatch({ type: 'SET_TEXT_FILTER', payload: e.target.value })}
        className="w-full px-5 py-3 rounded-xl bg-white shadow-sm focus:outline-none focus:border-none focus:border-transparent transition-all placeholder:text-black text-slate-700"
      />
    </div>
  );
}
