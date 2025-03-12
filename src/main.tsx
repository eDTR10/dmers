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

const Page2= lazy(() =>
  wait(1300).then(() => import("./screens/page2.tsx"))
);

const router = createBrowserRouter([
  {
    path: "/dmers/",
    element: <App />,
    
    children: [
      {
        path: "/dmers/", 
        element: <Navigate to="/dmers/page1" />, 
      },
      {
        path: "/dmers/page1",
        element: <>
        <Suspense fallback={<Loader />}>
          <Dashbaord/>
        </Suspense>
      </>,
      },
      {
        path: "/dmers/page2",
        element: <>
        <Suspense fallback={<Loader />}>
          <Page2 />
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
