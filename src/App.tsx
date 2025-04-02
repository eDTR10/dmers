import { ThemeProvider } from "@/components/theme-provider";
import viteLogo from "/logo-white.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Building2Icon, Home, Menu, X } from "lucide-react";
import Buildings from './assets/buildings.png';
import { useState, useEffect } from "react";
import { DashboardProvider } from './hooks/DashboardContext';

function App() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(true);

  // Add screen size detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <DashboardProvider>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="relative bg-background h-screen w-screen flex overflow-hidden">
        {/* Burger Menu Button - Only visible on mobile */}
        <button 
          onClick={toggleSidebar}
          className="md:block hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0036C5] text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Navigation */}
        <nav className={`
          z-40 bg-[#0036C5] border-r-2 
          w-[20vw] md:w-[300px] h-full md:absolute relative
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : ' fixed -translate-x-full'}
        `}>
          <Link className="justify-center w-full flex items-center text-white" to="/">
            <img src={viteLogo} className="logo mt-4 h-20 object-contain" alt="Vite logo" />
          </Link>

          <Link 
            to="/dashboard" 
            className={`rounded-sm py-2 mr-5 px-2 mb-5 flex items-center mt-24 ml-5 gap-2 ${
              currentPath === '/dashboard' ? 'bg-[#ECC217]' : 'bg-[#ecc11700]'
            }`}
          >
            <Home className="text-white" />
            <h1 className="text-white font-bold text-lg md:text-2xl">Dashboard</h1>
          </Link>

          <div className="ml-5 sm:ml-10">
            <h1 className="text-white font-bold text-lg mb-4">Provinces</h1>
            <ul className="px-2 flex flex-col space-y-2 sm:space-y-2">
              <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-sm ${
                currentPath === '/camiguin' ? 'bg-[#1C1D20]' : 'hover:bg-[#1C1D20]'
              }`}>
                <Building2Icon className="text-white" />
                <Link to="/camiguin" className="text-white  md:text-2xl">Camiguin</Link>
              </li>
              <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-sm ${
                currentPath === '/misamis-oriental' ? 'bg-[#1C1D20]' : 'hover:bg-[#1C1D20]'
              }`}>
                <Building2Icon className="text-white" />
                <Link to="/misamis-oriental" className="text-white md:text-2xl">Misamis Oriental</Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Overlay - Only visible on mobile when menu is open */}
     

        {/* Main content area that adjusts with sidebar */}
        <main className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isOpen ? '' : 'ml-0'}
          z-30 min-h-full flex flex-col gap-2 overflow-y-auto
        `}>
          <Outlet />
          <img src={Buildings} className=" pointer-events-none w-full object-contain fixed bottom-0 z-0" alt="" />
        </main>
      </div>
    </ThemeProvider>
    </DashboardProvider>
  );
}

export default App;