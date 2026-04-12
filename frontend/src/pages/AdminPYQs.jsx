import { useState, useEffect, useRef } from "react";
import {
  Upload, Trash2, Eye, FolderPlus, Search,
  FileText, RefreshCw, X, FolderOpen, Download,
  CheckCircle, AlertCircle, Edit2, Filter,
} from "lucide-react";

const API = "http://127.0.0.1:5000/api";

const CATEGORY_MAP = {
  "COMEDK UGET":"Engineering","Jee Advanced":"Engineering","Jee Main":"Engineering",
  "Jee Main With Solutions":"Engineering","KCET":"Engineering","MHT CET":"Engineering",
  "SRMJEEE":"Engineering","VITEEE":"Engineering","WBJEE":"Engineering","BITSAT":"Engineering",
  "NEET UG":"Medical","NEET PG":"Medical","JIPMER":"Medical","AFMC":"Medical",
  "GATE CS":"Computer Science","NIMCET":"Computer Science","CUET PG":"Computer Science",
  "IIT JAM":"Computer Science","TANCET":"Computer Science",
  "CLAT":"Law","AILET":"Law","DU LLB":"Law","AP LAWCET":"Law",
  "CAT":"Management","CMAT":"Management","MAT":"Management","NMAT":"Management","XAT":"Management",
  "IBPS PO":"Government","RRB NTPC":"Government","SSC CGL":"Government","UPSC CSE":"Government",
};

const CAT_COLORS = {
  Engineering:"bg-blue-100 text-blue-700",
  Medical:"bg-green-100 text-green-700",
  Management:"bg-purple-100 text-purple-700",
  "Computer Science":"bg-cyan-100 text-cyan-700",
  Law:"bg-amber-100 text-amber-700",
  Government:"bg-red-100 text-red-700",
  Other:"bg-slate-100 text-slate-600",
};

// Extract year from filename like "JEE_2023.pdf" or "2022_paper.pdf"
const extractYear = (name) => {
  const m = name.match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : null;
};

export default function AdminPYQs() {
  const [exams, setExams]             = useState([]);
  const [selExam, setSelExam]         = useState("");
  const [files, setFiles]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [search, setSearch]           = useState("");
  const [yearFilter, setYearFilter]   = useState("all");
  const [catFilter, setCatFilter]     = useState("all");
  const [examSearch, setExamSearch]   = useState("");
  const [toast, setToast]             = useState(null);
  const [newFolder, setNewFolder]     = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [dragOver, setDragOver]       = useState(false);
  const [renaming, setRenaming]       = useState(null); // {filename, newName}
  const fileRef = useRef(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchExams = () =>
    fetch(`${API}/pyq/exams`).then(r=>r.json()).then(setExams).catch(()=>{});

  const fetchFiles = (exam) => {
    if (!exam) return;
    setLoading(true);
    fetch(`${API}/pyq/files/${encodeURIComponent(exam)}`)
      .then(r=>r.json())
      .then(data => { setFiles(data); setLoading(false); })
      .catch(()=>setLoading(false));
  };

  useEffect(() => { fetchExams(); }, []);

  // ── Upload ──────────────────────────────────────────────────────────────
  const handleUpload = async (selectedFiles) => {
    if (!selectedFiles.length || !selExam) return;
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(f => formData.append("files", f));
    formData.append("exam_name", selExam);
    try {
      const res = await fetch(`${API}/pyq/upload`, { method:"POST", body:formData });
      if (res.ok) {
        const data = await res.json();
        showToast(`${data.files?.length||0} file(s) uploaded! ✅`);
        fetchFiles(selExam);
      } else showToast("Upload failed","error");
    } catch { showToast("Network error","error"); }
    setUploading(false);
  };

  const handleFileInput = (e) => {
    handleUpload(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f=>f.name.toLowerCase().endsWith(".pdf"));
    if (dropped.length) handleUpload(dropped);
    else showToast("Only PDF files allowed","error");
  };

  // ── Delete file ─────────────────────────────────────────────────────────
  const handleDeleteFile = async (filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    try {
      const res = await fetch(`${API}/pyq/delete`, {
        method:"DELETE", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ exam_name:selExam, filename }),
      });
      if (res.ok) { showToast("File deleted!"); fetchFiles(selExam); }
      else showToast("Delete failed","error");
    } catch { showToast("Network error","error"); }
  };

  // ── Rename file ─────────────────────────────────────────────────────────
  const handleRename = async () => {
    if (!renaming || !renaming.newName.trim()) return;
    let newName = renaming.newName.trim();
    if (!newName.toLowerCase().endsWith(".pdf")) newName += ".pdf";
    try {
      const res = await fetch(`${API}/pyq/rename`, {
        method:"PUT", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ exam_name:selExam, old_name:renaming.filename, new_name:newName }),
      });
      if (res.ok) {
        showToast("File renamed!");
        setRenaming(null);
        fetchFiles(selExam);
      } else {
        const d = await res.json();
        showToast(d.error || "Rename failed","error");
      }
    } catch { showToast("Network error","error"); }
  };

  // ── Create folder ───────────────────────────────────────────────────────
  const handleCreateFolder = async () => {
    if (!newFolder.trim()) return showToast("Enter folder name","error");
    try {
      const res = await fetch(`${API}/pyq/create-folder`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ exam_name:newFolder.trim() }),
      });
      if (res.ok) {
        showToast(`Folder "${newFolder}" created!`);
        setNewFolder(""); setShowNewFolder(false);
        fetchExams();
      } else {
        const d = await res.json();
        showToast(d.error||"Failed","error");
      }
    } catch { showToast("Network error","error"); }
  };

  // ── Delete folder ───────────────────────────────────────────────────────
  const handleDeleteFolder = async () => {
    if (!window.confirm(`Delete "${selExam}" folder and ALL its PDFs? Cannot be undone!`)) return;
    try {
      const res = await fetch(`${API}/pyq/delete-folder`, {
        method:"DELETE", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ exam_name:selExam }),
      });
      if (res.ok) {
        showToast(`"${selExam}" deleted!`);
        setSelExam(""); setFiles([]); fetchExams();
      } else showToast("Delete failed","error");
    } catch { showToast("Network error","error"); }
  };

  // ── Filter files ────────────────────────────────────────────────────────
  const allYears = [...new Set(files.map(f => extractYear(f.name)).filter(Boolean))].sort((a,b)=>b-a);

  const filtered = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchYear   = yearFilter === "all" || extractYear(f.name) === yearFilter;
    return matchSearch && matchYear;
  });

  // ── Group exams by category, with search ───────────────────────────────
  const filteredExams = exams.filter(e =>
    e.toLowerCase().includes(examSearch.toLowerCase()) &&
    (catFilter === "all" || (CATEGORY_MAP[e]||"Other") === catFilter)
  );

  const grouped = {};
  filteredExams.forEach(exam => {
    const cat = CATEGORY_MAP[exam] || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(exam);
  });

  return (
    <div className="min-h-screen bg-slate-50 p-5 space-y-5">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2
          ${toast.type==="error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
          {toast.type==="error" ? <AlertCircle className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
          {toast.msg}
        </div>
      )}

      {/* Rename modal */}
      {renaming && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-black text-slate-800 text-lg mb-1">Rename File</h3>
            <p className="text-xs text-slate-400 mb-4">Current: {renaming.filename}</p>
            <input value={renaming.newName}
              onChange={e => setRenaming({ ...renaming, newName: e.target.value })}
              placeholder="New filename (without .pdf)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 mb-4"
              onKeyDown={e => e.key==="Enter" && handleRename()}
              autoFocus />
            <div className="flex gap-3">
              <button onClick={() => setRenaming(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleRename}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700">
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New folder modal */}
      {showNewFolder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-black text-slate-800 text-lg mb-1">Create Exam Folder</h3>
            <p className="text-sm text-slate-400 mb-4">Enter the exact exam name</p>
            <input value={newFolder} onChange={e => setNewFolder(e.target.value)}
              placeholder="e.g. NEET UG"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 mb-4"
              onKeyDown={e => e.key==="Enter" && handleCreateFolder()}
              autoFocus />
            <div className="flex gap-3">
              <button onClick={() => { setShowNewFolder(false); setNewFolder(""); }}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleCreateFolder}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-500"/> PYQ Management
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Upload and manage Previous Year Question Papers</p>
        </div>
        <button onClick={() => setShowNewFolder(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          <FolderPlus className="w-4 h-4"/> New Exam Folder
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">

        {/* LEFT: Exam folders */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Exam Folders</h3>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{exams.length}</span>
            </div>

            {/* Exam search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400"/>
              <input value={examSearch} onChange={e => setExamSearch(e.target.value)}
                placeholder="Search exams..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none"/>
            </div>

            {/* Category filter */}
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs outline-none bg-white">
              <option value="all">All Categories</option>
              {Object.keys(CAT_COLORS).filter(c=>c!=="Other").map(c=>(
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="overflow-y-auto max-h-[500px]">
            {Object.entries(grouped).length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-10">No folders found</p>
            ) : Object.entries(grouped).map(([cat, catExams]) => (
              <div key={cat}>
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[cat]||CAT_COLORS.Other}`}>{cat}</span>
                </div>
                {catExams.map(exam => (
                  <button key={exam}
                    onClick={() => { setSelExam(exam); fetchFiles(exam); setSearch(""); setYearFilter("all"); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition border-b border-slate-50
                      ${selExam===exam ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-700"}`}>
                    <FolderOpen className={`w-4 h-4 flex-shrink-0 ${selExam===exam ? "text-indigo-500" : "text-amber-500"}`}/>
                    <span className="text-sm font-medium truncate">{exam}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Files panel */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {!selExam ? (
            <div className="flex flex-col items-center justify-center h-72 text-slate-300">
              <FolderOpen className="w-16 h-16 mb-3 opacity-40"/>
              <p className="font-semibold text-slate-400">Select an exam folder</p>
              <p className="text-sm text-slate-300 mt-1">to manage its PDFs</p>
            </div>
          ) : (
            <>
              {/* Files header */}
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="font-black text-slate-800">{selExam}</h3>
                    <p className="text-xs text-slate-400">{files.length} files total · {filtered.length} shown</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => fetchFiles(selExam)}
                      className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500"/>
                    </button>
                    <button onClick={handleDeleteFolder}
                      className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100">
                      <Trash2 className="w-3.5 h-3.5"/> Delete Folder
                    </button>
                  </div>
                </div>

                {/* Search + Year filter */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400"/>
                    <input value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Search files..."
                      className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none"/>
                  </div>
                  <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs outline-none bg-white">
                    <option value="all">All Years</option>
                    {allYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                {/* Drop zone */}
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-3 flex items-center justify-center gap-3 cursor-pointer transition
                    ${dragOver ? "border-indigo-500 bg-indigo-50" : "border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50"}`}>
                  {uploading
                    ? <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin"/>
                    : <Upload className="w-4 h-4 text-indigo-500"/>}
                  <div>
                    <p className="text-sm font-bold text-indigo-600">
                      {uploading ? "Uploading..." : dragOver ? "Drop PDFs here!" : "Click or Drag & Drop PDFs"}
                    </p>
                    <p className="text-xs text-slate-400">Multiple files · PDF only</p>
                  </div>
                </div>
                <input ref={fileRef} type="file" multiple accept=".pdf" className="hidden" onChange={handleFileInput}/>
              </div>

              {/* Files list */}
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-7 h-7 text-indigo-300 animate-spin mx-auto mb-2"/>
                  <p className="text-slate-400 text-sm">Loading files...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3"/>
                  <p className="text-slate-500 font-semibold text-sm">No PDFs found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {yearFilter !== "all" ? `No files for year ${yearFilter}` : "Upload PDFs using the area above"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                  {filtered.map((file, i) => {
                    const year = extractYear(file.name);
                    return (
                      <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition group">
                        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-red-500"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {file.name.replace(/\.pdf$/i, "")}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">{file.size_kb} KB</span>
                            {year && <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-semibold">{year}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <a href={file.path} target="_blank" rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="View">
                            <Eye className="w-4 h-4"/>
                          </a>
                          <a href={file.path} download={file.name}
                            className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition" title="Download">
                            <Download className="w-4 h-4"/>
                          </a>
                          <button onClick={() => setRenaming({ filename: file.name, newName: file.name.replace(/\.pdf$/i,"") })}
                            className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition" title="Rename">
                            <Edit2 className="w-4 h-4"/>
                          </button>
                          <button onClick={() => handleDeleteFile(file.name)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}