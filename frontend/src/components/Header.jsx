import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Search,
  MessageCircleQuestion,
  Share2,
  Menu,
} from "lucide-react";

import AskModal from "./AskModal";
import ShareModal from "./ShareModal";

const Header = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO → CLICK = HOME */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-1 cursor-pointer hover:opacity-90"
              >
                <span className="text-2xl font-bold text-blue-600">Exam</span>
                <span className="text-2xl font-bold text-orange-500">prep</span>
                <span className="text-2xl font-bold text-gray-900">360</span>
              </Link>

              <button className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-700">
                Browse by Stream
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* SEARCH */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Colleges, Exams, Schools & more"
                  className="w-full px-4 py-2.5 pr-10 bg-gray-100 rounded-lg"
                />
                <Search className="absolute right-3 top-3 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-4">

              {/* ASK */}
              <button
                onClick={() => setShowAsk(true)}
                className="hidden md:flex flex-col items-center text-gray-500"
              >
                <MessageCircleQuestion className="w-5 h-5" />
                <span className="text-xs">Ask</span>
              </button>

              {/* SHARE */}
              <button
                onClick={() => setShowShare(true)}
                className="hidden md:flex flex-col items-center text-gray-500"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-xs">Share</span>
              </button>

              {!user ? (
                <Link to="/login">
                  <button className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg">
                    Login
                  </button>
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {open && (
                    <div className="absolute right-0 top-10 w-56 bg-white border rounded-lg shadow-lg">
                      <div className="px-4 py-2 text-sm text-gray-600 border-b">
                        {user.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button className="lg:hidden p-2">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MODALS */}
      {showAsk && <AskModal onClose={() => setShowAsk(false)} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </>
  );
};

export default Header;
