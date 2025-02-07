import { AppLayout } from "./components/layout/AppLayout";
import {Categories} from "./pages/Categories"
import {Doctors} from "./pages/Doctors"
import {DoctorSignup} from "./pages/DoctorSignup"
import {createBrowserRouter} from "react-router-dom"
import { RouterProvider } from "react-router-dom";
import { DoctorLogin } from "./pages/DoctorLogin";
import {LoginUser} from "./pages/AuthentPage/LoginUser";
import {RegisterUser} from "./pages/AuthentPage/RegisterUser";
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
          path:"/doctor/signup",
          element:<DoctorSignup/>,
        },
        {
          path:"/doctor/login",
          element:<DoctorLogin/>,
        },
      ]
    },
    {
      path:"/userlogin",
      element:<LoginUser/>
    },
    {
      path:"/userRegister",
      element:<RegisterUser/>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App
