import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      const res = await fetch(`http://localhost:5000/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (!res.ok) {
        setError("Invalid or expired reset link");
        return;
      }

      setMsg("Password updated successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Unable to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Create a new password for your account
        </p>

        {msg && (
          <div className="bg-green-50 text-green-600 text-sm p-2 rounded mt-4">
            {msg}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-2 rounded mt-4">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="mt-6 space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Reset Password
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          <Link to="/login" className="text-indigo-600">
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}
