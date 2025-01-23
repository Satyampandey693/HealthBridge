import { AppLayout } from "./components/layout/AppLayout";
import {Categories} from "./pages/Categories"
import {Doctors} from "./pages/Doctors"
import {createBrowserRouter} from "react-router-dom"
import { RouterProvider } from "react-router-dom";
import { Profile } from "./pages/Profile";
function App() {
  const router=createBrowserRouter([
    {
      path:"/",
      element:<AppLayout />,
      //errorElement:<ErrorPage />,
      children:[
        {
          path:"/",
          element:<Categories/>,
        },
        {
          path:"/doctors",
          element:<Doctors/>,
        },
        {
          path:"/profile",
          element:<Profile/>,
        },
      ]
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App
