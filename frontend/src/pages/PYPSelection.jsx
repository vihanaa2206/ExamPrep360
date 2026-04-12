import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, ArrowLeft, Search, AlertCircle } from 'lucide-react';

const API = "http://127.0.0.1:5000/api";

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

  // Clean display name — remove .pdf extension
  const displayName = (filename) => filename.replace(/\.pdf$/i, "");

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 font-bold mb-6 hover:text-blue-800 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">{decodedExam}</h1>
              <p className="text-gray-500 text-sm">Official Previous Year Question Papers</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-5">
            <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search papers by year or name..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200
                         rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Files list */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
            <p className="text-gray-400 text-sm">Loading papers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-xl font-bold text-gray-600 mb-2">No Papers Found</p>
            <p className="text-sm text-gray-400">
              {files.length === 0
                ? `No PDF files found in public/pdfs/${decodedExam}/ folder`
                : "No papers match your search"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 font-medium">
              {filtered.length} paper{filtered.length !== 1 ? "s" : ""} found
            </p>

            {filtered.map((file, i) => (
              <div key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm
                           hover:border-blue-300 hover:shadow-lg transition-all duration-300 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                  {/* File info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        {displayName(file.name)}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        PDF · {file.size_kb} KB
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 w-full md:w-auto">
                    {/* VIEW */}
                    <a
                      href={file.path}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 md:flex-none flex items-center justify-center gap-2
                                 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold
                                 text-sm hover:bg-gray-200 transition-all"
                    >
                      <Eye className="w-4 h-4" /> View
                    </a>

                    {/* DOWNLOAD */}
                    <a
                      href={file.path}
                      download={file.name}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2
                                 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold
                                 text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
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