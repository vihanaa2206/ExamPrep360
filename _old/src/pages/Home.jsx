import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT TEXT */}
          <div>
            <h2 className="text-5xl font-bold text-gray-800 leading-tight">
              Discover Exams, Courses & Colleges
            </h2>

            <p className="mt-6 text-gray-600 text-lg">
              Get complete guidance for competitive exams like JEE, NEET, CAT,
              Government Exams and more.
            </p>

            <div className="mt-8 flex gap-4">
              <input
                type="text"
                placeholder="Search exams, courses..."
                className="w-full px-5 py-4 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="bg-blue-600 text-white px-8 rounded-lg hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>

          {/* RIGHT CARDS */}
          <div className="grid grid-cols-2 gap-6">
            {[
              "Engineering Exams",
              "Medical Exams",
              "Management Exams",
              "Government Exams",
            ].map((title) => (
              <div
                key={title}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Explore syllabus, dates, eligibility & preparation tips
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Home;
