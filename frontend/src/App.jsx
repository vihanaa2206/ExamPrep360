import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedExams from "./components/FeaturedExams";
import TopColleges from "./components/TopColleges";
import NewsSection from "./components/NewsSection";
import BrowseMenu from "./components/BrowseMenu";
import StreamPage from "./pages/StreamPage";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmailOtp from "./pages/VerifyEmailOtp";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import ExamDetails from "./pages/ExamDetails";
import CategoryExams from "./pages/CategoryExams";
import AllColleges from "./pages/AllColleges";
import AllNotifications from "./pages/AllNotifications";
import FloatingAIChatbot from "./components/FloatingAIChatbot";
import CollegeDetails from "./pages/CollegeDetails";
import MockTestSelection from "./pages/MockTestSelection";
import MockTestList from "./pages/MockTestList";
import MockTestExam from "./pages/MockTestExam";
import MockDashboard from "./pages/MockDashboard";
import UserProfile from "./pages/UserProfile";
import AccountSuspended from "./pages/AccountSuspended";
import AllExamsPage from "./pages/AllExamsPage";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminExams from "./admin/pages/AdminExams";
import AdminAddExam from "./admin/pages/AdminAddExam";
import AdminEditExam from "./admin/pages/AdminEditExam";
import AdminQueries from "./admin/pages/AdminQueries";
import ManageUsers from "./admin/pages/ManageUsers";
import AdminCoachings from "./admin/pages/AdminCoachings";
import AdminColleges from "./admin/pages/AdminColleges";
import AdminMockTests from "./admin/pages/AdminMockTests";
import AdminPYQs from "./admin/pages/AdminPYQs";
import AdminReports from "./admin/pages/AdminReports";
import PreviousYearPapers from "./pages/PreviousYearPapers";
import PYPSelection from "./pages/PYPSelection";
import ExamCalendar from "./pages/ExamCalendar";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import Advertise from "./pages/Advertise";
import AdminProfile from "./admin/pages/AdminProfile";
import PricingPage from "./pages/PricingPage";
import AdminPayments from "./admin/pages/AdminPayments";
import AdminFeedbacks from "./admin/pages/AdminFeedbacks";
import AdminAIChatLogs from "./admin/pages/AdminAIChatLogs";
import AdminAITraining from "./admin/pages/AdminAITraining";


function ProfileRoute() {
  const stored = localStorage.getItem("user");
  try {
    const user = stored ? JSON.parse(stored) : {};
    if (user.role === "admin") {
      return <Navigate to="/admin/profile" replace />;
    }
  } catch {
    // invalid JSON in localStorage — just show UserProfile
  }
  return <UserProfile />;
}

function App() {
  useEffect(() => {
    const sendHeartbeat = () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      axios.post(
        "https://examprep360.onrender.com/api/users/heartbeat",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => {});
    };
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>

        {/* HOME */}
        <Route path="/" element={
          <>
            <Hero />
            <Categories />
            <FeaturedExams />
            <TopColleges />
            <NewsSection />
          </>
        } />

        {/* AUTH */}
        <Route path="/browse"             element={<BrowseMenu />} />
        <Route path="/stream/:streamName" element={<StreamPage />} />
        <Route path="/search"             element={<SearchResults />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/verify-email-otp"   element={<VerifyEmailOtp />} />
        <Route path="/forgot-password"    element={<ForgotPassword />} />
        <Route path="/verify-otp"         element={<VerifyOtp />} />
        <Route path="/reset-password"     element={<ResetPassword />} />
        <Route path="/pricing"            element={<PricingPage />} />

        {/* Profile — admin gets redirected to /admin/profile */}
        <Route path="/profile" element={<ProfileRoute />} />

        {/* EXAMS */}
        <Route path="/category/:category" element={<CategoryExams />} />
        <Route path="/exam/:slug"         element={<ExamDetails />} />
        <Route path="/exams"              element={<AllExamsPage />} />

        {/* COLLEGES */}
        <Route path="/colleges"      element={<AllColleges />} />
        <Route path="/college/:slug" element={<CollegeDetails />} />

        {/* NOTIFICATIONS */}
        <Route path="/notifications"             element={<AllNotifications />} />
        <Route path="/resources/exam-calendar"   element={<ExamCalendar />} />
        <Route path="/resources/previous-papers" element={<PreviousYearPapers />} />

        {/* PYP */}
        <Route path="/previous-year-papers" element={<PreviousYearPapers />} />
        <Route path="/pyp-list/:examName"   element={<PYPSelection />} />

        {/* MOCK TESTS */}
        <Route path="/free-tests"                  element={<MockTestSelection />} />
        <Route path="/mock-test/:examName"         element={<MockTestList />} />
        <Route path="/mock-test/:examName/:testNo" element={<MockTestExam />} />
        <Route path="/mock-dashboard"              element={<MockDashboard />} />

        {/* QUICK LINKS */}
        <Route path="/about"          element={<AboutUs />} />
        <Route path="/contact"        element={<ContactUs />} />
        <Route path="/careers"        element={<Careers />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use"   element={<TermsOfUse />} />
        <Route path="/advertise"      element={<Advertise />} />

        {/* ACCOUNT STATUS */}
        <Route path="/account-blocked"   element={<AccountSuspended status="blocked" />} />
        <Route path="/account-suspended" element={<AccountSuspended status="suspended" />} />

        {/* ADMIN — all children use RELATIVE paths inside /admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard"       element={<AdminDashboard />} />
          <Route path="profile"         element={<AdminProfile />} />
          <Route path="exams"           element={<AdminExams />} />
          <Route path="add-exam"        element={<AdminAddExam />} />
          <Route path="edit-exam/:slug" element={<AdminEditExam />} />
          <Route path="queries"         element={<AdminQueries />} />
          <Route path="users"           element={<ManageUsers />} />
          <Route path="coachings"       element={<AdminCoachings />} />
          <Route path="colleges"        element={<AdminColleges />} />
          <Route path="mock-tests"      element={<AdminMockTests />} />
          <Route path="pyqs"            element={<AdminPYQs />} />
          <Route path="reports"         element={<AdminReports />} />
          <Route path="pyq"             element={<Navigate to="/admin/pyqs" replace />} />
          {/* FIX: was absolute path "/admin/payments" → now relative "payments" */}
          <Route path="payments"        element={<AdminPayments />} />
          <Route path="feedbacks"       element={<AdminFeedbacks />} />
          <Route path="ai-chat-logs"    element={<AdminAIChatLogs />} />
          <Route path="ai-training"   element={<AdminAITraining />} /> 
        </Route>

      </Routes>
      <FloatingAIChatbot />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
