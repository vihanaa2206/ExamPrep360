import { useState, useEffect } from "react";

const COMPARE_LIMIT = 4;

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-sm ${
            i < full
              ? "text-yellow-400"
              : i === full && half
              ? "text-yellow-300"
              : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-xs text-gray-500 font-medium">{rating}</span>
    </span>
  );
};

const CoachingCard = ({ coaching, isSelected, onToggle, disabled }) => {
  return (
    <div
      className={`relative rounded-2xl border-2 transition-all duration-200 bg-white shadow-sm hover:shadow-md cursor-pointer select-none
        ${isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-blue-300"}
        ${disabled && !isSelected ? "opacity-50 cursor-not-allowed" : ""}
      `}
      onClick={() => {
        if (!disabled || isSelected) onToggle(coaching);
      }}
    >
      <div
        className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
          ${isSelected ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"}`}
      >
        {isSelected && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-blue-600">
              {coaching.institute_name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {coaching.institute_name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{coaching.city}</p>
          </div>
        </div>

        <div className="mb-3">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {coaching.course}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-400 text-[10px] uppercase tracking-wide font-medium">Fees</p>
            <p className="text-gray-800 font-semibold mt-0.5">{coaching.fees}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-400 text-[10px] uppercase tracking-wide font-medium">Mode</p>
            <p className="text-gray-800 font-semibold mt-0.5">{coaching.mode}</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <StarRating rating={coaching.rating} />
        </div>
      </div>
    </div>
  );
};

const ComparisonTable = ({ selected }) => {
 const fields = [
  { label: "Institute Name",       key: "institute_name" },
  { label: "Course",               key: "course" },
  { label: "Fees",                 key: "fees" },
  { label: "Mode",                 key: "mode" },
  { label: "Duration",             key: "duration",             render: (v) => v || "—" },
  { label: "Rating",               key: "rating",               render: (v) => <StarRating rating={v} /> },
  { label: "Students Enrolled (2024)", key: "students_admitted_2024", render: (v) => v ? v.toLocaleString("en-IN") : "—" },
  { label: "Total Selections (2024)", key: "total_selections_2024", render: (v) => v ? <span className="font-bold text-green-600">{v.toLocaleString("en-IN")}</span> : "—" },
  { label: "Success Rate",         key: "success_rate" },
  { label: "Faculty Count",        key: "faculty_count" },
  { label: "Batch Size",           key: "batch_size",           render: (v) => v || "—" },
  { label: "Study Material",       key: "study_material",       render: (v) => v ? "✅" : "❌" },
  { label: "Test Series",          key: "test_series",          render: (v) => v ? "✅" : "❌" },
  { label: "Doubt Support",        key: "doubt_support",        render: (v) => v ? "✅" : "❌" },
  { label: "Live Sessions",        key: "live_sessions",        render: (v) => v ? "✅" : "❌" },
  { label: "Demo Class",           key: "demo_class",           render: (v) => v ? "✅" : "❌" },
  { label: "Scholarship",          key: "scholarship",          render: (v) => v ? "✅ Available" : "❌ Not Available" },
  { label: "Key Features",         key: "key_features",         render: (v) => v?.length ? (
    <ul className="text-left text-xs space-y-1">
      {v.map((f, i) => <li key={i} className="flex items-start gap-1"><span className="text-green-500 mt-0.5">✓</span>{f}</li>)}
    </ul>
  ) : "—" },
  { label: "City",                 key: "city" },
];

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Comparison Table</h3>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <th className="text-left px-5 py-4 font-semibold w-44">Feature</th>
              {selected.map((c) => (
                <th key={c._id || c.institute_name + c.course} className="text-center px-4 py-4 font-semibold">
                  {c.institute_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, idx) => (
              <tr key={field.key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">
                  {field.label}
                </td>
                {selected.map((c) => (
                  <td key={c._id || c.institute_name + c.course} className="px-4 py-3.5 text-center text-gray-800 font-medium">
                    {field.render ? field.render(c[field.key]) : c[field.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CoachingComparison = ({ examSlug }) => {
  const [coachings, setCoachings] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (!examSlug) return;

  setLoading(true);
  setSelected([]);
  setError(null);

  fetch(`https://examprep360.onrender.com/api/coachings/${examSlug}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load coaching data");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Coachings data:", data); // debug
      setCoachings(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setError(err.message);
      setLoading(false);
    });

}, [examSlug]);

  const toggleSelect = (coaching) => {
    const id = coaching._id || coaching.institute_name + coaching.course;
    const isAlreadySelected = selected.some(
      (s) => (s._id || s.institute_name + s.course) === id
    );
    if (isAlreadySelected) {
      setSelected(selected.filter((s) => (s._id || s.institute_name + s.course) !== id));
    } else if (selected.length < COMPARE_LIMIT) {
      setSelected([...selected, coaching]);
    }
  };

  const isSelected = (coaching) => {
    const id = coaching._id || coaching.institute_name + coaching.course;
    return selected.some((s) => (s._id || s.institute_name + s.course) === id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500 font-medium">{error}</div>;
  }

  if (!coachings.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No coaching institutes found for this exam in Lucknow.
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
          Top Coachings in Lucknow ({examSlug?.replace("-", " ").toUpperCase()})
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Showing institutes in <span className="font-semibold text-blue-600">Lucknow</span>
          </p>
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="text-xs text-red-500 hover:text-red-700 underline font-medium mt-1"
          >
            Clear selection ({selected.length})
          </button>
        )}
      </div>

      <div
        className={`flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl mb-6 transition-colors
          ${selected.length === COMPARE_LIMIT
            ? "bg-orange-50 text-orange-700 border border-orange-200"
            : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
      >
        <span className="text-base">
          {selected.length === COMPARE_LIMIT ? "⚠️" : "ℹ️"}
        </span>
        {selected.length === COMPARE_LIMIT
          ? `Maximum ${COMPARE_LIMIT} institutes selected. Deselect one to change your selection.`
          : `Select up to ${COMPARE_LIMIT} coaching institutes to compare`}
        {selected.length > 0 && selected.length < COMPARE_LIMIT && (
          <span className="ml-auto text-blue-500 font-normal">
            {COMPARE_LIMIT - selected.length} more slot{COMPARE_LIMIT - selected.length > 1 ? "s" : ""} available
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coachings.map((coaching) => {
          const sel = isSelected(coaching);
          const maxed = selected.length >= COMPARE_LIMIT;
          return (
            <CoachingCard
              key={coaching._id || coaching.institute_name + coaching.course}
              coaching={coaching}
              isSelected={sel}
              onToggle={toggleSelect}
              disabled={maxed && !sel}
            />
          );
        })}
      </div>

      {selected.length >= 2 && <ComparisonTable selected={selected} />}
      {selected.length === 1 && (
        <p className="text-center text-gray-400 text-sm mt-8">
          Select at least 1 more institute to compare.
        </p>
      )}
    </div>
  );
};

export default CoachingComparison;
