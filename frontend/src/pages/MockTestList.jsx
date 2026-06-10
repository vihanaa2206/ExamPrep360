// src/pages/MockTestList.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock, BookOpen, ArrowLeft, Play,
  Lock, Unlock, ShoppingCart, CheckCircle,
  ChevronRight, Calendar,
} from "lucide-react";
import axios from "axios";

const API = "https://examprep360.onrender.com/api";

// ── Exam → Category mapping ───────────────────────────────────────────
const EXAM_CATEGORY_MAP = {
  "JEE Main": "Engineering",  "JEE Advanced": "Engineering",
  "BITSAT": "Engineering",    "VITEEE": "Engineering",
  "SRMJEEE": "Engineering",   "WBJEE": "Engineering",
  "NEET UG": "Medical",       "NEET PG": "Medical",
  "JIPMER": "Medical",        "AFMC": "Medical",
  "CAT": "Management",        "XAT": "Management",
  "CMAT": "Management",       "MAT": "Management",  "NMAT": "Management",
  "GATE CS": "Computer Science", "NIMCET": "Computer Science",
  "CUET PG": "Computer Science", "IIT JAM": "Computer Science",
  "TANCET": "Computer Science",
  "CLAT": "Law",  "AILET": "Law",  "DU LLB": "Law",  "AP LAWCET": "Law",
  "UPSC CSE": "Government", "SSC CGL": "Government",
  "IBPS PO": "Government",  "RRB NTPC": "Government",
};

// ── NEW: Category-based access check ─────────────────────────────────
// Checks user's purchased categories (not hardcoded exam lists)
function hasAccessToExam(user, examName) {
  if (!user?._id) return false;
  const purchases = user.purchases || [];
  const now = new Date();
  const examCategory = EXAM_CATEGORY_MAP[examName];

  for (const p of purchases) {
    if (p.status !== "paid") continue;
    if (p.expires_at && new Date(p.expires_at) < now) continue;

    // Premium = all categories
    if (p.plan === "premium") return true;

    // Check if user's chosen categories include this exam's category
    const chosenCats = p.categories || [];
    if (examCategory && chosenCats.includes(examCategory)) return true;
  }
  return false;
}

// ── Get active purchase for this exam ────────────────────────────────
function getActivePurchase(user, examName) {
  if (!user?.purchases) return null;
  const now = new Date();
  const examCategory = EXAM_CATEGORY_MAP[examName];

  return user.purchases.find(p => {
    if (p.status !== "paid") return false;
    if (p.expires_at && new Date(p.expires_at) < now) return false;
    if (p.plan === "premium") return true;
    return (p.categories || []).includes(examCategory);
  }) || null;
}

function daysLeft(expiresAt) {
  if (!expiresAt) return null;
  return Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
}

export default function MockTestList() {
  const { examName } = useParams();
  const navigate     = useNavigate();
  const decodedExam  = decodeURIComponent(examName);

  const [tests,   setTests]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Always read fresh from localStorage (updated after payment)
  const user      = JSON.parse(localStorage.getItem("user") || "{}");
  const isPaid    = hasAccessToExam(user, decodedExam);
  const purchase  = getActivePurchase(user, decodedExam);
  const dl        = purchase ? daysLeft(purchase.expires_at) : null;

  useEffect(() => {
    axios.get(`${API}/mock/tests/${encodeURIComponent(decodedExam)}`)
      .then(r => setTests(r.data))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, [decodedExam]);

  const isTestFree    = (testNo) => testNo === 1;
  const canAccessTest = (testNo) => isPaid || isTestFree(testNo);

  const handleStart = (testNo) => {
    if (canAccessTest(testNo)) {
      navigate(`/mock-test/${encodeURIComponent(decodedExam)}/${testNo}`);
    } else {
      navigate("/pricing");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate("/free-tests")}
            className="flex items-center gap-2 text-blue-200 hover:text-white mb-4 text-sm transition">
            <ArrowLeft className="w-4 h-4" /> Back to All Exams
          </button>
          <h1 className="text-3xl font-black mb-1">{decodedExam}</h1>
          <p className="text-blue-200 text-sm">
            {tests.length} test series available · {EXAM_CATEGORY_MAP[decodedExam] || "Exam"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Access banner */}
        {isPaid ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-6">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-green-800 dark:text-green-300">
                    Full Access Unlocked — {purchase?.plan_name || "Plan Active"}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                    All {tests.length} tests available for {decodedExam}
                  </p>
                </div>
              </div>
              {dl !== null && (
                <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-800/40 px-3 py-1.5 rounded-xl">
                  <Calendar className="w-3.5 h-3.5 text-green-600" />
                  <span className={`text-xs font-black ${dl <= 7 ? "text-orange-600" : "text-green-700"}`}>
                    {dl > 0 ? `${dl} days left` : "Expired"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">
                  🎁 Test 1 is FREE for everyone
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Purchase a plan covering <strong>{EXAM_CATEGORY_MAP[decodedExam]}</strong> category to unlock all {tests.length} tests.
                </p>
              </div>
              <button onClick={() => navigate("/pricing")}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition">
                <ShoppingCart className="w-3.5 h-3.5" /> Unlock All
              </button>
            </div>
          </div>
        )}

        {/* Test cards */}
        {tests.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tests available for this exam yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tests.map((t) => {
              const accessible = canAccessTest(t.test_no);
              const free       = isTestFree(t.test_no);

              return (
                <div key={t.test_no}
                  className={`bg-white dark:bg-slate-800 rounded-2xl border
                    ${accessible ? "border-gray-200 dark:border-slate-700 hover:shadow-md cursor-pointer" : "border-gray-200 dark:border-slate-700 opacity-90"}
                    p-5 shadow-sm transition-all`}
                  onClick={() => handleStart(t.test_no)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                        ${accessible ? "bg-blue-50 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-slate-700"}`}>
                        {accessible
                          ? <Unlock className="w-5 h-5 text-blue-600" />
                          : <Lock   className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-slate-100">Mock Test {t.test_no}</h3>
                          {free && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">FREE</span>
                          )}
                          {!accessible && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-500 text-xs font-semibold rounded-full">LOCKED</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{t.question_count} questions</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{Math.ceil((t.question_count * 90) / 60)} min</span>
                          {t.subjects?.length > 0 && (
                            <span className="hidden sm:block">{t.subjects.slice(0,2).join(", ")}{t.subjects.length > 2 && ` +${t.subjects.length - 2}`}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {accessible ? (
                        <button onClick={e => { e.stopPropagation(); handleStart(t.test_no); }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition">
                          <Play className="w-4 h-4" /> Start
                        </button>
                      ) : (
                        <button onClick={e => { e.stopPropagation(); navigate("/pricing"); }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-gray-200 transition">
                          <Lock className="w-3.5 h-3.5" /> Buy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!isPaid && tests.length > 1 && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-center text-white">
            <Lock className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <h3 className="text-lg font-black mb-1">{tests.length - 1} more tests locked</h3>
            <p className="text-blue-200 text-sm mb-4">
              Get full access to all {decodedExam} mock tests by choosing <strong>{EXAM_CATEGORY_MAP[decodedExam]}</strong> category
            </p>
            <button onClick={() => navigate("/pricing")}
              className="px-6 py-3 bg-white text-blue-700 rounded-xl font-black text-sm hover:bg-blue-50 transition flex items-center gap-2 mx-auto">
              <ShoppingCart className="w-4 h-4" /> View Plans & Pricing
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
