import { useNavigate } from "react-router-dom";

// ── Login check helper ────────────────────────────────────────
const isLoggedIn = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return false;
    const parsed = JSON.parse(user);
    return !!(parsed?._id || parsed?.id || parsed?.email);
  } catch { return false; }
};

export default function BrowseMenu() {
  const navigate = useNavigate();

  const streams = [
    "Engineering",
    "Medical",
    "Management",
    "Computer Science",
    "Law",
    "Government Exams",
  ];

  const handleExplore = (stream) => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    navigate(`/stream/${stream.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-4xl font-bold text-center mb-4">
          Browse by Stream
        </h1>

        <p className="text-center text-gray-500 mb-14">
          Select your stream to explore exam resources.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {streams.map((stream) => (
            <div
              key={stream}
              className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-semibold mb-6">
                {stream}
              </h2>

              <button
                onClick={() => handleExplore(stream)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Explore Now
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
