import { ThemeProvider } from "@/components/theme-provider";
import viteLogo from "/logo-white.png";
import { Link, Outlet } from "react-router-dom";
import { Building2Icon, Home } from "lucide-react"; // Importing an icon from lucide-react
// import BG_IMG from "./assets/cityhall10-desktop.png";
import Buildings from './assets/buildings.png';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="relative bg-background h-screen w-screen flex overflow-hidden">
        <nav className="z-30 bg-[#0036C5] border-r-2 animate__animated animate__slideInLeft flex flex-col w-[340px] h-full py-5 border-b-[0px] border-accent text-white gap-5">
          <Link className="justify-center w-full flex items-center text-white" to="/react-vite-supreme">
            <img src={viteLogo} className="logo mt-4 h-20 object-contain" alt="Vite logo" />
          </Link>

          <div className="rounded-sm py-2 mr-5 px-2 flex items-center mt-24 ml-5 gap-2 bg-[#ECC217]">
            <Home className="text-white" />
            <h1 className="text-white font-bold text-lg">Dashboard</h1>
          </div>

          <div className="ml-5">
            <h1 className="text-white font-bold text-lg mb-4">Provinces</h1>
            <ul className="px-2 flex flex-col ">
              <li className="flex items-center space-x-2 mt-0 cursor-pointer hover:bg-[#1C1D20] p-2 rounded-sm">
                <Building2Icon className="text-white" />
                <Link to="/bukidnon" className="text-white">Bukidnon</Link>
              </li>
              <li className="flex items-center space-x-2 mt-0 cursor-pointer hover:bg-[#1C1D20] p-2 rounded-sm">
                <Building2Icon className="text-white" />
                <Link to="/camiguin" className="text-white">Camiguin</Link>
              </li>
              <li className="flex items-center space-x-2 mt-0 cursor-pointer hover:bg-[#1C1D20] p-2 rounded-sm">
                <Building2Icon className="text-white" />
                <Link to="/lanao-del-norte" className="text-white">Lanao del Norte</Link>
              </li>
              <li className="flex items-center space-x-2 mt-0 cursor-pointer hover:bg-[#1C1D20] p-2 rounded-sm">
                <Building2Icon className="text-white" />
                <Link to="/misamis-occidental" className="text-white">Misamis Occidental</Link>
              </li>
              <li className="flex items-center space-x-2 mt-0 cursor-pointer hover:bg-[#1C1D20] p-2 rounded-sm">
                <Building2Icon className="text-white" />
                <Link to="/misamis-oriental" className="text-white">Misamis Oriental</Link>
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