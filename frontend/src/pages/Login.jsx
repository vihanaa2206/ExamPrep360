import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // 🔴 LOGIN FAILED
      if (!res.ok) {
        if (
          data.error &&
          data.error.toLowerCase().includes("not registered")
        ) {
          setInfo(data.error);

          // 🔥 auto redirect
          setTimeout(() => {
            navigate("/register");
          }, 1500);
        } else {
          setError(data.error || "Login failed");
        }
        return;
      }

      // 🟢 LOGIN SUCCESS
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch {
      setError("Server not responding");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center text-gray-900">
          Login to ExamPrep360
        </h2>

        {info && (
          <div className="mt-4 bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded">
            {info}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button className="w-full py-2 bg-blue-600 text-white rounded-lg">
            Login
          </button>
        </form>

        {/* ✅ ONLY THIS SECTION ADDED */}
        <p className="mt-3 text-right text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </p>

        <p className="mt-6 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
