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
import { DoctorChat } from "./pages/chat/DoctorChat";
import {UserChat} from "./pages/chat/Userchat"
import { DoctorSlotManager } from "./pages/DoctorSlotManager";
import { UserProfile } from "./pages/UserProfile";
import { DoctorProfile } from "./pages/doctorProfile";
import { LabTest } from "./pages/labTests";
import { Medicines } from "./pages/Medicines";

import {LabPage }from "./pages/Lab/LabPage";
import {LabCategories} from "./pages/Lab/LabCategories";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
          element:<ProtectedRoute allowedRoles={["patient","doctor"]}><ReportList/></ProtectedRoute>,
        },
        {
          path:"/upload",
          element:<ProtectedRoute allowedRoles={["patient","doctor"]}><UploadForm/></ProtectedRoute>,
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
          element:<ProtectedRoute allowedRoles={["doctor"]}><MyPatients/></ProtectedRoute>
        },
        {
          path:"/admin",
          element:<ProtectedRoute allowedRoles={["admin"]}><AdminPanel/></ProtectedRoute>
        },
        {
          path:"/logout",
          element:<Logout/>
        },
        {
          path:"/slots",
          element:<ProtectedRoute allowedRoles={["doctor"]}><DoctorSlotManager/></ProtectedRoute>
        }
        ,
        {
          path:"/Lab",
          element:<LabCategories/>
        },
        {
          path:"/Labs/list",
          element:<LabPage/>
        },
        {
          path:"/user/profile",
          element:<ProtectedRoute allowedRoles={["patient"]}><UserProfile/></ProtectedRoute>
        },
        {
          path:"/doctor/profile",
          element:<ProtectedRoute allowedRoles={["doctor"]}><DoctorProfile/></ProtectedRoute>
        },
         {
          path:"/lab-tests",
          element:<LabTest/>
        },
         {
          path:"/medicines",
          element:<Medicines/>
        },
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
