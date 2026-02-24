import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const CATEGORY_EXAMS = {
  engineering: [
    { name: "JEE Main", slug: "jee-main", date: "Jan & Apr 2026", level: "National", rating: 4.8, status: "Open" },
    { name: "JEE Advanced", slug: "jee-advanced", date: "June 2026", level: "National", rating: 4.7, status: "Upcoming" },
    { name: "BITSAT", slug: "bitsat", date: "May 2026", level: "National", rating: 4.6, status: "Upcoming" },
    { name: "VITEEE", slug: "viteee", date: "April 2026", level: "University", rating: 4.5, status: "Upcoming" },
    { name: "SRMJEEE", slug: "srmjeee", date: "April 2026", level: "University", rating: 4.4, status: "Upcoming" },
    { name: "COMEDK UGET", slug: "comedk", date: "May 2026", level: "State", rating: 4.3, status: "Upcoming" },
    { name: "WBJEE", slug: "wbjee", date: "April 2026", level: "State", rating: 4.2, status: "Upcoming" },
    { name: "MHT CET", slug: "mht-cet", date: "May 2026", level: "State", rating: 4.4, status: "Upcoming" },
    { name: "KCET", slug: "kcet", date: "April 2026", level: "State", rating: 4.3, status: "Upcoming" },
    { name: "AP EAMCET", slug: "ap-eamcet", date: "May 2026", level: "State", rating: 4.1, status: "Upcoming" },
  ],

  medical: [
    { name: "NEET UG", slug: "neet-ug", date: "May 2026", level: "National", rating: 4.9, status: "Upcoming" },
    { name: "NEET PG", slug: "neet-pg", date: "Jan 2026", level: "National", rating: 4.8, status: "Upcoming" },
    { name: "AIIMS MBBS", slug: "aiims-mbbs", date: "May 2026", level: "National", rating: 4.7, status: "Merged" },
    { name: "JIPMER", slug: "jipmer", date: "May 2026", level: "National", rating: 4.6, status: "Merged" },
    { name: "BHU UET", slug: "bhu-uet", date: "June 2026", level: "University", rating: 4.4, status: "Upcoming" },
    { name: "AFMC", slug: "afmc", date: "June 2026", level: "National", rating: 4.3, status: "Upcoming" },
    { name: "CMC Vellore", slug: "cmc", date: "May 2026", level: "University", rating: 4.2, status: "Upcoming" },
    { name: "KVPY", slug: "kvpy", date: "May 2026", level: "National", rating: 4.5, status: "Upcoming" },
    { name: "AMU MBBS", slug: "amu-mbbs", date: "June 2026", level: "University", rating: 4.3, status: "Upcoming" },
    { name: "IPU CET", slug: "ipu-cet-medical", date: "April 2026", level: "University", rating: 4.1, status: "Upcoming" },
  ],

  management: [
    { name: "CAT", slug: "cat", date: "Nov 2026", level: "National", rating: 4.9, status: "Upcoming" },
    { name: "XAT", slug: "xat", date: "Jan 2026", level: "National", rating: 4.7, status: "Upcoming" },
    { name: "CMAT", slug: "cmat", date: "May 2026", level: "National", rating: 4.5, status: "Upcoming" },
    { name: "MAT", slug: "mat", date: "Multiple", level: "National", rating: 4.4, status: "Open" },
    { name: "NMAT", slug: "nmat", date: "Oct 2026", level: "National", rating: 4.6, status: "Upcoming" },
    { name: "SNAP", slug: "snap", date: "Dec 2026", level: "National", rating: 4.5, status: "Upcoming" },
    { name: "IIFT", slug: "iift", date: "Dec 2026", level: "National", rating: 4.4, status: "Upcoming" },
    { name: "MICAT", slug: "micat", date: "Jan 2026", level: "Institute", rating: 4.3, status: "Upcoming" },
    { name: "TISSNET", slug: "tissnet", date: "Feb 2026", level: "National", rating: 4.2, status: "Upcoming" },
    { name: "IBSAT", slug: "ibsat", date: "Dec 2026", level: "Institute", rating: 4.1, status: "Upcoming" },
  ],

  "computer-science": [
    { name: "GATE CS", slug: "gate-cs", date: "Feb 2026", level: "National", rating: 4.8, status: "Upcoming" },
    { name: "NIMCET", slug: "nimcet", date: "June 2026", level: "National", rating: 4.6, status: "Upcoming" },
    { name: "CUET PG", slug: "cuet-pg-cs", date: "May 2026", level: "National", rating: 4.5, status: "Upcoming" },
    { name: "ISAT", slug: "isat", date: "June 2026", level: "National", rating: 4.3, status: "Upcoming" },
    { name: "PGCET CS", slug: "pgcet-cs", date: "July 2026", level: "State", rating: 4.2, status: "Upcoming" },
    { name: "IIIT PG Exam", slug: "iiit-pg", date: "June 2026", level: "Institute", rating: 4.4, status: "Upcoming" },
    { name: "TANCET CS", slug: "tancet-cs", date: "April 2026", level: "State", rating: 4.3, status: "Upcoming" },
    { name: "AP PGECET", slug: "ap-pgecet", date: "June 2026", level: "State", rating: 4.2, status: "Upcoming" },
    { name: "BITS HD", slug: "bits-hd", date: "May 2026", level: "Institute", rating: 4.5, status: "Upcoming" },
    { name: "ISI Admission Test", slug: "isi", date: "May 2026", level: "National", rating: 4.7, status: "Upcoming" },
  ],

  law: [
    { name: "CLAT", slug: "clat", date: "Dec 2026", level: "National", rating: 4.8, status: "Upcoming" },
    { name: "AILET", slug: "ailet", date: "Dec 2026", level: "National", rating: 4.7, status: "Upcoming" },
    { name: "LSAT India", slug: "lsat", date: "Jan 2026", level: "National", rating: 4.6, status: "Upcoming" },
    { name: "SLAT", slug: "slat", date: "May 2026", level: "Institute", rating: 4.4, status: "Upcoming" },
    { name: "MH CET Law", slug: "mh-cet-law", date: "April 2026", level: "State", rating: 4.3, status: "Upcoming" },
    { name: "AP LAWCET", slug: "ap-lawcet", date: "June 2026", level: "State", rating: 4.2, status: "Upcoming" },
    { name: "TS LAWCET", slug: "ts-lawcet", date: "June 2026", level: "State", rating: 4.2, status: "Upcoming" },
    { name: "DU LLB", slug: "du-llb", date: "June 2026", level: "University", rating: 4.5, status: "Upcoming" },
    { name: "PU LLB", slug: "pu-llb", date: "June 2026", level: "University", rating: 4.1, status: "Upcoming" },
    { name: "CUET LLB", slug: "cuet-llb", date: "May 2026", level: "National", rating: 4.4, status: "Upcoming" },
  ],

  commerce: [
  { name: "CA Foundation", slug: "ca-foundation", date: "June 2026", level: "National", rating: 4.7, status: "Upcoming" },
  { name: "CA Intermediate", slug: "ca-inter", date: "Nov 2026", level: "National", rating: 4.6, status: "Upcoming" },
  { name: "CA Final", slug: "ca-final", date: "May 2026", level: "National", rating: 4.8, status: "Upcoming" },
  { name: "CS Foundation", slug: "cs-foundation", date: "June 2026", level: "National", rating: 4.5, status: "Upcoming" },
  { name: "CS Executive", slug: "cs-executive", date: "Dec 2026", level: "National", rating: 4.4, status: "Upcoming" },
  { name: "CMA Foundation", slug: "cma-foundation", date: "June 2026", level: "National", rating: 4.3, status: "Upcoming" },
  { name: "CMA Inter", slug: "cma-inter", date: "Dec 2026", level: "National", rating: 4.2, status: "Upcoming" },
  { name: "CUET Commerce", slug: "cuet-commerce", date: "May 2026", level: "National", rating: 4.4, status: "Upcoming" },
  { name: "BBA Entrance", slug: "bba-entrance", date: "April 2026", level: "University", rating: 4.1, status: "Upcoming" },
  { name: "IPMAT", slug: "ipmat", date: "May 2026", level: "National", rating: 4.6, status: "Upcoming" },
],

design: [
  { name: "NIFT Entrance", slug: "nift", date: "Feb 2026", level: "National", rating: 4.8, status: "Upcoming" },
  { name: "NID DAT", slug: "nid-dat", date: "Jan 2026", level: "National", rating: 4.7, status: "Upcoming" },
  { name: "UCEED", slug: "uceed", date: "Jan 2026", level: "National", rating: 4.6, status: "Upcoming" },
  { name: "CEED", slug: "ceed", date: "Jan 2026", level: "National", rating: 4.5, status: "Upcoming" },
  { name: "MITID", slug: "mitid", date: "March 2026", level: "Institute", rating: 4.3, status: "Upcoming" },
  { name: "Pearl Academy", slug: "pearl", date: "April 2026", level: "Institute", rating: 4.2, status: "Upcoming" },
  { name: "UID Entrance", slug: "uid", date: "March 2026", level: "Institute", rating: 4.1, status: "Upcoming" },
  { name: "ISDI Challenge", slug: "isdi", date: "Feb 2026", level: "Institute", rating: 4.0, status: "Upcoming" },
  { name: "Srishti Entrance", slug: "srishti", date: "April 2026", level: "Institute", rating: 4.2, status: "Upcoming" },
  { name: "AIEED", slug: "aieed", date: "Jan 2026", level: "National", rating: 4.3, status: "Upcoming" },
],

"study-abroad": [
  { name: "IELTS", slug: "ielts", date: "All Year", level: "International", rating: 4.8, status: "Open" },
  { name: "TOEFL", slug: "toefl", date: "All Year", level: "International", rating: 4.7, status: "Open" },
  { name: "GRE", slug: "gre", date: "All Year", level: "International", rating: 4.6, status: "Open" },
  { name: "GMAT", slug: "gmat", date: "All Year", level: "International", rating: 4.5, status: "Open" },
  { name: "SAT", slug: "sat", date: "Multiple", level: "International", rating: 4.6, status: "Upcoming" },
  { name: "ACT", slug: "act", date: "Multiple", level: "International", rating: 4.4, status: "Upcoming" },
  { name: "PTE", slug: "pte", date: "All Year", level: "International", rating: 4.3, status: "Open" },
  { name: "Duolingo Test", slug: "duolingo", date: "All Year", level: "International", rating: 4.2, status: "Open" },
  { name: "LSAT Abroad", slug: "lsat-abroad", date: "Multiple", level: "International", rating: 4.1, status: "Upcoming" },
  { name: "MCAT", slug: "mcat", date: "Multiple", level: "International", rating: 4.4, status: "Upcoming" },
],

};


function CategoryExams() {
  const { category } = useParams();
  const exams = CATEGORY_EXAMS[category] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category} Exams
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.slug}
            className="bg-white rounded-lg border p-5 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {category}
              </span>
              <span className="text-sm font-semibold">⭐ {exam.rating}</span>
            </div>

            <h2 className="text-lg font-semibold mb-2">{exam.name}</h2>

            <p className="text-sm text-gray-600">📅 {exam.date}</p>
            <p className="text-sm text-gray-600 mb-3">🌐 {exam.level}</p>

            <div className="flex justify-between items-center">
              <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded">
                {exam.status}
              </span>

              <Link
                to={`/exam/${exam.slug}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryExams;
