// PATH: frontend/src/admin/pages/AdminAITraining.jsx
// NEW FILE — Admin uploads PDFs to train AI knowledge base

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, RefreshCw, FileText, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

const BASE = "https://examprep360-production.up.railway.app";

export default function AdminAITraining() {
  const [pdfs, setPdfs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // {filename, status}
  const [toast, setToast]         = useState(null);
  const fileRef                   = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => { loadPdfs(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadPdfs = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/ai-chat/pdfs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPdfs(Array.isArray(data) ? data : []);
    } catch {
      showToast("Could not load PDFs. Is the server running?", "error");
    } finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    fileRef.current.value = "";

    for (const file of files) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        showToast(`${file.name} — only PDF files allowed`, "error");
        continue;
      }
      setUploading(true);
      setUploadProgress({ filename: file.name, status: "uploading" });

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res  = await fetch(`${BASE}/api/ai-chat/upload-pdf`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();

        if (data.ok) {
          setUploadProgress({ filename: file.name, status: "done", chunks: data.chunks, pages: data.pages });
          showToast(`✅ ${file.name} uploaded! ${data.chunks} chunks, ${data.pages} pages`);
          await loadPdfs();
        } else {
          setUploadProgress({ filename: file.name, status: "error" });
          showToast(`❌ ${file.name}: ${data.error}`, "error");
        }
      } catch {
        setUploadProgress({ filename: file.name, status: "error" });
        showToast(`❌ Upload failed for ${file.name}`, "error");
      } finally {
        setUploading(false);
        setTimeout(() => setUploadProgress(null), 3000);
      }
    }
  };

  const deletePdf = async (id, filename) => {
    if (!window.confirm(`Delete "${filename}" and all its chunks?`)) return;
    try {
      const res = await fetch(`${BASE}/api/ai-chat/pdfs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        showToast(`🗑️ "${filename}" deleted`);
        setPdfs(prev => prev.filter(p => p._id !== id));
      } else {
        showToast(`Error: ${data.error}`, "error");
      }
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const totalChunks = pdfs.reduce((a, p) => a + (p.chunks || 0), 0);
  const totalPages  = pdfs.reduce((a, p) => a + (p.pages  || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-5">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2
          ${toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
          {toast.type === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-base">🧠</div>
            <h1 className="text-2xl font-black text-slate-900">AI Training</h1>
          </div>
          <p className="text-sm text-slate-400 ml-10">Upload exam PDFs to train the AI Study Assistant knowledge base</p>
        </div>
        <button onClick={loadPdfs}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "PDFs Uploaded",   value: pdfs.length,  icon: "📄", color: "from-violet-400 to-purple-500" },
          { label: "Total Pages",     value: totalPages,   icon: "📃", color: "from-blue-400 to-indigo-500"   },
          { label: "Knowledge Chunks",value: totalChunks,  icon: "🧩", color: "from-emerald-400 to-teal-500"  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-violet-200 shadow-sm p-8 mb-6 text-center hover:border-violet-400 transition">
        <input ref={fileRef} type="file" accept=".pdf" multiple className="hidden" onChange={handleUpload} />

        {uploading && uploadProgress ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-violet-500 animate-spin" />
            </div>
            <p className="font-black text-slate-800">Processing: {uploadProgress.filename}</p>
            <p className="text-sm text-slate-400">Extracting text, generating embeddings, saving to MongoDB...</p>
            <p className="text-xs text-violet-500 font-bold">This may take 30–60 seconds for large PDFs</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-7 h-7 text-violet-500" />
            </div>
            <h3 className="font-black text-slate-800 text-lg mb-2">Upload Exam PDFs</h3>
            <p className="text-slate-400 text-sm mb-6">
              Upload syllabus, exam pattern, marking scheme PDFs.<br />
              AI will learn from them and answer student questions.
            </p>
            <button onClick={() => fileRef.current?.click()}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition shadow-md">
              Choose PDF Files
            </button>
            <p className="text-xs text-slate-400 mt-3">Multiple files supported · Only .pdf files</p>
          </>
        )}
      </div>

      {/* Upload result flash */}
      {uploadProgress?.status === "done" && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800 text-sm">{uploadProgress.filename} — successfully ingested!</p>
            <p className="text-green-600 text-xs">{uploadProgress.chunks} chunks · {uploadProgress.pages} pages stored in MongoDB</p>
          </div>
        </div>
      )}

      {/* PDF List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-500" /> Knowledge Base ({pdfs.length} files)
          </h3>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-violet-300 animate-spin mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Loading...</p>
          </div>
        ) : pdfs.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-bold text-slate-400">No PDFs uploaded yet</p>
            <p className="text-slate-300 text-sm mt-1">Upload exam PDFs above to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pdfs.map(pdf => (
              <div key={pdf._id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate text-sm">{pdf.filename}</p>
                  <p className="text-xs text-slate-400">
                    {pdf.pages || 0} pages · {pdf.chunks || 0} chunks ·{" "}
                    {pdf.size_bytes ? `${(pdf.size_bytes / 1024).toFixed(0)} KB` : ""} ·{" "}
                    {pdf.uploadedAt ? new Date(pdf.uploadedAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                    ✅ Active
                  </span>
                  <button onClick={() => deletePdf(pdf._id, pdf.filename)}
                    className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-xl flex items-center justify-center transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}