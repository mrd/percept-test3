import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Eval, Index, evalLoader, globalInfo } from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

const CustomRouterProvider = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />
    },
    {
      path: "eval",
      element: <Eval />,
      loader: async () => { return await evalLoader(globalInfo) }
    }
  ]);
  return <RouterProvider router={router} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomRouterProvider />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
