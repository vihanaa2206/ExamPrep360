// src/components/SidebarFilters.jsx
import React from 'react';
import { BookOpenText } from 'lucide-react'; // Ek chhota sa icon use karne ke liye

const SidebarFilters = ({ setFilter, activeFilter }) => {
  const categories = [
    "All", "Engineering", "Medical", "Government Exams", 
    "Management", "Law", "Computer Science"
  ];

  return (
    <aside className="w-64 bg-white border-r border-border-light p-6 min-h-screen sticky top-[80px]">
      <div className="flex items-center gap-3 mb-8 border-b border-border-light pb-4">
        <BookOpenText className="w-7 h-7 text-primary-color" />
        <h3 className="text-xl font-extrabold text-text-dark">Quick Filters</h3>
      </div>
      
      <div className="space-y-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`w-full text-left px-5 py-3 rounded-xl transition-all flex items-center gap-2
              ${activeFilter === cat 
                ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30' // Active State
                : 'text-text-light font-medium hover:bg-blue-50 hover:text-primary-color hover:shadow-inner' // Hover State
              }`}
          >
            {/* Chhota indicator bullet sirf tab dikhe jab active na ho */}
            {activeFilter !== cat && (
              <span className={`w-2 h-2 rounded-full ${activeFilter === cat ? 'bg-white' : 'bg-border-light'}`}></span>
            )}
            {cat}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default SidebarFilters;