export default function Careers() {
  const jobs = [
    { title:"Content Writer — Exams & Education",   type:"Full Time",  location:"New Delhi / Remote", dept:"Content" },
    { title:"Frontend Developer (React)",            type:"Full Time",  location:"New Delhi / Remote", dept:"Engineering" },
    { title:"Backend Developer (Python/Flask)",      type:"Full Time",  location:"New Delhi / Hybrid", dept:"Engineering" },
    { title:"SEO & Digital Marketing Executive",     type:"Full Time",  location:"New Delhi",          dept:"Marketing" },
    { title:"Education Counsellor",                  type:"Full Time",  location:"New Delhi / Remote", dept:"Student Relations" },
    { title:"Data Analyst",                          type:"Full Time",  location:"Remote",             dept:"Analytics" },
    { title:"Graphic Designer",                      type:"Internship", location:"Remote",             dept:"Design" },
    { title:"Content Intern — Competitive Exams",    type:"Internship", location:"Remote",             dept:"Content" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-3">Careers at ExamPrep360</h1>
          <p className="text-violet-100 text-sm max-w-xl mx-auto">
            Join our mission to empower millions of students across India.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[["🏠","Remote Friendly","Work from anywhere"],["💰","Competitive Pay","Market-leading CTC"],["📈","Fast Growth","Scale with us"],["🎯","Meaningful Work","Impact millions"]].map(([e,t,d]) => (
            <div key={t} className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
              <p className="text-3xl mb-2">{e}</p>
              <p className="font-bold text-gray-900 text-sm">{t}</p>
              <p className="text-xs text-gray-500 mt-1">{d}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Open Positions ({jobs.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {jobs.map((job, i) => (
              <div key={i} className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <p className="font-semibold text-gray-900">{job.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${job.type==="Internship"?"bg-orange-100 text-orange-700":"bg-green-100 text-green-700"}`}>{job.type}</span>
                    <span className="text-xs text-gray-500">📍 {job.location}</span>
                    <span className="text-xs text-gray-400">{job.dept}</span>
                  </div>
                </div>
                <a href="mailto:careers@examprep360.com"
                  className="flex-shrink-0 text-xs bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition">
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 bg-violet-50 border border-violet-200 rounded-xl p-5 text-center">
          <p className="text-sm text-gray-700">Don't see a suitable role? Email us at{" "}
            <a href="mailto:careers@examprep360.com" className="text-violet-600 font-semibold hover:underline">careers@examprep360.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

