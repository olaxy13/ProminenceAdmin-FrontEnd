import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const ProtectedRoute = ({children}) => {
  const navigate = useNavigate()

// Checks if the user is authenticated by looking for a token cookie
function isAuthenticated() {
  return !!Cookies.get("token");
}

useEffect(()=>{
  if (!isAuthenticated()) {
    navigate('login');
    return
  }
},[])

// export function ProtectedRoute({ children }) {
//   if (!isAuthenticated()) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// }
  return (
    children
  )
}

export default ProtectedRoute
