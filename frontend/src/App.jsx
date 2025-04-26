import { AppLayout } from "./components/layout/AppLayout";
import {Categories} from "./pages/Categories"
import {Doctors} from "./pages/Doctors"
import {DoctorSignup} from "./pages/DoctorSignup"
import {createBrowserRouter} from "react-router-dom"
import { RouterProvider } from "react-router-dom";
import { DoctorLogin } from "./pages/DoctorLogin";
import {LoginUser} from "./pages/AuthentPage/LoginUser";
import {RegisterUser} from "./pages/AuthentPage/RegisterUser";
import { UploadForm } from "./pages/uploadForm";
import { ReportList } from "./pages/ReportList";
import { MyPatients } from "./pages/MyPatients";
import { PaymentSuccess } from "./pages/Payment/paymentSuccess";
import AdminPanel from "./pages/Admin/AdminPanel";
import { Logout } from "./pages/Logout";
import { Home } from "./pages/Home";
import { LoginChoice } from "./pages/LoginChoice";
import { SignupChoice } from "./pages/SignupChoice";
import { DoctorChat } from "./pages/chat/doctorChat";
import {UserChat} from "./pages/chat/Userchat"
import { DoctorSlotManager } from "./pages/DoctorSlotManager";
function App() {
  const router=createBrowserRouter([
    {
      path:"/",
      element:<AppLayout />,
      //errorElement:<ErrorPage />,
      children:[
        {
          path:"/",
          element:<Home/>,
        },
        {
          path:"/login",
          element:<LoginChoice/>,
        },
        {
          path:"/signup",
          element:<SignupChoice/>,
        },
        {
          path:"/doctors",
          element:<Categories/>,
        },
        {
          path:"/doctors/list",
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
        {
          path:"/reports",
          element:<ReportList/>,
        },
        {
          path:"/upload",
          element:<UploadForm/>,
        },
        {
          path:"/userlogin",
          element:<LoginUser/>
        },
        {
          path:"/userRegister",
          element:<RegisterUser/>
        },
        {
          path:"/patients",
          element:<MyPatients/>
        },
        {
          path:"/admin",
          element:<AdminPanel/>
        },
        {
          path:"/logout",
          element:<Logout/>
        },
        {
          path:"/slots",
          element:<DoctorSlotManager/>
        }
      ]
    },
    {
      path:"/DoctorChat",
      element:<DoctorChat/>
    },
    // {
    //   path:"/UserChat",
    //   element:<UserChat />
    // },
  ]);

  return <RouterProvider router={router} />;
}

export default App
