import React from 'react';
import { Plus, FolderOpen, Layers } from 'lucide-react';

const Sidebar = ({ categories, activeCategory, setActiveCategory, categoryCounts, onCreateNoteClick }) => {
  // Count how many notes are in each category from counts map
  const getCategoryCount = (categoryName) => {
    return categoryCounts[categoryName] || 0;
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200/50 flex flex-col h-auto md:h-[calc(100vh-73px)]">
      {/* Create Note Action */}
      <div className="p-4 md:p-6">
        <button
          id="new-note-btn"
          onClick={onCreateNoteClick}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary-600/10 hover:shadow-primary-700/20 active:scale-95 transition-all duration-200"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-x-auto md:overflow-y-auto px-4 pb-4 md:pb-6">
        <div className="hidden md:flex items-center gap-2 mb-3 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5" />
          <span>Categories</span>
        </div>

        <nav className="flex md:flex-col gap-1.5 md:gap-1 min-w-max md:min-w-0 pb-2 md:pb-0">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const count = getCategoryCount(category);

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex-shrink-0 md:flex-shrink ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderOpen className={`h-4.5 w-4.5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className="capitalize">{category}</span>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    isActive ? 'bg-primary-200/50 text-primary-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
