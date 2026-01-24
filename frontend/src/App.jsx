import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Header from "./components/Header";
import Categories from "./components/Categories";
import FeaturedExams from "./components/FeaturedExams";
import TopColleges from "./components/TopColleges";
import NewsSection from "./components/NewsSection";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ExamDetails from "./pages/ExamDetails";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Home Page */}
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

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/exam/:slug" element={<ExamDetails />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;