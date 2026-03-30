import React from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { startInactivityWatcher } from "./utils/auth";

import Layout from "./Layout";
import ForgotPassword from "./Pages/ForgotPassword";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import BikeInventory from "./Pages/BikeInventory";
import BikeSpecs from "./Pages/BikeSpecs";
import Reviews from "./Pages/Reviews";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";

import AdminLogin from "./admin/AdminLogin";
import AdminRegister from "./admin/AdminRegister";
import AdminProfile from "./admin/AdminProfile";
import AdminUserManagement from "./admin/AdminUserManagement";
import AdminReport from "./admin/AdminReport";
import AdminTransactional from "./admin/AdminTransactional";
import AdminBikeInventory from "./admin/AdminBikeInventory";

const ADMIN_ROLES = ["OWNER", "ACCOUNTANT", "SALES_REP", "STAFF"];

function PrivateRoute({ children }) {
  const userId = sessionStorage.getItem("userId");
  return userId ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const userId    = sessionStorage.getItem("userId");
  const adminRole = sessionStorage.getItem("adminRole");
  if (!userId || !ADMIN_ROLES.includes(adminRole))
    return <Navigate to="/admin/login" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route element={<Layout />}>
          <Route path="/"                  element={<Home />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/register"          element={<Register />} />
          <Route path="/forgot-password"   element={<ForgotPassword />} />
          <Route path="/bikes"             element={<BikeInventory />} />
          <Route path="/bikes/:slug/specs" element={<BikeSpecs />} />
          <Route path="/reviews"           element={<Reviews />} />
          <Route path="/about"             element={<AboutUs />} />
          <Route path="/contact"           element={<ContactUs />} />
          <Route path="/privacy"           element={<Privacy />} />
          <Route path="/terms"             element={<Terms />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login"           element={<AdminLogin />} />
        <Route path="/admin/register"        element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/users"           element={<AdminRoute><AdminUserManagement /></AdminRoute>} />
        <Route path="/admin/report"          element={<AdminRoute><AdminReport /></AdminRoute>} />
        <Route path="/admin/transactions"    element={<AdminRoute><AdminTransactional /></AdminRoute>} />
        <Route path="/admin/bikes"           element={<AdminRoute><AdminBikeInventory /></AdminRoute>} />
        <Route path="/admin/profile"         element={<AdminRoute><AdminProfile /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  React.useEffect(() => {
    const cleanup = startInactivityWatcher(() => {
      sessionStorage.clear();
      alert("You have been logged out due to inactivity.");
      window.location.href = "/login";
    });
    return cleanup;
  }, []);

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;