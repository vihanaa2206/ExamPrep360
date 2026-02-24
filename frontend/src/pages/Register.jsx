import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [showOtpBox, setShowOtpBox] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [designation, setDesignation] = useState("");
  const [profession, setProfession] = useState("");
  const [studentType, setStudentType] = useState("");
  const [institute, setInstitute] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      setError("Enter email first");
      return;
    }

    try {
      setError("");
      setOtpLoading(true);

      await axios.post("http://127.0.0.1:5000/auth/email/send-otp", { email });

      setShowOtpBox(true);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (!otp) {
      setError("Enter OTP");
      return;
    }

    try {
      setError("");

      await axios.post("http://127.0.0.1:5000/auth/email/verify-otp", {
        email,
        otp,
      });

      setEmailVerified(true);
      setShowOtpBox(false);
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailVerified) {
      setError("Please verify email first");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://127.0.0.1:5000/auth/register/complete", {
        name,
        email,
        password,
        designation,
        profession,
        studentType,
        institute,
        otp: "verified",
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {error && <p className="text-red-600 mt-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
              disabled={emailVerified}
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={otpLoading || emailVerified}
              className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              {emailVerified ? "Verified" : otpLoading ? "Sending..." : "Verify"}
            </button>
          </div>

          {showOtpBox && !emailVerified && (
            <div className="flex gap-2">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full border px-3 py-2 rounded"
              />
              <button
                type="button"
                onClick={verifyEmailOtp}
                className="px-4 py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full border px-3 py-2 rounded"
          />

          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Designation</option>
            <option value="student">Student</option>
            <option value="professor">Professor</option>
            <option value="other">Other</option>
          </select>

          {designation === "other" && (
            <input
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Profession"
              className="w-full border px-3 py-2 rounded"
            />
          )}

          {(designation === "student" || designation === "professor") && (
            <input
              value={institute}
              onChange={(e) => setInstitute(e.target.value)}
              placeholder="School / College Name"
              className="w-full border px-3 py-2 rounded"
            />
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800"
          >
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
