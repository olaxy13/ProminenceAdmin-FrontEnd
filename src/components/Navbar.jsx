import { Link, useNavigate } from "react-router";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!Cookies.get("adminToken");
  const handleLogout = () => {
    Cookies.remove("adminToken");
    navigate("/login");
  };
  return (
    <nav className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
      <Link
        to="/"
        className="mr-4 font-semibold text-blue-700 hover:underline"
      >
        Home
      </Link>
      {/* <Link to="/about">About</Link> */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
