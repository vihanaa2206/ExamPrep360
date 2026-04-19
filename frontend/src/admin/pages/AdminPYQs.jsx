// src/admin/pages/AdminPYQs.jsx
import { useState, useEffect, useRef } from "react";
import {
  Upload, Trash2, Eye, FolderPlus, Search,
  FileText, RefreshCw, X, FolderOpen, Download,
  CheckCircle, AlertCircle,
} from "lucide-react";

const API = "https://examprep360-production.up.railway.app/api";

const CATEGORY_MAP = {
  "COMEDK UGET":"Engineering","Jee Advanced":"Engineering","Jee Main":"Engineering",
  "Jee Main With Solutions":"Engineering","KCET":"Engineering","MHT CET":"Engineering",
  "SRMJEEE":"Engineering","VITEEE":"Engineering","WBJEE":"Engineering",
  "NEET UG":"Medical","NEET PG":"Medical","JIPMER":"Medical","AFMC":"Medical",
  "GATE CS":"Computer Science","NIMCET":"Computer Science","CUET PG":"Computer Science",
  "IIT JAM":"Computer Science","TANCET":"Computer Science",
  "CLAT":"Law","AILET":"Law","DU LLB":"Law","AP LAWCET":"Law",
  "CAT":"Management","CMAT":"Management","MAT":"Management","NMAT":"Management","XAT":"Management",
  "IBPS PO":"Government","RRB NTPC":"Government","SSC CGL":"Government","UPSC CSE":"Government",
};

const CAT_COLORS = {
  Engineering:"bg-blue-100 text-blue-700", Medical:"bg-green-100 text-green-700",
  Management:"bg-purple-100 text-purple-700", "Computer Science":"bg-cyan-100 text-cyan-700",
  Law:"bg-amber-100 text-amber-700", Government:"bg-red-100 text-red-700",
};

export default function AdminPYQs() {
  const [exams, setExams]         = useState([]);
  const [selExam, setSelExam]     = useState("");
  const [files, setFiles]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [search, setSearch]       = useState("");
  const [toast, setToast]         = useState(null);
  const [newFolder, setNewFolder] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const fileRef = useRef(null);

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null),3500);
  };

  const fetchExams = () => {
    fetch(`${API}/pyq/exams`).then(r=>r.json()).then(setExams).catch(()=>{});
  };

  const fetchFiles = (exam) => {
    if(!exam) return;
    setLoading(true);
    fetch(`${API}/pyq/files/${encodeURIComponent(exam)}`)
      .then(r=>r.json())
      .then(data=>{setFiles(data);setLoading(false);})
      .catch(()=>setLoading(false));
  };

  useEffect(()=>{fetchExams();},[]);

  const handleUpload = async (selectedFiles) => {
    if(!selectedFiles.length||!selExam) return;
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(f=>formData.append("files",f));
    formData.append("exam_name",selExam);
    try {
      const res = await fetch(`${API}/pyq/upload`,{method:"POST",body:formData});
      if(res.ok){
        const data = await res.json();
        showToast(`${data.files?.length||0} file(s) uploaded! ✅`);
        fetchFiles(selExam);
      } else showToast("Upload failed","error");
    } catch { showToast("Network error","error"); }
    setUploading(false);
  };

  const handleFileInput = (e) => {
    handleUpload(Array.from(e.target.files));
    e.target.value="";
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f=>f.name.toLowerCase().endsWith(".pdf"));
    if(dropped.length) handleUpload(dropped);
    else showToast("Only PDF files allowed","error");
  };

  const handleDeleteFile = async (filename) => {
    if(!window.confirm(`Delete "${filename}"?`)) return;
    try {
      const res = await fetch(`${API}/pyq/delete`,{
        method:"DELETE", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({exam_name:selExam,filename}),
      });
      if(res.ok){showToast("File deleted!"); fetchFiles(selExam);}
      else showToast("Delete failed","error");
    } catch { showToast("Network error","error"); }
  };

  const handleCreateFolder = async () => {
    if(!newFolder.trim()) return showToast("Enter folder name","error");
    try {
      const res = await fetch(`${API}/pyq/create-folder`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({exam_name:newFolder.trim()}),
      });
      if(res.ok){
        showToast(`Folder "${newFolder}" created! ✅`);
        setNewFolder(""); setShowNewFolder(false);
        fetchExams();
      } else {
        const d = await res.json();
        showToast(d.error||"Failed","error");
      }
    } catch { showToast("Network error","error"); }
  };

  const handleDeleteFolder = async () => {
    if(!window.confirm(`Delete "${selExam}" folder and ALL its PDFs? This cannot be undone!`)) return;
    try {
      const res = await fetch(`${API}/pyq/delete-folder`,{
        method:"DELETE", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({exam_name:selExam}),
      });
      if(res.ok){
        showToast(`"${selExam}" deleted!`);
        setSelExam(""); setFiles([]); fetchExams();
      } else showToast("Delete failed","error");
    } catch { showToast("Network error","error"); }
  };

  const filtered = files.filter(f=>f.name.toLowerCase().includes(search.toLowerCase()));

  // Group exams by category
  const grouped = {};
  exams.forEach(exam=>{
    const cat = CATEGORY_MAP[exam]||"Other";
    if(!grouped[cat]) grouped[cat]=[];
    grouped[cat].push(exam);
  });

  return (
    <div className="space-y-5">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2
          ${toast.type==="error"?"bg-red-500 text-white":"bg-green-500 text-white"}`}>
          {toast.type==="error"?<AlertCircle className="w-4 h-4"/>:<CheckCircle className="w-4 h-4"/>}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-500"/> PYQ Management
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Upload and manage Previous Year Question Papers</p>
        </div>
        <button onClick={()=>setShowNewFolder(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600
                     text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg shadow-blue-200">
          <FolderPlus className="w-4 h-4"/> New Exam Folder
        </button>
      </div>

      {/* New folder modal */}
      {showNewFolder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="font-black text-gray-900 text-lg mb-1">Create Exam Folder</h3>
            <p className="text-sm text-gray-400 mb-4">Enter the exact exam name for the folder</p>
            <input value={newFolder} onChange={e=>setNewFolder(e.target.value)}
              placeholder="e.g. NEET UG"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 mb-4"
              onKeyDown={e=>e.key==="Enter"&&handleCreateFolder()}
              autoFocus/>
            <div className="flex gap-3">
              <button onClick={()=>{setShowNewFolder(false);setNewFolder("");}}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleCreateFolder}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5">

        {/* LEFT: Exam folders */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Exam Folders</h3>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
              {exams.length}
            </span>
          </div>

          <div className="overflow-y-auto max-h-[520px]">
            {Object.entries(grouped).map(([cat,catExams])=>(
              <div key={cat}>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[cat]||"bg-gray-100 text-gray-600"}`}>
                    {cat}
                  </span>
                </div>
                {catExams.map(exam=>(
                  <button key={exam}
                    onClick={()=>{setSelExam(exam);fetchFiles(exam);setSearch("");}}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition border-b border-gray-50
                      ${selExam===exam?"bg-blue-50 text-blue-700":"hover:bg-gray-50 text-gray-700"}`}>
                    <FolderOpen className={`w-4 h-4 flex-shrink-0 ${selExam===exam?"text-blue-500":"text-yellow-500"}`}/>
                    <span className="text-sm font-medium truncate">{exam}</span>
                  </button>
                ))}
              </div>
            ))}
            {exams.length===0&&(
              <p className="text-center text-gray-400 text-sm py-10">No folders yet</p>
            )}
          </div>
        </div>

        {/* RIGHT: Files panel */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {!selExam ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-300">
              <FolderOpen className="w-16 h-16 mb-3 opacity-50"/>
              <p className="font-semibold text-gray-400">Select an exam folder</p>
              <p className="text-sm text-gray-300 mt-1">to view and manage PDFs</p>
            </div>
          ) : (
            <>
              {/* Files header */}
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                  <div>
                    <h3 className="font-black text-gray-900">{selExam}</h3>
                    <p className="text-xs text-gray-400">{files.length} files</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400"/>
                      <input value={search} onChange={e=>setSearch(e.target.value)}
                        placeholder="Search files..."
                        className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none w-36"/>
                    </div>
                    <button onClick={()=>fetchFiles(selExam)}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="w-3.5 h-3.5 text-gray-500"/>
                    </button>
                    <button onClick={handleDeleteFolder}
                      className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100">
                      <Trash2 className="w-3.5 h-3.5"/> Delete Folder
                    </button>
                  </div>
                </div>

                {/* Drop zone */}
                <div
                  onClick={()=>fileRef.current?.click()}
                  onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-3
                             cursor-pointer transition
                    ${dragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-blue-200 hover:border-blue-400 hover:bg-blue-50"}`}>
                  {uploading
                    ? <RefreshCw className="w-5 h-5 text-blue-500 animate-spin"/>
                    : <Upload className="w-5 h-5 text-blue-500"/>}
                  <div>
                    <p className="text-sm font-bold text-blue-600">
                      {uploading ? "Uploading..." : dragOver ? "Drop PDFs here!" : "Click or Drag & Drop PDFs"}
                    </p>
                    <p className="text-xs text-gray-400">Multiple files supported</p>
                  </div>
                </div>
                <input ref={fileRef} type="file" multiple accept=".pdf" className="hidden" onChange={handleFileInput}/>
              </div>

              {/* Files list */}
              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 text-blue-300 animate-spin mx-auto mb-2"/>
                  <p className="text-gray-400 text-sm">Loading files...</p>
                </div>
              ) : filtered.length===0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3"/>
                  <p className="text-gray-500 font-semibold text-sm">No PDFs found</p>
                  <p className="text-xs text-gray-400 mt-1">Upload PDFs using the area above</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[370px] overflow-y-auto">
                  {filtered.map((file,i)=>(
                    <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition group">
                      <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-red-500"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {file.name.replace(/\.pdf$/i,"")}
                        </p>
                        <p className="text-xs text-gray-400">{file.size_kb} KB · PDF</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <a href={file.path} target="_blank" rel="noreferrer"
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="View">
                          <Eye className="w-4 h-4"/>
                        </a>
                        <a href={file.path} download={file.name}
                          className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition"
                          title="Download">
                          <Download className="w-4 h-4"/>
                        </a>
                        <button onClick={()=>handleDeleteFile(file.name)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}