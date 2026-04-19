import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  Search,
  MessageCircleQuestion,
  Share2,
  Menu,
  X,
  TrendingUp,
  Lock,
} from "lucide-react";

import AskModal from "./AskModal";
import ShareModal from "./ShareModal";
import BrowseDropdown from "./BrowseDropdown";
import ThemeToggle from "./ThemeToggle";

const SUGGESTIONS = [
  { label: "JEE Main 2026",        path: "/exam/jee-main",                tag: "Exam" },
  { label: "NEET UG 2026",         path: "/exam/neet-ug",                 tag: "Exam" },
  { label: "CAT 2026",             path: "/exam/cat",                     tag: "Exam" },
  { label: "GATE CS 2026",         path: "/exam/gate-cs",                 tag: "Exam" },
  { label: "UPSC CSE 2026",        path: "/exam/upsc",                    tag: "Exam" },
  { label: "CLAT 2026",            path: "/exam/clat",                    tag: "Exam" },
  { label: "SSC CGL 2026",         path: "/exam/ssc-cgl",                 tag: "Exam" },
  { label: "BITSAT 2026",          path: "/exam/bitsat",                  tag: "Exam" },
  { label: "IIT Bombay",           path: "/college/iit-bombay",           tag: "College" },
  { label: "IIT Delhi",            path: "/college/iit-delhi",            tag: "College" },
  { label: "AIIMS Delhi",          path: "/college/aiims-delhi",          tag: "College" },
  { label: "IIM Ahmedabad",        path: "/college/iim-ahmedabad",        tag: "College" },
  { label: "NIT Trichy",           path: "/college/nit-trichy",           tag: "College" },
  { label: "Engineering Colleges", path: "/colleges?category=Engineering", tag: "Category" },
  { label: "Medical Colleges",     path: "/colleges?category=Medical",     tag: "Category" },
  { label: "MBA Colleges",         path: "/colleges?category=Management",  tag: "Category" },
];

const TAG_COLORS = {
  Exam:     "bg-blue-100 text-blue-600",
  College:  "bg-green-100 text-green-600",
  Category: "bg-purple-100 text-purple-600",
};

const Header = () => {
  const [user, setUser]             = useState(null);
  const [open, setOpen]             = useState(false);
  const [showAsk, setShowAsk]       = useState(false);
  const [showShare, setShowShare]   = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [replyCount, setReplyCount] = useState(0);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("user");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocus(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { setReplyCount(0); return; }
    const u = JSON.parse(storedUser);
    if (!u?.email) return;
    const fetchCount = () => {
      fetch(`http://127.0.0.1:5000/ask/unread-count?email=${encodeURIComponent(u.email)}`)
        .then(r => r.json())
        .then(data => setReplyCount(data.count || 0))
        .catch(() => setReplyCount(0));
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setReplyCount(0);
    navigate("/login");
  };

  // ── Search: redirect to login if not logged in ────────────
  const handleSearchFocus = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setSearchFocus(true);
  };

  const handleSearch = (e) => {
    if (!isLoggedIn) return;
    if (e.key === "Enter" && searchTerm.trim()) {
      setSearchFocus(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSuggestionClick = (path) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    setSearchFocus(false);
    setSearchTerm("");
    navigate(path);
  };

  const handleSearchIconClick = () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (searchTerm.trim()) navigate(`/search?q=${searchTerm}`);
  };
  // ─────────────────────────────────────────────────────────

  const filtered = searchTerm.trim().length > 0
    ? SUGGESTIONS.filter(s => s.label.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 8)
    : SUGGESTIONS.slice(0, 6);

  return (
    <>
      <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: 'var(--bg-nav)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-1 cursor-pointer hover:opacity-90">
                <span className="text-2xl font-bold text-blue-600">Exam</span>
                <span className="text-2xl font-bold text-orange-500">prep</span>
                <span className="text-2xl font-bold text-gray-900">360</span>
              </Link>

              <div
                className="relative hidden lg:block"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <button className="flex items-center gap-2 text-sm font-medium text-gray-700 py-5">
                  Browse by Stream
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {isMenuOpen && <BrowseDropdown />}
              </div>
            </div>

            {/* SEARCH */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-8 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={isLoggedIn ? "Search Colleges, Exams, Schools & more" : "Login to search..."}
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg outline-none transition
                    ${!isLoggedIn
                      ? "bg-gray-100 cursor-pointer text-gray-400"
                      : searchFocus
                        ? "bg-white ring-2 ring-blue-200 border border-blue-200"
                        : "bg-gray-100 focus:ring-2 focus:ring-blue-100"
                    }`}
                  value={isLoggedIn ? searchTerm : ""}
                  onChange={(e) => isLoggedIn && setSearchTerm(e.target.value)}
                  onFocus={handleSearchFocus}
                  onKeyDown={handleSearch}
                  readOnly={!isLoggedIn}
                />
                {/* Right icon */}
                {isLoggedIn && searchTerm ? (
                  <button
                    onClick={() => { setSearchTerm(""); setSearchFocus(false); }}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : !isLoggedIn ? (
                  <Lock
                    className="absolute right-3 top-3 text-gray-400 w-4 h-4 cursor-pointer"
                    onClick={() => navigate("/login")}
                  />
                ) : (
                  <Search
                    className="absolute right-3 top-3 text-gray-400 w-4 h-4 cursor-pointer"
                    onClick={handleSearchIconClick}
                  />
                )}
              </div>

              {/* Dropdown — only when logged in */}
              {isLoggedIn && searchFocus && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200
                                rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {searchTerm.trim() ? "Search Results" : "Trending Searches"}
                    </span>
                  </div>
                  <div className="py-1">
                    {filtered.map((s) => (
                      <button
                        key={s.path}
                        onMouseDown={() => handleSuggestionClick(s.path)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Search className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                        <span className="text-sm text-gray-800 flex-1">{s.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${TAG_COLORS[s.tag]}`}>
                          {s.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                  {searchTerm.trim() && (
                    <div className="px-4 py-2.5 border-t border-gray-100">
                      <button
                        onMouseDown={() => {
                          setSearchFocus(false);
                          navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                        }}
                        className="text-sm text-blue-600 font-semibold hover:underline"
                      >
                        Search all results for "{searchTerm}" →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setShowAsk(true); setReplyCount(0); }}
                className="hidden md:flex flex-col items-center text-gray-500 hover:text-blue-600 transition"
              >
                <div className="relative">
                  <MessageCircleQuestion className="w-5 h-5" />
                  {replyCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {replyCount > 9 ? "9+" : replyCount}
                    </span>
                  )}
                </div>
                <span className="text-xs">Ask</span>
              </button>

              <button
                onClick={() => setShowShare(true)}
                className="hidden md:flex flex-col items-center text-gray-500 hover:text-blue-600 transition"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-xs">Share</span>
              </button>

              <ThemeToggle />

              {!user ? (
                <Link to="/login">
                  <button className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Login
                  </button>
                </Link>
              ) : (
                <div className="relative">
                  <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <div className="absolute right-0 top-10 w-56 bg-white border rounded-lg shadow-xl z-50 animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-3 text-sm text-gray-600 border-b font-medium">
                        {user.name || user.email}
                      </div>
                      <Link to="/profile" onClick={() => setOpen(false)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                        👤 My Profile
                      </Link>
                      <Link to="/mock-dashboard" onClick={() => setOpen(false)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 border-t">
                        📊 My Tests
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition border-t">
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button className="lg:hidden p-2">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {showAsk   && <AskModal   onClose={() => setShowAsk(false)} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </>
  );
};

export default Header;