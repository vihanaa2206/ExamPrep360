import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const VerifyEmailOtp = () => {
  const navigate = useNavigate();
  const pending = JSON.parse(localStorage.getItem("pending_register"));

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  if (!pending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Registration data not found. Please register again.</p>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await API.post("/auth/register/complete", { ...pending, otp: Number(otp) });
      localStorage.removeItem("pending_register");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      setResendLoading(true);
      await API.post("/auth/register/resend-otp", { email: pending.email });
      alert("OTP resent to your email");
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900">Verify Email</h2>
        <p className="text-sm text-center text-gray-600 mt-2">
          OTP sent to <b>{pending.email}</b>
        </p>
        {error && (
          <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-2 rounded">{error}</div>
        )}
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Enter OTP</label>
            <input type="number" value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={handleResend} disabled={resendLoading}
            className="text-sm text-blue-600 hover:underline">
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailOtp;