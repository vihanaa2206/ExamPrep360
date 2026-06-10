import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminColleges() {
  const [colleges, setColleges]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editingSlug, setEditingSlug] = useState(null);
  const [editData, setEditData]   = useState({});
  const [message, setMessage]     = useState("");
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");

  const token = localStorage.getItem("token");

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const res = await API.get("/colleges");
      setColleges(res.data);
    } catch {
      setError("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const startEdit = (college) => {
    setEditingSlug(college.slug);
    setEditData({ ...college });
    setMessage("");
    setError("");
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      await API.put(`/colleges/${editingSlug}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ College updated successfully!");
      setEditingSlug(null);
      fetchColleges();
    } catch {
      setError("❌ Update failed");
    }
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const EDITABLE_FIELDS = [
    { key: "name",           label: "Full Name",        type: "text"   },
    { key: "short_name",     label: "Short Name",       type: "text"   },
    { key: "location",       label: "Location",         type: "text"   },
    { key: "fees_range",     label: "Fees Range",       type: "text"   },
    { key: "rating",         label: "Rating (0-5)",     type: "number" },
    { key: "nirf_ranking",   label: "NIRF Ranking",     type: "number" },
    { key: "naac_grade",     label: "NAAC Grade",       type: "text"   },
    { key: "seats",          label: "Total Seats",      type: "number" },
    { key: "total_students", label: "Total Students",   type: "number" },
    { key: "total_faculty",  label: "Total Faculty",    type: "number" },
    { key: "placements",     label: "Placements",       type: "text"   },
    { key: "campus_area",    label: "Campus Area",      type: "text"   },
    { key: "website",        label: "Website URL",      type: "text"   },
    { key: "description",    label: "Description",      type: "textarea"},
  ];

  const filtered = colleges.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.short_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Colleges</h2>
      <p className="text-sm text-gray-500 mb-6">
        Edit college details — changes save directly to MongoDB
      </p>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or category..."
        className="mb-6 px-4 py-2 border border-gray-300 rounded-xl text-sm w-80 bg-white"
      />

      {message && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-center py-20">Loading...</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((college) => (
            <div
              key={college.slug}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {college.short_name}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                      {college.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {college.type}
                    </span>
                    {college.nirf_ranking && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        NIRF #{college.nirf_ranking}
                      </span>
                    )}
                  </div>
                </div>

                {editingSlug === college.slug ? (
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(college)}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                  >
                    ✏ Edit
                  </button>
                )}
              </div>

              {/* Fields */}
              {editingSlug === college.slug ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {EDITABLE_FIELDS.filter((f) => f.type !== "textarea").map((field) => (
                      <div key={field.key}>
                        <p className="text-xs text-gray-400 font-medium mb-1">
                          {field.label}
                        </p>
                        <input
                          type={field.type}
                          value={editData[field.key] ?? ""}
                          onChange={(e) =>
                            handleChange(
                              field.key,
                              field.type === "number"
                                ? Number(e.target.value)
                                : e.target.value
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Description textarea */}
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      Description
                    </p>
                    <textarea
                      rows={3}
                      value={editData.description ?? ""}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                    />
                  </div>

                  {/* Courses array */}
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      Courses (comma separated)
                    </p>
                    <input
                      type="text"
                      value={(editData.courses || []).join(", ")}
                      onChange={(e) =>
                        handleChange(
                          "courses",
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                  </div>

                  {/* Exams accepted */}
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      Exams Accepted (comma separated slugs)
                    </p>
                    <input
                      type="text"
                      value={(editData.exams_accepted || []).join(", ")}
                      onChange={(e) =>
                        handleChange(
                          "exams_accepted",
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                      placeholder="jee-advanced, gate-cs, cat"
                    />
                  </div>
                </div>
              ) : (
                // View mode
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Fees Range",    value: college.fees_range },
                    { label: "Rating",        value: `⭐ ${college.rating}/5` },
                    { label: "Seats",         value: college.seats },
                    { label: "Faculty",       value: college.total_faculty },
                    { label: "Students",      value: college.total_students?.toLocaleString("en-IN") },
                    { label: "Campus Area",   value: college.campus_area },
                    { label: "Placements",    value: college.placements },
                    { label: "NAAC Grade",    value: college.naac_grade },
                  ].map((f) => (
                    <div key={f.label} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                      <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{f.value ?? "—"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
