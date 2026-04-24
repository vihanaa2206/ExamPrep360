import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, ArrowLeft, Search, AlertCircle } from 'lucide-react';

const API = "https://examprep360-production.up.railway.app/api";

const PYPSelection = () => {
  const { examName } = useParams();
  const navigate = useNavigate();
  const decodedExam = decodeURIComponent(examName);

  const [files, setFiles]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetch(`${API}/pyq/files/${encodeURIComponent(decodedExam)}`)
      .then(r => r.json())
      .then(data => { setFiles(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [decodedExam]);

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // Clean display name — remove .pdf extension for display
  const displayName = (filename) => filename.replace(/\.pdf$/i, "");

  // Google Docs viewer URL for inline PDF viewing
  const viewerUrl = (url) =>
    `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=false`;

  return (
    <div className="p-6 min-h-screen" style={{ background: "var(--bg-primary, #0f172a)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-bold mb-6 hover:opacity-80 transition-colors text-sm"
          style={{ color: "#818cf8" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div
          className="rounded-3xl shadow-xl p-8 mb-6 border"
          style={{
            background: "var(--bg-secondary, #1e293b)",
            borderColor: "var(--border-color, #334155)",
          }}
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl shadow-lg" style={{ background: "#4f46e5" }}>
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black" style={{ color: "var(--text-primary, #f1f5f9)" }}>{decodedExam}</h1>
              <p className="text-sm" style={{ color: "var(--text-secondary, #94a3b8)" }}>Official Previous Year Question Papers</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-5">
            <Search className="absolute left-4 top-3 w-4 h-4" style={{ color: "#64748b" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search papers by year or name..."
              className="w-full pl-11 pr-4 py-2.5 border rounded-xl text-sm outline-none"
              style={{
                background: "var(--bg-input, #0f172a)",
                borderColor: "var(--border-color, #334155)",
                color: "var(--text-primary, #f1f5f9)",
              }}
            />
          </div>
        </div>

        {/* Files list */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
            <p className="text-sm" style={{ color: "#64748b" }}>Loading papers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-3xl border p-12 text-center shadow-sm"
            style={{
              background: "var(--bg-secondary, #1e293b)",
              borderColor: "var(--border-color, #334155)",
            }}
          >
            <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "#475569" }} />
            <p className="text-xl font-bold mb-2" style={{ color: "var(--text-primary, #f1f5f9)" }}>No Papers Found</p>
            <p className="text-sm" style={{ color: "#64748b" }}>
              {files.length === 0 ? "No papers uploaded yet for this exam" : "No papers match your search"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-medium" style={{ color: "#64748b" }}>
              {filtered.length} paper{filtered.length !== 1 ? "s" : ""} found
            </p>

            {filtered.map((file, i) => (
              <div
                key={i}
                className="rounded-2xl border shadow-sm transition-all duration-300 p-6"
                style={{
                  background: "var(--bg-secondary, #1e293b)",
                  borderColor: "var(--border-color, #334155)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(99,102,241,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border-color, #334155)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                  {/* File info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(239,68,68,0.15)" }}>
                      <FileText className="w-6 h-6" style={{ color: "#ef4444" }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base" style={{ color: "var(--text-primary, #f1f5f9)" }}>
                        {displayName(file.name)}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                        PDF · {file.size_kb} KB
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 w-full md:w-auto">

                    {/* VIEW — opens in Google Docs viewer (no download, proper PDF render) */}
                    <a
                      href={viewerUrl(file.path)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 md:flex-none flex items-center justify-center gap-2
                                 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                      style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#334155"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#1e293b"; }}
                    >
                      <Eye className="w-4 h-4" /> View
                    </a>

                    {/* DOWNLOAD — direct Cloudinary URL, forces download */}
                    <a
                      href={file.path}
                      download={file.name}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 md:flex-none flex items-center justify-center gap-2
                                 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                      style={{ background: "#4f46e5", color: "white", boxShadow: "0 4px 15px rgba(79,70,229,0.4)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#4338ca"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#4f46e5"; }}
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PYPSelection;