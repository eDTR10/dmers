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

const About = lazy(() =>
  wait(1300).then(() => import("./screens/misor/about.tsx"))
);
const About2 = lazy(() =>
  wait(1300).then(() => import("./screens/camiguin/about.tsx"))
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    
    children: [
      {
        path: "/", 
        element: <Navigate to="/dashboard" />, 
      },
      {
        path: "/dashboard",
        element: <>
        <Suspense fallback={<Loader />}>
          <Dashbaord/>
        </Suspense>
      </>,
      },
      {
        path: "/misamis-oriental",
        element: <>
        <Suspense fallback={<Loader />}>
          <MisamisOriental />
        </Suspense>
      </>,
      },
      {
        path: "/misamis-oriental/:lguName",
        element: <>
        <Suspense fallback={<Loader />}>
          <About/>
        </Suspense>
      </>,
      },
      {
        path: "/camiguin/:lguName",
        element: <>
        <Suspense fallback={<Loader />}>
          <About2/>
        </Suspense>
      </>,
      },
      {
        path: "/camiguin",
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
