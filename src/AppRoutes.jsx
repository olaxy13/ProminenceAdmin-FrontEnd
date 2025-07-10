import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ProtectedRoute from "./services/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import AddItem from "./pages/AddItem";

export default function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
            <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
