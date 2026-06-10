import { useNavigate } from "react-router-dom";

export default function AccountSuspended({ status = "blocked" }) {
  const navigate  = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isBlocked   = status === "blocked";
  const isSuspended = status === "suspended";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl
          ${isBlocked ? "bg-red-100" : "bg-orange-100"}`}>
          {isBlocked ? "🚫" : "⏸️"}
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-black mb-2 ${isBlocked ? "text-red-600" : "text-orange-600"}`}>
          {isBlocked ? "Account Blocked" : "Account Suspended"}
        </h1>

        {/* Message */}
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {isBlocked
            ? "Your account has been blocked by an administrator. You cannot access ExamPrep360 services at this time."
            : "Your account has been temporarily suspended. This may be due to a policy violation or pending review."
          }
        </p>

        {/* Info box */}
        <div className={`rounded-2xl p-4 mb-6 text-left border
          ${isBlocked ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"}`}>
          <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${isBlocked ? "text-red-500" : "text-orange-500"}`}>
            What you can do:
          </p>
          <ul className="text-sm text-slate-600 space-y-1.5">
            <li>• Contact our support team for assistance</li>
            <li>• Submit a query explaining your situation</li>
            {isSuspended && <li>• Wait for the suspension period to end</li>}
            <li>• Email us at <span className="font-semibold text-slate-800">support@examprep360.com</span></li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <a href="mailto:support@examprep360.com?subject=Account%20Appeal"
            className={`w-full py-3 rounded-xl font-semibold text-sm transition
              ${isBlocked
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-orange-500 text-white hover:bg-orange-600"
              }`}>
            📩 Contact Support
          </a>
          <button onClick={handleLogout}
            className="w-full py-3 rounded-xl font-semibold text-sm border border-slate-200 text-slate-600 hover:bg-slate-100 transition">
            ← Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}
