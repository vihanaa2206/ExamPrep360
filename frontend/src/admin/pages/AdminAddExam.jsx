import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const EMPTY_EXAM = {
  name:      "",
  slug:      "",
  category:  "",
  level:     "National",
  status:    "Upcoming",
  exam_date: "",
  rating:    4.5,
  tabs: {
    overview:         "",
    application:      "",
    eligibility:      "",
    preparation_tips: [],
    exam_pattern: {
      description:     "",
      duration:        "",
      total_marks:     "",
      total_questions: "",
      marking_scheme:  "",
      sections: [{ subject: "", questions: "", marks: "", type: "" }],
    },
    syllabus: {
      pdf_link: "",
      subjects: [{ name: "", topics: [""] }],
    },
    pyqs: {
      availability:        "",
      difficulty_trend:    "",
      recommended_sources: [],
    },
    mock_tests: {
      importance:            "",
      recommended_count:     "",
      recommended_platforms: [],
    },
  },
};

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase mb-1.5";
const areaCls  = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-blue-100 outline-none";

const SECTIONS = [
  { key: "basic",       label: "Basic Info" },
  { key: "overview",    label: "Overview" },
  { key: "application", label: "Application" },
  { key: "eligibility", label: "Eligibility" },
  { key: "pattern",     label: "Exam Pattern" },
  { key: "syllabus",    label: "Syllabus" },
  { key: "tips",        label: "Prep Tips" },
  { key: "pyqs",        label: "PYQs" },
  { key: "mock",        label: "Mock Tests" },
];

export default function AdminAddExam() {
  const navigate = useNavigate();
  const [exam, setExam]               = useState(EMPTY_EXAM);
  const [activeSection, setActiveSection] = useState("basic");
  const [saving, setSaving]           = useState(false);

  const setTab = (key, value) =>
    setExam((p) => ({ ...p, tabs: { ...p.tabs, [key]: value } }));

  // Exam Pattern
  const setPattern = (field, value) =>
    setExam((p) => ({ ...p, tabs: { ...p.tabs, exam_pattern: { ...p.tabs.exam_pattern, [field]: value } } }));

  const setSection = (i, field, value) => {
    const s = [...exam.tabs.exam_pattern.sections];
    s[i] = { ...s[i], [field]: value };
    setPattern("sections", s);
  };
  const addSection    = () => setPattern("sections", [...exam.tabs.exam_pattern.sections, { subject: "", questions: "", marks: "", type: "" }]);
  const removeSection = (i) => setPattern("sections", exam.tabs.exam_pattern.sections.filter((_, idx) => idx !== i));

  // Syllabus
  const setSyllabus = (field, value) =>
    setExam((p) => ({ ...p, tabs: { ...p.tabs, syllabus: { ...p.tabs.syllabus, [field]: value } } }));

  const setSubject    = (i, field, value) => { const s = [...exam.tabs.syllabus.subjects]; s[i] = { ...s[i], [field]: value }; setSyllabus("subjects", s); };
  const addSubject    = () => setSyllabus("subjects", [...exam.tabs.syllabus.subjects, { name: "", topics: [""] }]);
  const removeSubject = (i) => setSyllabus("subjects", exam.tabs.syllabus.subjects.filter((_, idx) => idx !== i));
  const setTopic      = (si, ti, value) => { const s = [...exam.tabs.syllabus.subjects]; const t = [...s[si].topics]; t[ti] = value; s[si] = { ...s[si], topics: t }; setSyllabus("subjects", s); };
  const addTopic      = (si) => { const s = [...exam.tabs.syllabus.subjects]; s[si] = { ...s[si], topics: [...s[si].topics, ""] }; setSyllabus("subjects", s); };
  const removeTopic   = (si, ti) => { const s = [...exam.tabs.syllabus.subjects]; s[si] = { ...s[si], topics: s[si].topics.filter((_, i) => i !== ti) }; setSyllabus("subjects", s); };

  // Tips
  const setTip    = (i, v) => { const t = [...(exam.tabs.preparation_tips || [])]; t[i] = v; setTab("preparation_tips", t); };
  const addTip    = () => setTab("preparation_tips", [...(exam.tabs.preparation_tips || []), ""]);
  const removeTip = (i) => setTab("preparation_tips", (exam.tabs.preparation_tips || []).filter((_, idx) => idx !== i));

  // PYQs
  const setPyqs = (field, value) =>
    setExam((p) => ({ ...p, tabs: { ...p.tabs, pyqs: { ...p.tabs.pyqs, [field]: value } } }));

  // Mock Tests
  const setMock = (field, value) =>
    setExam((p) => ({ ...p, tabs: { ...p.tabs, mock_tests: { ...p.tabs.mock_tests, [field]: value } } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post("/exams", {
        name: exam.name, slug: exam.slug, category: exam.category,
        level: exam.level, status: exam.status, exam_date: exam.exam_date,
        rating: exam.rating, tabs: exam.tabs,
      });
      alert("✅ Exam Published!");
      navigate("/admin/exams");
    } catch {
      alert("❌ Error: Check slug uniqueness or server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-600 pb-2 inline-block uppercase">
        Create Exam Portal
      </h2>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTIONS.map((s) => (
          <button key={s.key} type="button" onClick={() => setActiveSection(s.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeSection === s.key ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

        {/* BASIC */}
        {activeSection === "basic" && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 mb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Exam Short Name *</label>
                <input className={inputCls} placeholder="JIPMER" value={exam.name} onChange={(e) => setExam({ ...exam, name: e.target.value })} required /></div>
              <div><label className={labelCls}>Slug * (URL)</label>
                <input className={inputCls} placeholder="jipmer" value={exam.slug} onChange={(e) => setExam({ ...exam, slug: e.target.value })} required /></div>
              <div><label className={labelCls}>Category *</label>
                <select className={inputCls} value={exam.category} onChange={(e) => setExam({ ...exam, category: e.target.value })}>
                  <option value="">Select</option>
                  <option>Engineering</option><option>Medical</option>
                  <option>Computer Science</option><option>Law</option>
                  <option>Management</option><option>Government</option>
                </select></div>
              <div><label className={labelCls}>Level</label>
                <select className={inputCls} value={exam.level} onChange={(e) => setExam({ ...exam, level: e.target.value })}>
                  <option>National</option><option>State</option><option>University</option>
                </select></div>
              <div><label className={labelCls}>Exam Date</label>
                <input className={inputCls} placeholder="June 2026" value={exam.exam_date} onChange={(e) => setExam({ ...exam, exam_date: e.target.value })} /></div>
              <div><label className={labelCls}>Status</label>
                <select className={inputCls} value={exam.status} onChange={(e) => setExam({ ...exam, status: e.target.value })}>
                  <option>Upcoming</option><option>Open</option><option>Closed</option>
                </select></div>
              <div><label className={labelCls}>Rating (0-5)</label>
                <input className={inputCls} type="number" min="0" max="5" step="0.1" value={exam.rating}
                  onChange={(e) => setExam({ ...exam, rating: parseFloat(e.target.value) })} /></div>
            </div>
          </div>
        )}

        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <div>
            <label className={labelCls}>Overview</label>
            <p className="text-xs text-gray-400 mb-2">Use • or - for bullets. "Label: Value" for key facts.</p>
            <textarea className={areaCls} rows={12} value={exam.tabs.overview}
              onChange={(e) => setTab("overview", e.target.value)}
              placeholder="JIPMER is one of India's oldest medical institutions...&#10;• Conducting Body: JIPMER Puducherry&#10;• Mode: Computer Based Test&#10;• Frequency: Once a year" />
          </div>
        )}

        {/* APPLICATION */}
        {activeSection === "application" && (
          <div>
            <label className={labelCls}>Application Process</label>
            <p className="text-xs text-gray-400 mb-2">Numbered steps (1. 2. 3.) + key dates as "Label: Value"</p>
            <textarea className={areaCls} rows={12} value={exam.tabs.application}
              onChange={(e) => setTab("application", e.target.value)}
              placeholder="Application Fee: ₹1,500 (General)&#10;Last Date: March 2026&#10;&#10;1. Visit jipmer.edu.in&#10;2. Register with email and mobile&#10;3. Fill application form with academic details" />
          </div>
        )}

        {/* ELIGIBILITY */}
        {activeSection === "eligibility" && (
          <div>
            <label className={labelCls}>Eligibility Criteria</label>
            <p className="text-xs text-gray-400 mb-2">"Label: Value" for cards. • for additional bullets.</p>
            <textarea className={areaCls} rows={12} value={exam.tabs.eligibility}
              onChange={(e) => setTab("eligibility", e.target.value)}
              placeholder="Age Limit: 17 years minimum&#10;Qualification: 10+2 with PCB&#10;Minimum Marks: 60% in PCB (General)&#10;• Must have English as a subject" />
          </div>
        )}

        {/* EXAM PATTERN */}
        {activeSection === "pattern" && (
          <div className="space-y-5">
            <h3 className="font-bold text-gray-700">Exam Pattern</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Description</label>
                <input className={inputCls} placeholder="CBT — 200 questions" value={exam.tabs.exam_pattern.description}
                  onChange={(e) => setPattern("description", e.target.value)} /></div>
              <div><label className={labelCls}>Duration</label>
                <input className={inputCls} placeholder="3 Hours 30 Minutes" value={exam.tabs.exam_pattern.duration}
                  onChange={(e) => setPattern("duration", e.target.value)} /></div>
              <div><label className={labelCls}>Total Marks</label>
                <input className={inputCls} placeholder="800" value={exam.tabs.exam_pattern.total_marks}
                  onChange={(e) => setPattern("total_marks", e.target.value)} /></div>
              <div><label className={labelCls}>Total Questions</label>
                <input className={inputCls} placeholder="200" value={exam.tabs.exam_pattern.total_questions}
                  onChange={(e) => setPattern("total_questions", e.target.value)} /></div>
              <div className="md:col-span-2"><label className={labelCls}>Marking Scheme</label>
                <input className={inputCls} placeholder="+4 for correct, -1 for incorrect" value={exam.tabs.exam_pattern.marking_scheme}
                  onChange={(e) => setPattern("marking_scheme", e.target.value)} /></div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelCls}>Section-wise Breakdown</label>
                <button type="button" onClick={addSection} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold hover:bg-blue-100">+ Add Section</button>
              </div>
              {exam.tabs.exam_pattern.sections.map((sec, i) => (
                <div key={i} className="grid grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-2">
                  <div><label className="text-[10px] text-gray-400 uppercase">Subject</label>
                    <input className={inputCls} placeholder="Biology" value={sec.subject} onChange={(e) => setSection(i, "subject", e.target.value)} /></div>
                  <div><label className="text-[10px] text-gray-400 uppercase">Questions</label>
                    <input className={inputCls} placeholder="50" value={sec.questions} onChange={(e) => setSection(i, "questions", e.target.value)} /></div>
                  <div><label className="text-[10px] text-gray-400 uppercase">Marks</label>
                    <input className={inputCls} placeholder="200" value={sec.marks} onChange={(e) => setSection(i, "marks", e.target.value)} /></div>
                  <div className="relative"><label className="text-[10px] text-gray-400 uppercase">Type</label>
                    <input className={inputCls} placeholder="MCQ" value={sec.type} onChange={(e) => setSection(i, "type", e.target.value)} />
                    {exam.tabs.exam_pattern.sections.length > 1 && (
                      <button type="button" onClick={() => removeSection(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                    )}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SYLLABUS */}
        {activeSection === "syllabus" && (
          <div className="space-y-5">
            <h3 className="font-bold text-gray-700">Syllabus</h3>
            <div><label className={labelCls}>Official PDF Link</label>
              <input className={inputCls} placeholder="https://jipmer.edu.in/syllabus.pdf"
                value={exam.tabs.syllabus.pdf_link} onChange={(e) => setSyllabus("pdf_link", e.target.value)} /></div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelCls}>Subjects & Topics</label>
                <button type="button" onClick={addSubject} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">+ Add Subject</button>
              </div>
              {exam.tabs.syllabus.subjects.map((sub, si) => (
                <div key={si} className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-3">
                  <div className="flex gap-3 mb-3">
                    <input className={`${inputCls} flex-1`} placeholder="Subject (e.g. Physics)"
                      value={sub.name} onChange={(e) => setSubject(si, "name", e.target.value)} />
                    {exam.tabs.syllabus.subjects.length > 1 && (
                      <button type="button" onClick={() => removeSubject(si)} className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-full">Remove</button>
                    )}
                  </div>
                  <div className="space-y-2 pl-2">
                    {sub.topics.map((topic, ti) => (
                      <div key={ti} className="flex items-center gap-2">
                        <span className="text-blue-400">•</span>
                        <input className={`${inputCls} flex-1`} placeholder="Topic name" value={topic}
                          onChange={(e) => setTopic(si, ti, e.target.value)} />
                        {sub.topics.length > 1 && (
                          <button type="button" onClick={() => removeTopic(si, ti)} className="text-red-400 text-xl">×</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addTopic(si)} className="text-xs text-blue-500 font-semibold ml-4">+ Add Topic</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PREP TIPS */}
        {activeSection === "tips" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-700">Preparation Tips</h3>
              <button type="button" onClick={addTip} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">+ Add Tip</button>
            </div>
            <p className="text-xs text-gray-400">Each tip shows as a numbered card on exam page.</p>
            {(exam.tabs.preparation_tips || []).map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-1">{i + 1}</div>
                <textarea className={`${areaCls} flex-1`} rows={2}
                  placeholder={`Tip ${i + 1}`} value={tip} onChange={(e) => setTip(i, e.target.value)} />
                {(exam.tabs.preparation_tips || []).length > 1 && (
                  <button type="button" onClick={() => removeTip(i)} className="text-red-400 text-xl mt-1">×</button>
                )}
              </div>
            ))}
            {(exam.tabs.preparation_tips || []).length === 0 && (
              <button type="button" onClick={addTip}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-gray-400 text-sm hover:border-blue-300 hover:text-blue-400 transition">
                + Click to add first tip
              </button>
            )}
          </div>
        )}

        {/* ✅ PYQs */}
        {activeSection === "pyqs" && (
          <div className="space-y-5">
            <h3 className="font-bold text-gray-700">Previous Year Questions (PYQs)</h3>
            <p className="text-xs text-gray-400">Ye data PYQs tab mein exactly Image 1 jaise dikhega — Availability, Difficulty Trend, Recommended Sources.</p>

            <div>
              <label className={labelCls}>Availability</label>
              <textarea className={areaCls} rows={3}
                placeholder="JIPMER PYQs from 2010–2024 are available on jipmer.edu.in and major coaching portals."
                value={exam.tabs.pyqs.availability}
                onChange={(e) => setPyqs("availability", e.target.value)} />
            </div>

            <div>
              <label className={labelCls}>Difficulty Trend</label>
              <textarea className={areaCls} rows={3}
                placeholder="Biology questions are NCERT-based. Physics is concept-heavy. Chemistry is moderate."
                value={exam.tabs.pyqs.difficulty_trend}
                onChange={(e) => setPyqs("difficulty_trend", e.target.value)} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Recommended Sources</label>
                <button type="button"
                  onClick={() => setPyqs("recommended_sources", [...(exam.tabs.pyqs.recommended_sources || []), ""])}
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold hover:bg-blue-100">
                  + Add Source
                </button>
              </div>
              {(exam.tabs.pyqs.recommended_sources || []).map((src, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="text-green-500 text-sm">✓</span>
                  <input className={`${inputCls} flex-1`}
                    placeholder="e.g. JIPMER Official Website"
                    value={src}
                    onChange={(e) => {
                      const s = [...(exam.tabs.pyqs.recommended_sources || [])];
                      s[i] = e.target.value;
                      setPyqs("recommended_sources", s);
                    }} />
                  <button type="button"
                    onClick={() => setPyqs("recommended_sources", (exam.tabs.pyqs.recommended_sources || []).filter((_, idx) => idx !== i))}
                    className="text-red-400 text-xl">×</button>
                </div>
              ))}
              {(exam.tabs.pyqs.recommended_sources || []).length === 0 && (
                <button type="button"
                  onClick={() => setPyqs("recommended_sources", [""])}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-gray-400 text-sm hover:border-blue-300 hover:text-blue-400 transition">
                  + Add first source
                </button>
              )}
            </div>
          </div>
        )}

        {/* ✅ MOCK TESTS */}
        {activeSection === "mock" && (
          <div className="space-y-5">
            <h3 className="font-bold text-gray-700">Mock Tests</h3>
            <p className="text-xs text-gray-400">Ye data Mock Tests tab mein exactly Image 2 jaise dikhega.</p>

            <div>
              <label className={labelCls}>Why Mock Tests Matter</label>
              <textarea className={areaCls} rows={3}
                placeholder="Mock tests are essential for JIPMER preparation. They help with time management and question pattern familiarity."
                value={exam.tabs.mock_tests.importance}
                onChange={(e) => setMock("importance", e.target.value)} />
            </div>

            <div>
              <label className={labelCls}>Recommended Count</label>
              <input className={inputCls}
                placeholder="Attempt 20-30 full-length mocks before exam"
                value={exam.tabs.mock_tests.recommended_count}
                onChange={(e) => setMock("recommended_count", e.target.value)} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Recommended Platforms</label>
                <button type="button"
                  onClick={() => setMock("recommended_platforms", [...(exam.tabs.mock_tests.recommended_platforms || []), ""])}
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold hover:bg-blue-100">
                  + Add Platform
                </button>
              </div>
              {(exam.tabs.mock_tests.recommended_platforms || []).map((p, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="text-blue-500 text-sm">→</span>
                  <input className={`${inputCls} flex-1`}
                    placeholder="e.g. JIPMER Official Mock Tests"
                    value={p}
                    onChange={(e) => {
                      const pl = [...(exam.tabs.mock_tests.recommended_platforms || [])];
                      pl[i] = e.target.value;
                      setMock("recommended_platforms", pl);
                    }} />
                  <button type="button"
                    onClick={() => setMock("recommended_platforms", (exam.tabs.mock_tests.recommended_platforms || []).filter((_, idx) => idx !== i))}
                    className="text-red-400 text-xl">×</button>
                </div>
              ))}
              {(exam.tabs.mock_tests.recommended_platforms || []).length === 0 && (
                <button type="button"
                  onClick={() => setMock("recommended_platforms", [""])}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-gray-400 text-sm hover:border-blue-300 hover:text-blue-400 transition">
                  + Add first platform
                </button>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4 pt-4 border-t">
          <button type="submit" disabled={saving}
            className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl uppercase tracking-widest hover:bg-blue-700 transition disabled:opacity-60">
            {saving ? "Publishing..." : "Publish Exam"}
          </button>
          <button type="button" onClick={() => navigate("/admin/exams")}
            className="px-10 bg-gray-200 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-300 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}