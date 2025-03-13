import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';

const Dashbaord= lazy(() =>
  wait(1300).then(() => import("./screens/dashsboard.tsx"))
);

// const Page2= lazy(() =>
//   wait(1300).then(() => import("./screens/page2.tsx"))
// );


const MisamisOriental= lazy(() =>
  wait(1300).then(() => import("./screens/misor/MisamisOriental.tsx"))
);
const Camiguin= lazy(() =>
  wait(1300).then(() => import("./screens/camiguin/Camiguin.tsx"))
);

const router = createBrowserRouter([
  {
    path: "/dmers/",
    element: <App />,
    
    children: [
      {
        path: "/dmers/", 
        element: <Navigate to="/dmers/dashboard" />, 
      },
      {
        path: "/dmers/dashboard",
        element: <>
        <Suspense fallback={<Loader />}>
          <Dashbaord/>
        </Suspense>
      </>,
      },
      {
        path: "/dmers/misamis-oriental",
        element: <>
        <Suspense fallback={<Loader />}>
          <MisamisOriental />
        </Suspense>
      </>,
      },
      {
        path: "/dmers/camiguin",
        element: <>
        <Suspense fallback={<Loader />}>
          <Camiguin />
        </Suspense>
      </>,
      },



      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function wait( time:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
