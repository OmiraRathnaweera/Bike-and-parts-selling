import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import AdminUserManagement from "./admin/AdminUserManagement";
import AdminReport from "./admin/AdminReport";
import AdminTransactional from "./admin/AdminTransactional";
import AdminProfile from "./admin/AdminProfile";
import AdminLogin from "./admin/AdminLogin";
import AdminRegister from "./admin/AdminRegister";
import AdminBikeInventory from "./admin/AdminBikeInventory";

import ForgotPassword from "./Pages/ForgotPassword";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Reviews from "./Pages/Reviews";
import BikeInventory from "./Pages/BikeInventory";
import BikeSpecs from "./Pages/BikeSpecs";

import Offers from "./components/Offers";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import Chatbot from "./components/chatbot/Chatbot";

function Layout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {!isAdminPage && <Navigation />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bikes" element={<BikeInventory />} />
          <Route path="/bikes/:slug/specs" element={<BikeSpecs />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/report" element={<AdminReport />} />
          <Route path="/admin/transactions" element={<AdminTransactional />} />
          <Route
            path="/admin/AdminBikeInventory"
            element={<AdminBikeInventory />}
          />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>

      {!isAdminPage && <Footer />}
      <Chatbot />
    </div>
  );
}

export default Layout;
