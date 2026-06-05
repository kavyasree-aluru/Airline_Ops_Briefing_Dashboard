import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { Dashboard } from "./pages/Dashboard";
import { About } from "./pages/About";
import Login from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute";

function DashboardLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
  }

  return (
    <>
      <nav className="nav">
        <b>AeroOps</b>

        <div>
          <Link to="/">Dashboard</Link>
          <Link to="/about">CO Mapping</Link>
          <button type="button" className="nav-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
