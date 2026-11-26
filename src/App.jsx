import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/lib/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Onboarding from "@/pages/Onboarding";
import Mfa from "@/pages/Mfa";
import AdminLogin from "@/pages/AdminLogin";
import AdminPage from "@/pages/AdminPage";
import PartnerPage from "@/pages/app/PartnerPage";
import PageNotFound from "@/lib/PageNotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/mfa" element={<Mfa />} />
          <Route path="/admin" element={<AdminLogin />} />

          <Route element={<ProtectedRoute unauthenticatedElement={<Login />} />}>
            <Route path="/" element={<Home />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/sdlsubr1250noida" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
