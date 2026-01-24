import { Link } from "react-router-dom";
import {
  ChevronDown,
  Search,
  MessageCircleQuestion,
  Share2,
  Menu,
} from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-blue-600">Exam</span>
              <span className="text-2xl font-bold text-orange-500">prep</span>
              <span className="text-2xl font-bold text-gray-900">360</span>
            </div>

            {/* Browse */}
            <button className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Browse by Stream
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Colleges, Exams, Schools & more"
                className="w-full px-4 py-2.5 pr-10 text-sm text-gray-700 placeholder:text-gray-400 bg-gray-100 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex flex-col items-center text-gray-500 hover:text-blue-600">
              <MessageCircleQuestion className="w-5 h-5" />
              <span className="text-xs">Ask</span>
            </button>

            <button className="hidden md:flex flex-col items-center text-gray-500 hover:text-blue-600">
              <Share2 className="w-5 h-5" />
              <span className="text-xs">Share</span>
            </button>

            {/* Login button navigates to /login */}
            <Link to="/login">
              <button className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700">
               Login
              </button>
            </Link>
            <button className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;