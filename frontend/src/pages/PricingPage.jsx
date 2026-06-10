// src/pages/PricingPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, Lock, Zap, Star, Shield,
  Clock, Trophy, ChevronRight, X, BookOpen,
  FlaskConical, Scale, Landmark, Cpu, Briefcase
} from "lucide-react";
import axios from "axios";

const API = "https://examprep360.onrender.com/api";

const ALL_CATEGORIES = [
  { key: "Law",            label: "Law",            icon: Scale,       color: "from-amber-400 to-orange-500",  bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  exams: "CLAT, AILET, DU LLB, AP LAWCET" },
  { key: "Government",     label: "Government",     icon: Landmark,    color: "from-red-400 to-rose-500",      bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    exams: "UPSC CSE, SSC CGL, IBPS PO, RRB NTPC" },
  { key: "Engineering",    label: "Engineering",    icon: Cpu,         color: "from-blue-400 to-indigo-500",   bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   exams: "JEE Main, JEE Advanced, BITSAT, VITEEE" },
  { key: "Medical",        label: "Medical",        icon: FlaskConical,color: "from-green-400 to-emerald-500", bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  exams: "NEET UG, NEET PG, JIPMER, AFMC" },
  { key: "Management",     label: "Management",     icon: Briefcase,   color: "from-purple-400 to-violet-500", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", exams: "CAT, CMAT, MAT, XAT" },
  { key: "Computer Science",label:"Computer Science",icon: BookOpen,   color: "from-cyan-400 to-teal-500",     bg: "bg-cyan-50",   border: "border-cyan-200",   text: "text-cyan-700",   exams: "GATE CS, NIMCET, CUET PG, IIT JAM" },
];

// ── Test mode info ────────────────────────────────────────────────────────
function TestModeInfo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-sm font-bold text-amber-800">
            🧪 Test Mode Active — No real money charged
          </span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-xs text-amber-700 underline">
          {open ? "Hide" : "Show test cards"}
        </button>
      </div>
      {open && (
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-amber-900">
          <div className="bg-amber-100 rounded-lg p-3">
            <p className="font-bold mb-1">✅ Success Card</p>
            <p>Card: <code className="bg-white px-1 rounded">4111 1111 1111 1111</code></p>
            <p>Expiry: Any future date | CVV: Any 3 digits</p>
          </div>
          <div className="bg-amber-100 rounded-lg p-3">
            <p className="font-bold mb-1">✅ UPI Test</p>
            <p>UPI ID: <code className="bg-white px-1 rounded">success@razorpay</code></p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Category Selection Modal ──────────────────────────────────────────────
function CategoryModal({ plan, onConfirm, onClose }) {
  const [selected, setSelected] = useState([]);
  const max = plan.max_categories;
  const isPremium = plan.key === "premium";

  const toggle = (key) => {
    if (isPremium) return;
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : prev.length < max ? [...prev, key] : prev
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Modal header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black mb-1">Choose Your Categories</h2>
          <p className="text-blue-200 text-sm">
            {isPremium
              ? "Premium includes ALL 6 categories 🎉"
              : `Select exactly ${max} categories for your ${plan.name}`}
          </p>
          {!isPremium && (
            <div className="mt-3 bg-white/20 rounded-xl px-3 py-1.5 inline-flex items-center gap-2">
              <span className="text-sm font-bold">{selected.length}/{max} selected</span>
              <div className="flex gap-1">
                {Array.from({ length: max }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < selected.length ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category grid */}
        <div className="p-6 grid grid-cols-2 gap-3">
          {ALL_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = isPremium || selected.includes(cat.key);
            const isDisabled = !isPremium && !isSelected && selected.length >= max;
            return (
              <button
                key={cat.key}
                onClick={() => toggle(cat.key)}
                disabled={isDisabled}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all
                  ${isSelected
                    ? `${cat.border} ${cat.bg} shadow-md scale-[1.02]`
                    : isDisabled
                    ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"}`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className={`w-4 h-4 ${cat.text}`} />
                  </div>
                )}
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className={`text-sm font-black ${isSelected ? cat.text : "text-gray-900"}`}>{cat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{cat.exams}</p>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={() => onConfirm(isPremium ? ALL_CATEGORIES.map(c => c.key) : selected)}
            disabled={!isPremium && selected.length !== max}
            className={`w-full py-3.5 rounded-2xl font-black text-white text-sm transition
              ${(!isPremium && selected.length !== max)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-200"}`}
          >
            {isPremium ? "Proceed to Payment →" : selected.length === max ? `Confirm & Pay ₹${plan.amount_inr} →` : `Select ${max - selected.length} more categor${max - selected.length === 1 ? "y" : "ies"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────────────
function PlanCard({ plan, onBuy, loading, isPopular }) {
  const perks = {
    basic:    ["Any 2 categories of your choice", "All test series for chosen category exams", `Valid for ${plan.duration_days} days`, "Detailed answer review", "Performance dashboard"],
    standard: ["Any 4 categories of your choice", "Everything in Basic", "All test series for chosen category exams", `Valid for ${plan.duration_days} days`, "Performance analytics"],
    premium:  ["All 6 categories — every exam", "Engineering, Medical, Law, Govt", "Management & Computer Science", "Unlimited mock tests", `Valid for ${plan.duration_days} days (1 year)`, "Priority support"],
  };

  const styles = {
    basic:    { wrap: "border-blue-200",   btn: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",     badge: "bg-blue-100 text-blue-700",     ring: "" },
    standard: { wrap: "border-purple-300", btn: "bg-purple-600 hover:bg-purple-700 shadow-purple-200", badge: "bg-purple-100 text-purple-700", ring: "ring-4 ring-purple-100 scale-105" },
    premium:  { wrap: "border-yellow-300", btn: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-yellow-200", badge: "bg-yellow-100 text-yellow-700", ring: "" },
  };

  const s = styles[plan.key] || styles.basic;

  return (
    <div className={`relative bg-white rounded-2xl border-2 ${s.wrap} p-6 shadow-sm ${s.ring} transition-all duration-300`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className={`${s.badge} px-4 py-1 rounded-full text-xs font-black flex items-center gap-1`}>
            <Star className="w-3 h-3 fill-current" /> Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-5">
        <h2 className="text-xl font-black text-gray-900 mb-1">{plan.name}</h2>
        <p className="text-xs text-gray-500 mb-3">{plan.description}</p>
        <div className="flex items-end justify-center gap-1">
          <span className="text-4xl font-black text-gray-900">₹{plan.amount_inr}</span>
          <span className="text-gray-400 text-sm mb-1">/ {plan.duration_days} days</span>
        </div>
      </div>
      <ul className="space-y-2 mb-6">
        {(perks[plan.key] || []).map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onBuy(plan)}
        disabled={loading === plan.key}
        className={`w-full py-3 ${s.btn} text-white rounded-xl font-black text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60`}
      >
        {loading === plan.key ? (
          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
        ) : (
          <><Zap className="w-4 h-4" /> Buy {plan.name}</>
        )}
      </button>
    </div>
  );
}

// ── Main PricingPage ──────────────────────────────────────────────────────
export default function PricingPage() {
  const [plans,       setPlans]       = useState([]);
  const [loading,     setLoading]     = useState(null);
  const [error,       setError]       = useState("");
  const [modalPlan,   setModalPlan]   = useState(null);
  const navigate = useNavigate();

  const user  = JSON.parse(localStorage.getItem("user")  || "{}");
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    axios.get(`${API}/payment/plans`).then(r => setPlans(r.data)).catch(() => setError("Failed to load plans. Please refresh."));
    if (!document.getElementById("razorpay-script")) {
      const s = document.createElement("script");
      s.id = "razorpay-script";
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  // Step 1: open category modal
  const handleBuy = (plan) => {
    if (!user._id) { navigate("/login"); return; }
    setModalPlan(plan);
  };

  // Step 2: after category selection, create order
  const handleCategoryConfirm = async (categories) => {
    const plan = modalPlan;
    setModalPlan(null);
    setLoading(plan.key);
    setError("");

    try {
      const { data: orderData } = await axios.post(
        `${API}/payment/order`,
        { user_id: user._id, plan: plan.key, categories },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key:         orderData.key_id,
        amount:      orderData.amount,
        currency:    orderData.currency,
        name:        "ExamPrep 360",
        description: orderData.plan_name,
        order_id:    orderData.order_id,

        handler: async (response) => {
          try {
            const { data: verifyData } = await axios.post(
              `${API}/payment/verify`,
              {
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                user_id:             user._id,
                plan:                plan.key,
                categories,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (verifyData.success) {
              const updatedUser = { ...user, purchases: verifyData.purchases };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              navigate("/free-tests", { state: { paymentSuccess: true, plan: plan.key } });
            }
          } catch {
            setError("Payment verification failed. Contact support.");
          } finally {
            setLoading(null);
          }
        },

        prefill:  { name: orderData.user_name || user.name || "", email: orderData.user_email || user.email || "" },
        theme:    { color: "#2563eb" },
        modal:    { ondismiss: () => setLoading(null) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => { setError("Payment failed. Please try again."); setLoading(null); });
      rzp.open();
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong. Try again.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* Category Modal */}
      {modalPlan && (
        <CategoryModal
          plan={modalPlan}
          onConfirm={handleCategoryConfirm}
          onClose={() => setModalPlan(null)}
        />
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
          <Lock className="w-4 h-4" /> Unlock Full Mock Test Access
        </div>
        <h1 className="text-4xl font-black mb-3">Choose Your Plan</h1>
        <p className="text-blue-200 max-w-xl mx-auto text-sm">
          One-time purchase. No subscription. Pick the exam categories you need
          and track your performance with detailed analytics.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <TestModeInfo />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 max-w-2xl mx-auto text-sm">
            <X className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {plans.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {plans.map(plan => (
              <PlanCard key={plan.key} plan={plan} onBuy={handleBuy} loading={loading} isPopular={plan.key === "standard"} />
            ))}
          </div>
        )}

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Shield className="w-5 h-5 text-green-600" />, text: "100% Secure Payment", sub: "Powered by Razorpay" },
            { icon: <Clock  className="w-5 h-5 text-blue-600" />,  text: "Instant Access",      sub: "After payment confirmation" },
            { icon: <Trophy className="w-5 h-5 text-yellow-600" />,text: "Performance Dashboard",sub: "Track your progress" },
          ].map(b => (
            <div key={b.text} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-4 text-center shadow-sm">
              <div className="flex justify-center mb-2">{b.icon}</div>
              <p className="text-xs font-bold text-gray-900 dark:text-slate-100">{b.text}</p>
              <p className="text-xs text-gray-400 mt-0.5">{b.sub}</p>
            </div>
          ))}
        </div>

        {user._id && (
          <div className="text-center">
            <button onClick={() => navigate("/profile")} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mx-auto">
              View my purchases in Profile <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
