import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) inputRefs.current[index + 1].focus();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    const email = localStorage.getItem("resetEmail");
    if (!email) { setError("Session expired. Please try again."); return; }
    if (enteredOtp.length !== 4) { setError("Please enter complete OTP"); return; }
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email, otp: enteredOtp });
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP");
      setOtp(["", "", "", ""]);
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    const email = localStorage.getItem("resetEmail");
    if (!email) { alert("Session expired."); return; }
    try {
      await API.post("/auth/resend-forgot-otp", { email });
      alert("OTP resent successfully");
      setTimer(60);
      setCanResend(false);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
          return prev - 1;
        });
      }, 1000);
      setOtp(["", "", "", ""]);
      inputRefs.current[0].focus();
    } catch {
      alert("Unable to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">OTP Verification</h2>
        <p className="text-sm text-gray-500 mt-2">Enter the OTP sent to your email</p>
        <div className="flex justify-center gap-4 mt-6">
          {otp.map((digit, i) => (
            <input key={i} ref={(el) => (inputRefs.current[i] = el)}
              type="text" maxLength="1" value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <p className="text-sm text-gray-500 mt-4">
          {canResend ? (
            <button onClick={handleResend} className="text-indigo-600 font-medium">Resend OTP</button>
          ) : (
            <span>Resend in {timer}s</span>
          )}
        </p>
        <button onClick={handleVerify} disabled={loading}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50">
          {loading ? "Verifying..." : "Verify"}
        </button>
        <button onClick={() => navigate("/login")}
          className="w-full mt-3 border border-gray-300 py-3 rounded-xl font-medium">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;