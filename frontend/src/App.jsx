import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedExams from "./components/FeaturedExams";
import TopColleges from "./components/TopColleges";
import NewsSection from "./components/NewsSection";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmailOtp from "./pages/VerifyEmailOtp";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import ExamDetails from "./pages/ExamDetails";
import CategoryExams from "./pages/CategoryExams"; // ✅ NEW

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminExams from "./admin/pages/AdminExams";
import AdminAddExam from "./admin/pages/AdminAddExam";
import AdminEditExam from "./admin/pages/AdminEditExam";
import AdminQueries from "./admin/pages/AdminQueries";
import ManageUsers from "./admin/pages/ManageUsers";

import FloatingAIChatbot from "./components/FloatingAIChatbot";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Categories />
              <FeaturedExams />
              <TopColleges />
              <NewsSection />
            </>
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email-otp" element={<VerifyEmailOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* EXAMS */}
        <Route path="/category/:category" element={<CategoryExams />} /> {/* ✅ NEW */}
        <Route path="/exam/:slug" element={<ExamDetails />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="exams" element={<AdminExams />} />
          <Route path="add-exam" element={<AdminAddExam />} />
          <Route path="/admin/edit-exam/:slug" element={<AdminEditExam />} />
          <Route path="queries" element={<AdminQueries />} />
          <Route path="pyqs" element={<div>PYQs Page</div>} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Routes>

      <FloatingAIChatbot />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
