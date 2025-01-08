import React from "react";
import Signup from "./pages/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Signup />
    },
    {
      path: "/signin",
      element: <Signin />
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
