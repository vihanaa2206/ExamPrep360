import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        setError("Email not registered");
        return;
      }

      setMsg("Password reset link sent to your email.");
    } catch {
      setError("Unable to connect to server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Enter your registered email to reset password
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Send Reset Link
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
