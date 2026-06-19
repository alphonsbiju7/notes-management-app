import React from 'react';
import { Search, X, BookOpen, Calendar } from 'lucide-react';

const Navbar = ({ search, setSearch }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200/55 px-4 sm:px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5">
        <div className="bg-primary-600 text-white p-2 rounded-xl shadow-md shadow-primary-600/20">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">ElevateNotes</h1>
          <p className="hidden xs:block text-xs text-slate-500 font-medium">Your thoughts, organized</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4 sm:mx-8">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
          <input
            id="search-input"
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all duration-200"
          />
          {search && (
            <button
              id="clear-search-btn"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Side Stats/Date */}
      <div className="hidden md:flex items-center gap-4 text-slate-600 text-sm font-medium">
        <div className="flex items-center gap-1.5 bg-slate-100 py-2 px-3 rounded-lg border border-slate-200/20">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>{currentDate}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
