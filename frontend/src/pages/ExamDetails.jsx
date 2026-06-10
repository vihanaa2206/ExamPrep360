import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CoachingComparison from "../components/CoachingComparison";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "application", label: "Application" },
  { key: "eligibility", label: "Eligibility" },
  { key: "pattern", label: "Exam Pattern" },
  { key: "syllabus", label: "Syllabus" },
  { key: "preparation", label: "Preparation Tips" },
  { key: "pyqs", label: "PYQs" },
  { key: "mock_tests", label: "Mock Tests" },
  { key: "coaching", label: "Coaching Comparison" }
];

/* ================= Overview ================= */
// Splits "Key: Value Key2: Value2" inline text into [{key, value}] chunks
const parseInlineKeyValues = (text) => {
  // Match patterns like "Word Word: some value" repeatedly
  const regex = /([A-Z][A-Za-z\s\/()&-]{1,40}?):\s*([^:]+?)(?=\s{2,}[A-Z]|[A-Z][A-Za-z\s\/()&-]{1,40}?:|$)/g;
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const key = match[1].trim();
    const val = match[2].trim().replace(/\.\s*$/, "");
    if (key && val) results.push({ key, val });
  }
  return results;
};

const OverviewTab = ({ content }) => {
  if (!content) return <p className="text-gray-500">No overview available.</p>;

  // Step 1: inject newline before explicit bullet chars
  const normalized = content.replace(/([^•\n])(•)/g, "$1\n•");
  const rawLines = normalized.split("\n").filter((l) => l.trim() !== "");

  // Step 2: detect if content has explicit bullets at all
  const hasBullets = rawLines.some((l) => l.trim().startsWith("•") || l.trim().startsWith("-"));

  // ── FORMAT A: explicit bullets (NEET UG style) ──────────────────────────
  if (hasBullets) {
    const blocks = [];
    let paraBuffer = [];
    rawLines.forEach((line) => {
      const t = line.trim();
      if (t.startsWith("•") || t.startsWith("-")) {
        if (paraBuffer.length) { blocks.push({ type: "para", text: paraBuffer.join(" ") }); paraBuffer = []; }
        blocks.push({ type: "bullet", text: t.replace(/^[•\-]\s*/, "") });
      } else { paraBuffer.push(t); }
    });
    if (paraBuffer.length) blocks.push({ type: "para", text: paraBuffer.join(" ") });

    const groups = [];
    let bulletBuf = [];
    blocks.forEach((b) => {
      if (b.type === "bullet") { bulletBuf.push(b.text); }
      else {
        if (bulletBuf.length) { groups.push({ type: "bullets", items: [...bulletBuf] }); bulletBuf = []; }
        groups.push({ type: "para", text: b.text });
      }
    });
    if (bulletBuf.length) groups.push({ type: "bullets", items: bulletBuf });

    return (
      <div className="space-y-4">
        {groups.map((g, i) => {
          if (g.type === "bullets") {
            return (
              <ul key={i} className="space-y-2">
                {g.items.map((item, j) => {
                  const ci = item.indexOf(":");
                  if (ci !== -1 && ci < 40) {
                    return (
                      <li key={j} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                        <span>
                          <span className="font-semibold text-gray-900">{item.substring(0, ci)}:</span>{" "}
                          {item.substring(ci + 1).trim()}
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li key={j} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>
            );
          }
          return <p key={i} className="text-gray-700 leading-relaxed">{g.text}</p>;
        })}
      </div>
    );
  }

  // ── FORMAT B: plain text blob with inline "Key: Value" (JIPMER style) ──
  // Split on sentence boundaries OR on "Key:" patterns
  // Strategy: split the blob by detecting "CapitalWord(s):" as new bullet start
  const splitPattern = /(?<=\.\s)(?=[A-Z][A-Za-z\s\/()&-]{1,40}?:)|(?<=[^:]\.\s{0,2})(?=[A-Z])/g;
  
  // Simpler & more reliable: split on ". " then detect if chunk starts with "Key:"
  const sentences = content
    .replace(/\s{2,}/g, " ")
    .split(/(?<=\.)\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  // Group sentences: intro paras vs key:value bullets
  const introParas = [];
  const bulletItems = [];

  sentences.forEach((s) => {
    // If sentence starts with "Word(s): " pattern (label: value)
    const colonMatch = s.match(/^([A-Z][A-Za-z\s\/()&-]{1,35}?):\s+(.+)/);
    if (colonMatch && colonMatch[1].split(" ").length <= 4) {
      bulletItems.push({ key: colonMatch[1].trim(), val: colonMatch[2].trim() });
    } else {
      // Check if it's a plain sentence (no key: pattern)
      introParas.push(s);
    }
  });

  // If no bullets extracted, just render as paragraphs
  if (bulletItems.length === 0) {
    return (
      <div className="space-y-3">
        {introParas.map((p, i) => (
          <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {introParas.length > 0 && (
        <p className="text-gray-700 leading-relaxed">{introParas.join(" ")}</p>
      )}
      <ul className="space-y-2">
        {bulletItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-700">
            <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
            <span>
              <span className="font-semibold text-gray-900">{item.key}:</span>{" "}
              {item.val}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ================= Application ================= */
const ApplicationTab = ({ content }) => {
  if (!content) return <p className="text-gray-500">Application details not available.</p>;

  const lines = content.split("\n").filter((l) => l.trim() !== "");
  const steps = [];
  const extras = [];

  lines.forEach((line) => {
    const t = line.trim();
    const m = t.match(/^(\d+)\.\s+(.*)/);
    if (m) {
      steps.push({ number: m[1], text: m[2] });
    } else {
      extras.push(t.replace(/^[•\-]\s*/, ""));
    }
  });

  return (
    <div className="space-y-6">
      {extras.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-1">
          {extras.map((line, i) => {
            const ci = line.indexOf(":");
            if (ci !== -1) {
              return (
                <p key={i} className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">{line.substring(0, ci)}:</span>{" "}
                  {line.substring(ci + 1).trim()}
                </p>
              );
            }
            return <p key={i} className="text-sm text-gray-700">{line}</p>;
          })}
        </div>
      )}

      {steps.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-4">Step-by-Step Process</h3>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                  {step.number}
                </div>
                <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
                  {step.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= Eligibility ================= */
const EligibilityTab = ({ content }) => {
  if (!content) return <p className="text-gray-500">Eligibility info not available.</p>;

  // Normalize: inline bullets → newlines
  const normalized = content
    .replace(/([^•\n])(•)/g, "$1\n•")
    .replace(/([^✓\n])(✓)/g, "$1\n✓");

  // Extract all items as flat list — strip bullet prefix chars
  const items = normalized
    .split("\n")
    .map((l) => l.trim().replace(/^[•\-✓✗]\s*/, ""))
    .filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-blue-500 text-xl">🎓</span>
        <h3 className="text-lg font-bold text-gray-800">Eligibility Criteria</h3>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-600 mb-3">Additional Criteria</p>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>
                {item.includes(":") && item.indexOf(":") < 50 ? (
                  <>
                    <span className="font-semibold text-gray-900">{item.substring(0, item.indexOf(":")+1)}</span>
                    {" "}{item.substring(item.indexOf(":")+1).trim()}
                  </>
                ) : item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ================= Exam Pattern ================= */
const ExamPatternTab = ({ pattern }) => {
  if (!pattern || (typeof pattern === "object" && Object.keys(pattern).length === 0)) {
    return <p className="text-gray-500">Exam pattern not available.</p>;
  }

  if (typeof pattern === "string") {
    return <p className="text-gray-700 whitespace-pre-line text-sm">{pattern}</p>;
  }

  const totalQuestions = pattern.sections
    ? pattern.sections.reduce((acc, sec) => {
        const q = typeof sec.questions === "number" ? sec.questions : 0;
        return acc + q;
      }, 0)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-blue-500 text-xl">📋</span>
        <h3 className="text-lg font-bold text-gray-800">Exam Pattern</h3>
      </div>

      {pattern.description && (
        <p className="text-gray-500 text-sm">{pattern.description}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pattern.duration && (
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-blue-600 text-lg font-bold leading-tight">{pattern.duration}</p>
            <p className="text-gray-500 text-xs mt-1">Duration</p>
          </div>
        )}
        {pattern.total_marks && (
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-purple-600 text-lg font-bold leading-tight">{String(pattern.total_marks)}</p>
            <p className="text-gray-500 text-xs mt-1">Total Marks</p>
          </div>
        )}
        {(totalQuestions > 0 || pattern.total_questions) && (
          <div className="bg-teal-50 rounded-xl p-4 text-center">
            <p className="text-teal-600 text-lg font-bold leading-tight">
              {pattern.total_questions ?? totalQuestions}
            </p>
            <p className="text-gray-500 text-xs mt-1">Questions</p>
          </div>
        )}
        {pattern.marking_scheme && (
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-green-700 text-xs font-semibold leading-snug break-words">
              {pattern.marking_scheme}
            </p>
            <p className="text-gray-500 text-xs mt-1">Marking Scheme</p>
          </div>
        )}
      </div>

      {pattern.sections && pattern.sections.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Section-wise Breakdown</h4>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Section</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Questions</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Marks</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                </tr>
              </thead>
              <tbody>
                {pattern.sections.map((sec, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-5 py-3 font-medium text-gray-900">{sec.subject}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{sec.questions}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{sec.marks}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{sec.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= Syllabus ================= */
const SyllabusTab = ({ syllabus }) => {
  const [openSubject, setOpenSubject] = useState(null);
  if (!syllabus || !syllabus.subjects)
    return <p className="text-gray-500">Syllabus not available.</p>;

  return (
    <div className="space-y-3">
      {syllabus.pdf_link && (
        <a
          href={syllabus.pdf_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
        >
          📄 Download Official Syllabus PDF
        </a>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {syllabus.subjects.map((sub, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
              onClick={() => setOpenSubject(openSubject === i ? null : i)}
            >
              <span className="font-semibold text-blue-900 text-sm">{sub.name}</span>
              <span className="text-blue-500 text-xs">{openSubject === i ? "▲" : "▼"}</span>
            </button>
            {openSubject === i && (
              <ul className="px-4 py-3 space-y-1">
                {sub.topics.map((topic, j) => (
                  <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-blue-400 flex-shrink-0">•</span> {topic}
                  </li>
                ))}
              </ul>
            )}
            {openSubject !== i && (
              <p className="px-4 py-2 text-xs text-gray-400">
                {sub.topics.length} topics — click to expand
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= Preparation Tips ================= */
const PreparationTab = ({ tips }) => {
  if (!tips) return <p className="text-gray-500">Preparation tips not available.</p>;
  const list = Array.isArray(tips) ? tips : [tips];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 text-2xl">💡</span>
        <h3 className="text-lg font-bold text-gray-800">Preparation Tips</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((tip, i) => (
          <div key={i} className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
              {i + 1}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mt-1">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= PYQs ================= */
const PYQsTab = ({ pyqs }) => {
  if (!pyqs) return <p className="text-gray-500">No PYQ information available.</p>;

  return (
    <div className="space-y-4">
      {pyqs.availability && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Availability</p>
          <p className="text-sm text-gray-700">{pyqs.availability}</p>
        </div>
      )}
      {pyqs.difficulty_trend && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide mb-1">Difficulty Trend</p>
          <p className="text-sm text-gray-700">{pyqs.difficulty_trend}</p>
        </div>
      )}
      {pyqs.recommended_sources && pyqs.recommended_sources.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recommended Sources</p>
          <ul className="space-y-2">
            {pyqs.recommended_sources.map((src, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span> {src}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/* ================= Mock Tests ================= */
const MockTestsTab = ({ mockTests }) => {
  if (!mockTests) return <p className="text-gray-500">No mock test information available.</p>;

  return (
    <div className="space-y-4">
      {mockTests.importance && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Why Mock Tests Matter</p>
          <p className="text-sm text-gray-700">{mockTests.importance}</p>
        </div>
      )}
      {mockTests.recommended_count && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Recommended Count</p>
          <p className="text-sm text-gray-700">{mockTests.recommended_count}</p>
        </div>
      )}
      {mockTests.recommended_platforms && mockTests.recommended_platforms.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recommended Platforms</p>
          <ul className="space-y-2">
            {mockTests.recommended_platforms.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-500 flex-shrink-0 mt-0.5">→</span> {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/* ================= Main Component ================= */
const ExamDetails = () => {
  const { slug } = useParams();
  const [exam, setExam] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://examprep360.onrender.com/api/exams/" + slug)
      .then((res) => {
        if (!res.ok) throw new Error("Exam not found");
        return res.json();
      })
      .then((data) => {
        setExam(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  if (error || !exam) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold text-gray-700">Exam not found</h2>
      </div>
    );
  }

  const tabs = exam?.tabs || {};

  const getPattern = () => {
    const t = exam?.tabs || {};
    return t.exam_pattern || null;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab content={tabs.overview ?? exam.overview} />;
      case "application":
        return <ApplicationTab content={tabs.application ?? exam.application} />;
      case "eligibility":
        return <EligibilityTab content={tabs.eligibility ?? exam.eligibility} />;
      case "pattern":
        return <ExamPatternTab pattern={getPattern()} />;
      case "syllabus":
        return <SyllabusTab syllabus={tabs.syllabus ?? exam.syllabus} />;
      case "preparation":
        return (
          <PreparationTab
            tips={
              tabs.preparation_tips ??
              tabs.preparation ??
              exam.preparation_tips ??
              exam.preparation
            }
          />
        );
      case "pyqs":
        return <PYQsTab pyqs={tabs.pyqs ?? exam.pyqs} />;
      case "mock_tests":
        return <MockTestsTab mockTests={tabs.mock_tests ?? exam.mock_tests} />;
      case "coaching":
        return <CoachingComparison examSlug={exam.slug} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{exam.name}</h1>

      <div className="border-b mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px
                ${activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ExamDetails;
