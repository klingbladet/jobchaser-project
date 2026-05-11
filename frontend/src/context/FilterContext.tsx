import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';

// 1. Definiera State-typ
interface FilterState {
  searchTerm: string;
  filterLocation: string[];
  filterCategory: string[];
  filterEmploymentType: string[];
}

// 2. Definiera Action-typer
type FilterAction =
  | { type: 'SET_TEXT_FILTER'; payload: string }
  | { type: 'SET_LOCATION'; payload: string[] }
  | { type: 'SET_CATEGORY'; payload: string[] }
  | { type: 'SET_EMPLOYMENT_TYPE'; payload: string[] }
  | { type: 'CLEAR_FILTERS' };

// 3. Initial state
const initialState: FilterState = {
  searchTerm: '',
  filterLocation: [],
  filterCategory: [],
  filterEmploymentType: [],
};

// 4. Reducer-funktion
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_TEXT_FILTER':
      return { ...state, searchTerm: action.payload };
    case 'SET_LOCATION':
      return { ...state, filterLocation: action.payload };
    case 'SET_CATEGORY':
      return { ...state, filterCategory: action.payload };
    case 'SET_EMPLOYMENT_TYPE':
      return { ...state, filterEmploymentType: action.payload };
    case 'CLEAR_FILTERS':
      return initialState;
    default:
      return state;
  }
}

// 5. Skapa Context
interface FilterContextType {
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

// 6. Provider-komponent
export function FilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

// 7. Custom hook för att använda filtren
export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
