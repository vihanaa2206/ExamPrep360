import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

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

const toStr = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  return String(val);
};

const toArr = (val) => Array.isArray(val) ? val : [];

const toPattern = (val) => ({
  description:     val?.description     || "",
  duration:        val?.duration        || "",
  total_marks:     val?.total_marks     || "",
  total_questions: val?.total_questions || "",
  marking_scheme:  val?.marking_scheme  || "",
  sections: Array.isArray(val?.sections) && val.sections.length > 0
    ? val.sections
    : [{ subject: "", questions: "", marks: "", type: "" }],
});

const toSyllabus = (val) => ({
  pdf_link: val?.pdf_link || "",
  subjects: Array.isArray(val?.subjects) && val.subjects.length > 0
    ? val.subjects
    : [{ name: "", topics: [""] }],
});

const toPyqs = (val) => ({
  availability:        toStr(val?.availability),
  difficulty_trend:    toStr(val?.difficulty_trend),
  recommended_sources: toArr(val?.recommended_sources),
});

const toMock = (val) => ({
  importance:            toStr(val?.importance),
  recommended_count:     toStr(val?.recommended_count),
  recommended_platforms: toArr(val?.recommended_platforms),
});

export default function AdminEditExam() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const [formData, setFormData]       = useState(null);
  const [activeSection, setActiveSection] = useState("basic");
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    API.get(`/exams/${slug}`)
      .then((res) => {
        const d    = res.data;
        const tabs = d.tabs || {};
        setFormData({
          ...d,
          tabs: {
            overview:         toStr(tabs.overview),
            application:      toStr(tabs.application),
            eligibility:      toStr(tabs.eligibility),
            preparation_tips: toArr(tabs.preparation_tips),
            exam_pattern:     toPattern(tabs.exam_pattern),
            syllabus:         toSyllabus(tabs.syllabus),
            pyqs:             toPyqs(tabs.pyqs),
            mock_tests:       toMock(tabs.mock_tests),
          },
        });
      })
      .catch(() => alert("Failed to load exam data."));
  }, [slug]);

  const setTab = (key, value) =>
    setFormData((p) => ({ ...p, tabs: { ...p.tabs, [key]: value } }));

  const setPattern = (field, value) =>
    setFormData((p) => ({ ...p, tabs: { ...p.tabs, exam_pattern: { ...p.tabs.exam_pattern, [field]: value } } }));
  const setSection = (i, field, value) => {
    const s = [...formData.tabs.exam_pattern.sections]; s[i] = { ...s[i], [field]: value }; setPattern("sections", s);
  };
  const addSection    = () => setPattern("sections", [...formData.tabs.exam_pattern.sections, { subject: "", questions: "", marks: "", type: "" }]);
  const removeSection = (i) => setPattern("sections", formData.tabs.exam_pattern.sections.filter((_, idx) => idx !== i));

  const setSyllabus = (field, value) =>
    setFormData((p) => ({ ...p, tabs: { ...p.tabs, syllabus: { ...p.tabs.syllabus, [field]: value } } }));
  const setSubject    = (i, field, value) => { const s = [...formData.tabs.syllabus.subjects]; s[i] = { ...s[i], [field]: value }; setSyllabus("subjects", s); };
  const addSubject    = () => setSyllabus("subjects", [...formData.tabs.syllabus.subjects, { name: "", topics: [""] }]);
  const removeSubject = (i) => setSyllabus("subjects", formData.tabs.syllabus.subjects.filter((_, idx) => idx !== i));
  const setTopic      = (si, ti, value) => { const s = [...formData.tabs.syllabus.subjects]; const t = [...s[si].topics]; t[ti] = value; s[si] = { ...s[si], topics: t }; setSyllabus("subjects", s); };
  const addTopic      = (si) => { const s = [...formData.tabs.syllabus.subjects]; s[si] = { ...s[si], topics: [...s[si].topics, ""] }; setSyllabus("subjects", s); };
  const removeTopic   = (si, ti) => { const s = [...formData.tabs.syllabus.subjects]; s[si] = { ...s[si], topics: s[si].topics.filter((_, i) => i !== ti) }; setSyllabus("subjects", s); };

  const setTip    = (i, v) => { const t = [...(formData.tabs.preparation_tips || [])]; t[i] = v; setTab("preparation_tips", t); };
  const addTip    = () => setTab("preparation_tips", [...(formData.tabs.preparation_tips || []), ""]);
  const removeTip = (i) => setTab("preparation_tips", (formData.tabs.preparation_tips || []).filter((_, idx) => idx !== i));

  const setPyqs = (field, value) =>
    setFormData((p) => ({ ...p, tabs: { ...p.tabs, pyqs: { ...p.tabs.pyqs, [field]: value } } }));

  const setMock = (field, value) =>
    setFormData((p) => ({ ...p, tabs: { ...p.tabs, mock_tests: { ...p.tabs.mock_tests, [field]: value } } }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/exams/${formData._id}`, {
        name:      formData.name,
        category:  formData.category,
        level:     formData.level,
        status:    formData.status,
        exam_date: formData.exam_date,
        tabs:      formData.tabs,
      });
      alert("✅ Updated Successfully!");
      navigate("/admin/exams");
    } catch {
      alert("❌ Update Failed.");
    } finally {
      setSaving(false);
    }
  };

  if (!formData) return (
    <div className="p-20 text-center font-bold text-indigo-600 animate-pulse">🔄 Loading...</div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-600 pb-2 inline-block uppercase">
        Edit Exam: {formData.name}
      </h2>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTIONS.map((s) => (
          <button key={s.key} type="button" onClick={() => setActiveSection(s.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeSection === s.key ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-400"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

        {/* BASIC */}
        {activeSection === "basic" && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Exam Name</label>
                <input className={inputCls} value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
              <div><label className={labelCls}>Category</label>
                <select className={inputCls} value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option>Engineering</option><option>Medical</option>
                  <option>Computer Science</option><option>Law</option>
                  <option>Management</option><option>Government</option>
                </select></div>
              <div><label className={labelCls}>Level</label>
                <select className={inputCls} value={formData.level || "National"}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                  <option>National</option><option>State</option><option>University</option>
                </select></div>
              <div><label className={labelCls}>Status</label>
                <select className={inputCls} value={formData.status || "Upcoming"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option>Upcoming</option><option>Open</option><option>Closed</option>
                </select></div>
              <div className="md:col-span-2"><label className={labelCls}>Exam Date</label>
                <input className={inputCls} placeholder="June 2026" value={formData.exam_date || ""}
                  onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })} /></div>
            </div>
          </div>
        )}

        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <div>
            <label className={labelCls}>Overview</label>
            <textarea className={areaCls} rows={12} value={formData.tabs.overview}
              onChange={(e) => setTab("overview", e.target.value)} />
          </div>
        )}

        {/* APPLICATION */}
        {activeSection === "application" && (
          <div>
            <label className={labelCls}>Application Process</label>
            <textarea className={areaCls} rows={12} value={formData.tabs.application}
              onChange={(e) => setTab("application", e.target.value)} />
          </div>
        )}

        {/* ELIGIBILITY */}
        {activeSection === "eligibility" && (
          <div>
            <label className={labelCls}>Eligibility Criteria</label>
            <textarea className={areaCls} rows={12} value={formData.tabs.eligibility}
              onChange={(e) => setTab("eligibility", e.target.value)} />
          </div>
        )}

        {/* EXAM PATTERN */}
        {activeSection === "pattern" && (
          <div className="space-y-5">
            <h3 className="font-bold text-gray-700">Exam Pattern</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Description</label>
                <input className={inputCls} value={formData.tabs.exam_pattern.description}
                  onChange={(e) => setPattern("description", e.target.value)} /></div>
              <div><label className={labelCls}>Duration</label>
                <input className={inputCls} value={formData.tabs.exam_pattern.duration}
                  onChange={(e) => setPattern("duration", e.target.value)} /></div>
              <div><label className={labelCls}>Total Marks</label>
                <input className={inputCls} value={formData.tabs.exam_pattern.total_marks}
                  onChange={(e) => setPattern("total_marks", e.target.value)} /></div>
              <div><label className={labelCls}>Total Questions</label>
                <input className={inputCls} value={formData.tabs.exam_pattern.total_questions}
                  onChange={(e) => setPattern("total_questions", e.target.value)} /></div>
              <div className="md:col-span-2"><label className={labelCls}>Marking Scheme</label>
                <input className={inputCls} value={formData.tabs.exam_pattern.marking_scheme}
                  onChange={(e) => setPattern("marking_scheme", e.target.value)} /></div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelCls}>Sections</label>
                <button type="button" onClick={addSection} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-semibold">+ Add Section</button>
              </div>
              {formData.tabs.exam_pattern.sections.map((sec, i) => (
                <div key={i} className="grid grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-2">
                  <div><label className="text-[10px] text-gray-400 uppercase">Subject</label>
                    <input className={inputCls} value={sec.subject} onChange={(e) => setSection(i, "subject", e.target.value)} /></div>
                  <div><label className="text-[10px] text-gray-400 uppercase">Questions</label>
                    <input className={inputCls} value={sec.questions} onChange={(e) => setSection(i, "questions", e.target.value)} /></div>
                  <div><label className="text-[10px] text-gray-400 uppercase">Marks</label>
                    <input className={inputCls} value={sec.marks} onChange={(e) => setSection(i, "marks", e.target.value)} /></div>
                  <div className="relative"><label className="text-[10px] text-gray-400 uppercase">Type</label>
                    <input className={inputCls} value={sec.type} onChange={(e) => setSection(i, "type", e.target.value)} />
                    {formData.tabs.exam_pattern.sections.length > 1 && (
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
            <div><label className={labelCls}>PDF Link</label>
              <input className={inputCls} value={formData.tabs.syllabus.pdf_link}
                onChange={(e) => setSyllabus("pdf_link", e.target.value)} /></div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={labelCls}>Subjects & Topics</label>
                <button type="button" onClick={addSubject} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-semibold">+ Add Subject</button>
              </div>
              {formData.tabs.syllabus.subjects.map((sub, si) => (
                <div key={si} className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-3">
                  <div className="flex gap-3 mb-3">
                    <input className={`${inputCls} flex-1`} placeholder="Subject name" value={sub.name}
                      onChange={(e) => setSubject(si, "name", e.target.value)} />
                    {formData.tabs.syllabus.subjects.length > 1 && (
                      <button type="button" onClick={() => removeSubject(si)} className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-full">Remove</button>
                    )}
                  </div>
                  <div className="space-y-2 pl-2">
                    {sub.topics.map((topic, ti) => (
                      <div key={ti} className="flex items-center gap-2">
                        <span className="text-blue-400">•</span>
                        <input className={`${inputCls} flex-1`} placeholder="Topic" value={topic}
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
              <button type="button" onClick={addTip} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-semibold">+ Add Tip</button>
            </div>
            {(formData.tabs.preparation_tips || []).map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-1">{i + 1}</div>
                <textarea className={`${areaCls} flex-1`} rows={2} value={tip}
                  onChange={(e) => setTip(i, e.target.value)} />
                {(formData.tabs.preparation_tips || []).length > 1 && (
                  <button type="button" onClick={() => removeTip(i)} className="text-red-400 text-xl mt-1">×</button>
                )}
              </div>
            ))}
            {(formData.tabs.preparation_tips || []).length === 0 && (
              <button type="button" onClick={addTip}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-gray-400 text-sm hover:border-blue-300 hover:text-blue-400 transition">
                + Click to add first tip
              </button>
            )}
          </div>
        )}

        {/* PYQs */}
        {activeSection === "pyqs" && (
          <div className="space-y-5">
            <h3 className="font-bold text-gray-700">Previous Year Questions</h3>
            <div><label className={labelCls}>Availability</label>
              <textarea className={areaCls} rows={3} value={formData.tabs.pyqs.availability}
                onChange={(e) => setPyqs("availability", e.target.value)} /></div>
            <div><label className={labelCls}>Difficulty Trend</label>
              <textarea className={areaCls} rows={3} value={formData.tabs.pyqs.difficulty_trend}
                onChange={(e) => setPyqs("difficulty_trend", e.target.value)} /></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Recommended Sources</label>
                <button type="button"
                  onClick={() => setPyqs("recommended_sources", [...(formData.tabs.pyqs.recommended_sources || []), ""])}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-semibold">+ Add</button>
              </div>
              {(formData.tabs.pyqs.recommended_sources || []).map((src, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">✓</span>
                  <input className={`${inputCls} flex-1`} value={src}
                    onChange={(e) => {
                      const s = [...(formData.tabs.pyqs.recommended_sources || [])];
                      s[i] = e.target.value; setPyqs("recommended_sources", s);
                    }} />
                  <button type="button"
                    onClick={() => setPyqs("recommended_sources", (formData.tabs.pyqs.recommended_sources || []).filter((_, idx) => idx !== i))}
                    className="text-red-400 text-xl">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MOCK TESTS */}
        {activeSection === "mock" && (
          <div className="space-y-5">
            <h3 className="font-bold text-gray-700">Mock Tests</h3>
            <div><label className={labelCls}>Why Mock Tests Matter</label>
              <textarea className={areaCls} rows={3} value={formData.tabs.mock_tests.importance}
                onChange={(e) => setMock("importance", e.target.value)} /></div>
            <div><label className={labelCls}>Recommended Count</label>
              <input className={inputCls} value={formData.tabs.mock_tests.recommended_count}
                onChange={(e) => setMock("recommended_count", e.target.value)} /></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Recommended Platforms</label>
                <button type="button"
                  onClick={() => setMock("recommended_platforms", [...(formData.tabs.mock_tests.recommended_platforms || []), ""])}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-semibold">+ Add</button>
              </div>
              {(formData.tabs.mock_tests.recommended_platforms || []).map((p, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="text-blue-500">→</span>
                  <input className={`${inputCls} flex-1`} value={p}
                    onChange={(e) => {
                      const pl = [...(formData.tabs.mock_tests.recommended_platforms || [])];
                      pl[i] = e.target.value; setMock("recommended_platforms", pl);
                    }} />
                  <button type="button"
                    onClick={() => setMock("recommended_platforms", (formData.tabs.mock_tests.recommended_platforms || []).filter((_, idx) => idx !== i))}
                    className="text-red-400 text-xl">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button type="submit" disabled={saving}
            className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl uppercase tracking-widest hover:bg-indigo-700 transition disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
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
