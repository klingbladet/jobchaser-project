import { Outlet } from "react-router";
import './App.css'
import Header from './components/Header';
import { FilterProvider } from './context/FilterContext';

function App() {

  return (
    <FilterProvider>
      <Header />
      <main>
        <Outlet />
      </main>
    </FilterProvider>
  )
}

export default App;