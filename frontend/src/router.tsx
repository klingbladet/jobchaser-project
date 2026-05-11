import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Jobs from "./pages/Jobs";
import Signin from "./pages/Signin";
import { NotFound } from "./pages/NotFound";
import Signup from "./pages/Signup";
import SavedJobs from "./pages/SavedJobs";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Importera ProtectedRoute

// 1. Define your routes
const router = createBrowserRouter([
  {
    path:"/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Jobs />
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      // Skyddade rutter
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/savedjobs",
            element: <SavedJobs />
          },
        ]
      },
    ]
  },
  {
    path: "/notfound",
    element: <NotFound />
  },
]);

// 2. Provide the router to your app
export default function Router() {
  return <RouterProvider router={router} />;
}