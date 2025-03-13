import { ThemeProvider } from "@/components/theme-provider";
import viteLogo from "/logo-white.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Building2Icon, Home } from "lucide-react";
import Buildings from './assets/buildings.png';

function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="relative bg-background h-screen w-screen flex overflow-hidden">
        <nav className="z-30 bg-[#0036C5] border-r-2 animate__animated animate__slideInLeft flex flex-col w-[340px] h-full py-5 border-b-[0px] border-accent text-white gap-5">
          <Link className="justify-center w-full flex items-center text-white" to="/dmers">
            <img src={viteLogo} className="logo mt-4 h-20 object-contain" alt="Vite logo" />
          </Link>

          <Link 
            to="/dmers/dashboard" 
            className={`rounded-sm py-2 mr-5 px-2 flex items-center mt-24 ml-5 gap-2 ${
              currentPath === '/dmers/dashboard' ? 'bg-[#ECC217]' : 'bg-[#ecc11700]'
            }`}
          >
            <Home className="text-white" />
            <h1 className="text-white font-bold text-lg">Dashboard</h1>
          </Link>

          <div className="ml-5">
            <h1 className="text-white font-bold text-lg mb-4">Provinces</h1>
            <ul className="px-2 flex flex-col space-y-2">
              {/* <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-sm ${
                currentPath === '/dmers/bukidnon' ? 'bg-[#1C1D20]' : 'hover:bg-[#1C1D20]'
              }`}>
                <Building2Icon className="text-white" />
                <Link to="/dmers/bukidnon" className="text-white">Bukidnon</Link>
              </li> */}
              <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-sm ${
                currentPath === '/dmers/camiguin' ? 'bg-[#1C1D20]' : 'hover:bg-[#1C1D20]'
              }`}>
                <Building2Icon className="text-white" />
                <Link to="/dmers/camiguin" className="text-white">Camiguin</Link>
              </li>
              {/* <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-sm ${
                currentPath === '/dmers/lanao-del-norte' ? 'bg-[#1C1D20]' : 'hover:bg-[#1C1D20]'
              }`}>
                <Building2Icon className="text-white" />
                <Link to="/dmers/lanao-del-norte" className="text-white">Lanao del Norte</Link>
              </li>
              <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-sm ${
                currentPath === '/dmers/misamis-occidental' ? 'bg-[#1C1D20]' : 'hover:bg-[#1C1D20]'
              }`}>
                <Building2Icon className="text-white" />
                <Link to="/dmers/misamis-occidental" className="text-white">Misamis Occidental</Link>
              </li> */}
              <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-sm ${
                currentPath === '/dmers/misamis-oriental' ? 'bg-[#1C1D20]' : 'hover:bg-[#1C1D20]'
              }`}>
                <Building2Icon className="text-white" />
                <Link to="/dmers/misamis-oriental" className="text-white">Misamis Oriental</Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="z-30 w-full h-full flex flex-col gap-2">
          <Outlet />
        </div>
        <img src={Buildings} className="w-full object-contain absolute bottom-0 z-20" alt="" />
      </div>
    </ThemeProvider>
  );
}

export default App;