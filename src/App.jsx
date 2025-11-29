import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import Topbar from "./components/Topbar";

export default function App() {
  const location = useLocation();

  // Check if current route is a protected route (where we want to disable scrolling)
  const isProtectedRoute = location.pathname === '/chat' || location.pathname === '/';

  return (
    <div className={isProtectedRoute ? "app-layout" : "auth-page"}>
      <Topbar />
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div className="container py-5 text-center">Page not found</div>} />
      </Routes>
    </div>
  );
}