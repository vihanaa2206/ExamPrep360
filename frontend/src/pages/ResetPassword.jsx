import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      alert("Session expired. Please try again.");
      navigate("/login");
      return;
    }
    await API.post("/auth/reset-password", { email, password });
    localStorage.removeItem("resetEmail");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900">Reset Password</h2>
        <p className="text-sm text-center text-gray-500 mt-2">Create a strong new password</p>
        <div className="mt-6">
          <label className="text-sm font-medium">New Password</label>
          <input type="password"
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium">Confirm Password</label>
          <input type="password"
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <button onClick={handleReset}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold">
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
