import { ThemeProvider } from "@/components/theme-provider";
import viteLogo from "/logo-white.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Building2Icon, ChevronDown, ChevronRight, Home, Menu, X } from "lucide-react";
import Buildings from './assets/buildings.png';
import { useState, useEffect } from "react";
import { DashboardProvider } from './hooks/DashboardContext';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { getCamiguinLGUList, getMisorLGUList } from "./lib/functions/PerProvince";
import { useNavigate } from 'react-router-dom';
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
  const camiguinLGUs = getCamiguinLGUList();
  const misorLGUs = getMisorLGUList();
  // LGU data with scores
  const provincesData = {
    camiguin: [
      { name: "Mambajao", score: "" },
      { name: "Catarman", score: "" },
      { name: "Sagay", score: "" },
      { name: "Mahinog", score: "" },
      { name: "Guinsiliban", score: "" }
    ],
    misamisOriental: [
      { name: "Cagayan de Oro City", score: "88.6%" },
      { name: "Claveria", score: "87.6%" },
      { name: "Naawan", score: "87.17%" },
      { name: "Magsaysay", score: "83.27%" },
      { name: "Medina", score: "75.96%" },
      { name: "Laguindingan", score: "72.72%" },
      { name: "Gitagum", score: "72.66%" },
      { name: "Balingasag", score: "71.38%" },
      { name: "Libertad", score: "70.74%" },
      { name: "Talisayan", score: "69.87%" },
      { name: "Lagonglong", score: "69.57%" },
      { name: "Alubijid", score: "69.41%" },
      { name: "Gingoog", score: "68.11%" },
      { name: "El Salvador City", score: "67.75%" },
      { name: "Lugait", score: "67.64%" },
      { name: "Villanueva", score: "66.8%" },
      { name: "Opol", score: "65.61%" },
      { name: "Kinoguitan", score: "65.27%" },
      { name: "Initao", score: "63.93%" },
      { name: "Balingoan", score: "60.04%" },
      { name: "Jasaan", score: "59.3%" },
      { name: "Sugbongcogon", score: "57.31%" },
      { name: "Binuangan", score: "55.17%" },
      { name: "Manticao", score: "54.97%" },
      { name: "Salay", score: "47.64%" },
      { name: "Tagoloan", score: "47.56%" }
    ]
  };

  const toggleProvince = (province: string) => {
    if (expandedProvince === province) {
      setExpandedProvince(null);
    } else {
      setExpandedProvince(province);
    }
  };

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

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      // Check if we're at the bottom (with a small threshold)
      const isBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 10;
      setIsAtBottom(isBottom);
    };

    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Helper function to check if current path includes the base route
  const isActiveRoute = (basePath: string) => {
    return currentPath.startsWith(basePath);
  };

  const handleScroll = () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      if (isAtBottom) {
        mainContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        mainContent.scrollTo({
          top: mainContent.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

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
  transition-transform duration-1000 ease-in-out overflow-y-auto
  ${isOpen ? 'translate-x-0' : ' fixed -translate-x-full'}
`}>
            <Link className="justify-center w-full flex items-center text-white" to="/">
              <img src={viteLogo} className="logo mt-4 h-20 object-contain" alt="Vite logo" />
            </Link>

            <Link
              to="/dashboard"
              className={`rounded-sm py-2 mr-5 px-2 mb-5 flex items-center mt-24 ml-5 gap-2 ${currentPath === '/dashboard' ? 'bg-[#ECC217]' : 'bg-[#ecc11700]'
                }`}
            >
              <Home className="text-white" />
              <h1 className="text-white font-bold text-lg md:text-2xl">Dashboard</h1>
            </Link>

            <div className="ml-5 sm:ml-10">
              <h1 className="text-white font-bold text-lg mb-4">Provinces</h1>
              <ul className="px-2 flex flex-col space-y-2 sm:space-y-2">
                {/* Camiguin with submenu */}
                <li>
                  <div
                    className={`flex items-center justify-between cursor-pointer p-2 rounded-sm ${isActiveRoute('/camiguin') ? 'bg-[#1C1D20]' : 'hover:bg-[#1C1D20]'
                      }`}
                    onClick={() => {
                      toggleProvince('camiguin');
                      navigate('/camiguin');
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Building2Icon className="text-white" />
                      <Link
                        to="/camiguin"
                        className="text-white md:text-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Camiguin
                      </Link>
                    </div>
                    {expandedProvince === 'camiguin' ? (
                      <ChevronDown className="text-white" />
                    ) : (
                      <ChevronRight className="text-white" />
                    )}
                  </div>

                  {/* LGU submenu */}
                  {expandedProvince === 'camiguin' && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {provincesData.camiguin.map((lgu, index) => (
                        <li key={index} className="flex items-center justify-between p-2 text-white hover:bg-[#1C1D20]/50 cursor-pointer rounded-sm">
                          <Link
                            to={`/camiguin/${lgu.name.toUpperCase().replace(/\s+/g, ' s')}`}
                            className="text-white text-sm md:text-base flex-grow"
                          >
                            {lgu.name.toUpperCase()}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Misamis Oriental with submenu */}
                <li>
                  <div
                    className={`flex items-center justify-between cursor-pointer p-2 rounded-sm ${isActiveRoute('/misamis-oriental') ? 'bg-[#1C1D20]' : 'hover:bg-[#1C1D20]'
                      }`}
                    onClick={() => {
                      toggleProvince('misamisOriental');
                      navigate('/misamis-oriental');
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Building2Icon className="text-white" />
                      <Link
                        to="/misamis-oriental"
                        className="text-white md:text-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Misamis Oriental
                      </Link>
                    </div>
                    {expandedProvince === 'misamisOriental' ? (
                      <ChevronDown className="text-white" />
                    ) : (
                      <ChevronRight className="text-white" />
                    )}
                  </div>

                  {/* LGU submenu */}
                  {expandedProvince === 'misamisOriental' && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {provincesData.misamisOriental.map((lgu, index) => (
                        <li key={index} className="flex items-center justify-between p-2 text-white hover:bg-[#1C1D20]/50 cursor-pointer rounded-sm">
                          <Link
                            to={`/misamis-oriental/${lgu.name.toUpperCase().replace(/\s+/g, ' ')}`}
                            className="text-white text-sm md:text-base flex-grow"
                          >
                            {lgu.name.toUpperCase()}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </nav>

          {/* Main content area that adjusts with sidebar */}
          <main className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isOpen ? '' : 'ml-0'}
          z-30 min-h-full flex flex-col gap-2  overflow-y-auto relative
        `}

            onClick={() => {
              if (window.innerWidth <= 767) {
                setIsOpen(false)
              }
            }}
          >
            <Outlet />
            <button
              onClick={handleScroll}
              className=" animate__animated animate__bounceIn fixed bottom-8 right-8 z-50 px-4 py-2 rounded-lg bg-[#0036C5]/10 backdrop-blur-sm  transition-all animate__delay-2s duration-1000 flex items-center gap-2"
              aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
            >
              <span className=" text-[#0036C5]  text-sm font-medium">
                {isAtBottom ? "Scroll to top" : "Scroll down, there's more to see!"}
              </span>
              {isAtBottom ? (
                <ArrowUpCircle className=" text-[#0036C5]  " size={20} />
              ) : (
                <ArrowDownCircle className=" text-[#0036C5]  " size={20} />
              )}
            </button>

            <img src={Buildings} className="pointer-events-none w-full object-contain fixed bottom-0 z-0" alt="" />
          </main>
        </div>
      </ThemeProvider>
    </DashboardProvider>
  );
}

export default App;