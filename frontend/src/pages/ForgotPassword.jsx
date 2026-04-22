import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE  = "service_jc1snng";
const EMAILJS_TEMPLATE = "e7h4mub";
const EMAILJS_KEY      = "PLmVSfeYnfj4hcrns";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/forgot-password", { email });
      const otp = res.data.otp;
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, { to_email: email, otp }, EMAILJS_KEY);
      localStorage.setItem("resetEmail", email);
      navigate("/verify-otp");
    } catch {
      localStorage.setItem("resetEmail", email);
      navigate("/verify-otp");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
        <p className="text-sm text-gray-500 text-center mt-1">Enter your registered email to reset password</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <input type="email"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Send OTP
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          <Link to="/login" className="text-indigo-600">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}