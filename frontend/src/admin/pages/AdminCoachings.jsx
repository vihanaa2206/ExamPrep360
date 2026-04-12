import { useEffect, useState } from "react";
import API from "../../services/api";

// ── Constants — outside component ──────────────────────────────────────────
const EMPTY_COACHING = {
  institute_name:         "",
  course:                 "",
  fees:                   "",
  mode:                   "Online",
  duration:               "",
  rating:                 4.5,
  students_enrolled:      0,
  students_admitted_2024: 0,
  total_selections_2024:  0,
  success_rate:           "",
  faculty_count:          0,
  batch_size:             "",
  study_material:         true,
  test_series:            true,
  doubt_support:          true,
  live_sessions:          true,
  demo_class:             true,
  scholarship:            false,
  key_features:           [],
};

const EDITABLE_FIELDS = [
  { key: "fees",                   label: "Fees",              type: "text"   },
  { key: "mode",                   label: "Mode",              type: "text"   },
  { key: "duration",               label: "Duration",          type: "text"   },
  { key: "rating",                 label: "Rating (0-5)",      type: "number" },
  { key: "students_enrolled",      label: "Students Enrolled", type: "number" },
  { key: "students_admitted_2024", label: "Admitted 2024",     type: "number" },
  { key: "total_selections_2024",  label: "Selections 2024",   type: "number" },
  { key: "success_rate",           label: "Success Rate",      type: "text"   },
  { key: "faculty_count",          label: "Faculty Count",     type: "number" },
  { key: "batch_size",             label: "Batch Size",        type: "text"   },
];

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none";

// ── Main Component ──────────────────────────────────────────────────────────
export default function AdminCoachings() {

  // ✅ ALL states INSIDE component
  const [examSlugs, setExamSlugs]     = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [coachings, setCoachings]     = useState([]);
  const [loading, setLoading]         = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [editData, setEditData]       = useState({});
  const [message, setMessage]         = useState("");
  const [error, setError]             = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCoaching, setNewCoaching] = useState({ ...EMPTY_COACHING });
  const [adding, setAdding]           = useState(false);

  const token = localStorage.getItem("token");

  // ── Fetch coachings ────────────────────────────────────────────────────
  const fetchCoachings = async (slug) => {
    if (!slug) return;
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await API.get(`/coachings/${slug}`);
      setCoachings(res.data);
    } catch {
      setError("Failed to load coachings");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all exam slugs dynamically from MongoDB
  useEffect(() => {
    API.get("/exams")
      .then((res) => {
        const slugs = res.data
          .map((e) => e.slug)
          .filter(Boolean)
          .sort();
        setExamSlugs(slugs);
        if (slugs.length > 0) {
          setSelectedExam(slugs[0]);
          fetchCoachings(slugs[0]);
        }
      })
      .catch(() => setError("Failed to load exam list"));
  }, []);

  // ✅ Fetch coachings when exam changes (but not on first load)
  const handleExamChange = (slug) => {
    setSelectedExam(slug);
    setShowAddForm(false);
    setMessage("");
    setError("");
    fetchCoachings(slug);
  };

  // ── Add new coaching ───────────────────────────────────────────────────
  const handleAddCoaching = async () => {
    if (!newCoaching.institute_name.trim()) {
      setError("❌ Institute name is required");
      return;
    }
    if (!newCoaching.course.trim()) {
      setError("❌ Course name is required");
      return;
    }
    setAdding(true);
    setError("");
    try {
      await API.post("/coachings", {
        ...newCoaching,
        exam_slug: selectedExam,
        city:      "Lucknow",
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`✅ Coaching added for ${selectedExam}!`);
      setShowAddForm(false);
      setNewCoaching({ ...EMPTY_COACHING });
      fetchCoachings(selectedExam);
    } catch {
      setError("❌ Failed to add coaching");
    } finally {
      setAdding(false);
    }
  };

  // ── Edit handlers ──────────────────────────────────────────────────────
  const startEdit  = (c) => { setEditingId(c._id); setEditData({ ...c }); };
  const cancelEdit = ()  => { setEditingId(null); setEditData({}); };

  const saveEdit = async () => {
    try {
      await API.put(`/coachings/${editingId}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Updated successfully!");
      setEditingId(null);
      fetchCoachings(selectedExam);
    } catch {
      setError("❌ Update failed");
    }
  };

  const handleChange    = (f, v) => setEditData((p)    => ({ ...p, [f]: v }));
  const handleNewChange = (f, v) => setNewCoaching((p) => ({ ...p, [f]: v }));

  // ── Delete coaching ────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coaching?")) return;
    try {
      await API.delete(`/coachings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Deleted!");
      fetchCoachings(selectedExam);
    } catch {
      setError("❌ Delete failed");
    }
  };

  // ── Reusable field grid ────────────────────────────────────────────────
  const FieldGrid = ({ data, onChange }) => (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {EDITABLE_FIELDS.map((field) => (
          <div key={field.key}>
            <p className="text-xs text-gray-400 font-medium mb-1">{field.label}</p>
            <input
              type={field.type}
              value={data[field.key] ?? ""}
              onChange={(e) => onChange(
                field.key,
                field.type === "number" ? Number(e.target.value) : e.target.value
              )}
              className={inputCls}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-400 font-medium mb-1">Key Features (comma separated)</p>
        <input
          type="text"
          value={(data.key_features || []).join(", ")}
          onChange={(e) => onChange(
            "key_features",
            e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
          )}
          className={inputCls}
          placeholder="AIR 1 in 2024, 400+ centres, 5500+ faculty"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {["study_material","test_series","doubt_support","live_sessions","demo_class","scholarship"].map((field) => (
          <label key={field} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={data[field] ?? false}
              onChange={(e) => onChange(field, e.target.checked)}
              className="accent-blue-600"
            />
            {field.replace(/_/g, " ")}
          </label>
        ))}
      </div>
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Coachings</h2>

      {/* Exam selector + Add button */}
      <div className="flex items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Select Exam
          </label>
          <select
            value={selectedExam}
            onChange={(e) => handleExamChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm bg-white w-64"
          >
            {examSlugs.length === 0 && (
              <option value="">Loading exams...</option>
            )}
            {examSlugs.map((slug) => (
              <option key={slug} value={slug}>{slug}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => { setShowAddForm(!showAddForm); setMessage(""); setError(""); }}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
            showAddForm
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {showAddForm ? "✕ Cancel" : "+ Add New Coaching"}
        </button>
      </div>

      {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm">{message}</div>}
      {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">{error}</div>}

      {/* ADD FORM */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border-2 border-green-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-green-700 mb-4">
            ➕ Add New Coaching for{" "}
            <span className="text-blue-600">{selectedExam}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Institute Name *</p>
              <input
                type="text"
                value={newCoaching.institute_name}
                onChange={(e) => handleNewChange("institute_name", e.target.value)}
                className={inputCls}
                placeholder="e.g. Drishti IAS"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Course Name *</p>
              <input
                type="text"
                value={newCoaching.course}
                onChange={(e) => handleNewChange("course", e.target.value)}
                className={inputCls}
                placeholder={`e.g. ${selectedExam.toUpperCase()} 1-Year`}
              />
            </div>
          </div>

          <FieldGrid data={newCoaching} onChange={handleNewChange} />

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleAddCoaching}
              disabled={adding}
              className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-60"
            >
              {adding ? "Adding..." : "✅ Save Coaching"}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setNewCoaching({ ...EMPTY_COACHING }); }}
              className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* COACHING LIST */}
      {loading ? (
        <p className="text-gray-400 text-center py-20">Loading...</p>
      ) : coachings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-lg mb-2">
            No coachings for <strong>{selectedExam}</strong>
          </p>
          <p className="text-gray-400 text-sm">
            Click "+ Add New Coaching" to add institutes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {coachings.map((coaching) => (
            <div key={coaching._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{coaching.institute_name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{coaching.course}</p>
                </div>
                <div className="flex gap-2">
                  {editingId === coaching._id ? (
                    <>
                      <button onClick={saveEdit}
                        className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">
                        Save
                      </button>
                      <button onClick={cancelEdit}
                        className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(coaching)}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                        ✏ Edit
                      </button>
                      <button onClick={() => handleDelete(coaching._id)}
                        className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100">
                        🗑 Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingId === coaching._id ? (
                <FieldGrid data={editData} onChange={handleChange} />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {EDITABLE_FIELDS.map((field) => (
                    <div key={field.key}>
                      <p className="text-xs text-gray-400 font-medium mb-1">{field.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{coaching[field.key] ?? "—"}</p>
                    </div>
                  ))}
                  {coaching.key_features?.length > 0 && (
                    <div className="md:col-span-4">
                      <p className="text-xs text-gray-400 font-medium mb-1">Key Features</p>
                      <div className="flex flex-wrap gap-2">
                        {coaching.key_features.map((f, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="md:col-span-4 flex flex-wrap gap-3">
                    {["study_material","test_series","doubt_support","live_sessions","demo_class","scholarship"].map((f) => (
                      <span key={f} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        coaching[f] ? "bg-green-100 text-green-700" : "bg-red-50 text-red-400"
                      }`}>
                        {coaching[f] ? "✅" : "❌"} {f.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}