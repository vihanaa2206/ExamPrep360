import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE  = "service_jc1snng";
const EMAILJS_TEMPLATE = "e7h4mub";
const EMAILJS_KEY      = "PLmVSfeYnfj4hcrns";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [designation, setDesignation] = useState("");
  const [profession, setProfession] = useState("");
  const [studentType, setStudentType] = useState("");
  const [institute, setInstitute] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one digit";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd))
      return "Password must contain at least one special character";
    return null;
  };

  const sendOtp = async () => {
    if (!email) { setError("Enter email first"); return; }
    try {
      setError("");
      setOtpLoading(true);
      const res = await API.post("/auth/email/send-otp", { email });
      const generatedOtp = res.data.otp;
      await emailjs.send(
        EMAILJS_SERVICE, EMAILJS_TEMPLATE,
        { to_email: email, otp: generatedOtp },
        EMAILJS_KEY
      );
      setShowOtpBox(true);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (!otp) { setError("Enter OTP"); return; }
    try {
      setError("");
      await API.post("/auth/email/verify-otp", { email, otp });
      setEmailVerified(true);
      setShowOtpBox(false);
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim())        { setError("Name is required"); return; }
    if (!email.trim())       { setError("Email is required"); return; }
    if (!emailVerified)      { setError("Please verify email first"); return; }
    const pwdError = validatePassword(password);
    if (pwdError)            { setError(pwdError); return; }
    if (!confirmPassword)    { setError("Please confirm your password"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (!designation)        { setError("Select designation first"); return; }
    if ((designation === "student" || designation === "professor") && !institute.trim()) {
      setError("Please enter your School / College name"); return;
    }
    if (designation === "other" && !profession.trim()) {
      setError("Please enter your profession"); return;
    }
    try {
      setLoading(true);
      await API.post("/auth/register/complete", {
        name, email, password, designation, profession, studentType, institute, otp: "verified",
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return null;
    const error = validatePassword(password);
    if (!error) return { label: "Strong ✓", color: "text-green-600" };
    if (password.length >= 6) return { label: "Medium", color: "text-yellow-500" };
    return { label: "Weak", color: "text-red-500" };
  };

  const strength = getPasswordStrength();

  const EyeIcon = ({ show, toggle }) => (
    <button type="button" onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && (
          <p className="text-red-600 mt-3 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded">⚠ {error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Name *" className="w-full border px-3 py-2 rounded" />
          <div className="flex gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email *" className="w-full border px-3 py-2 rounded" disabled={emailVerified} />
            <button type="button" onClick={sendOtp} disabled={otpLoading || emailVerified}
              className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700">
              {emailVerified ? "✓ Verified" : otpLoading ? "Sending..." : "Verify"}
            </button>
          </div>
          {showOtpBox && !emailVerified && (
            <div className="flex gap-2">
              <input value={otp} onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP" className="w-full border px-3 py-2 rounded" />
              <button type="button" onClick={verifyEmailOtp}
                className="px-4 py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700">
                Confirm
              </button>
            </div>
          )}
          <div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password *" className="w-full border px-3 py-2 rounded pr-10" />
              <EyeIcon show={showPassword} toggle={() => setShowPassword(!showPassword)} />
            </div>
            {password && (
              <div className="mt-1">
                <p className={`text-xs font-medium ${strength?.color}`}>Strength: {strength?.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">Min 8 chars · uppercase · lowercase · digit · special char (!@#$%...)</p>
              </div>
            )}
          </div>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password *" className="w-full border px-3 py-2 rounded pr-10" />
            <EyeIcon show={showConfirmPassword} toggle={() => setShowConfirmPassword(!showConfirmPassword)} />
          </div>
          <select value={designation} onChange={(e) => setDesignation(e.target.value)}
            className={`w-full border px-3 py-2 rounded ${!designation ? "text-gray-400" : "text-gray-800"}`}>
            <option value="">Select Designation *</option>
            <option value="student">Student</option>
            <option value="professor">Professor</option>
            <option value="other">Other</option>
          </select>
          {designation === "other" && (
            <input value={profession} onChange={(e) => setProfession(e.target.value)}
              placeholder="Profession *" className="w-full border px-3 py-2 rounded" />
          )}
          {(designation === "student" || designation === "professor") && (
            <input value={institute} onChange={(e) => setInstitute(e.target.value)}
              placeholder="School / College Name *" className="w-full border px-3 py-2 rounded" />
          )}
          <button disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 disabled:opacity-60">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;