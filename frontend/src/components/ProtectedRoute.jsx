import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";

// Guards a route. Redirects to /login when logged out, and to home when the
// logged-in user's role isn't permitted.
//
// Usage: <ProtectedRoute allowedRoles={["patient"]}><MyPage/></ProtectedRoute>
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
