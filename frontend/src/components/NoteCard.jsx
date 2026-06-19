import React from 'react';
import { Calendar, Tag, Edit3, Trash2, Eye, Pin, Clipboard, Download } from 'lucide-react';

const colorClasses = {
  default: 'bg-white border-slate-200/60 hover:bg-slate-50/20',
  lavender: 'bg-purple-50/60 border-purple-200/50 hover:bg-purple-50/80 text-purple-950',
  sage: 'bg-emerald-50/60 border-emerald-200/50 hover:bg-emerald-50/80 text-emerald-950',
  sunset: 'bg-amber-50/60 border-amber-200/50 hover:bg-amber-50/80 text-amber-950',
  sky: 'bg-blue-50/60 border-blue-200/50 hover:bg-blue-50/80 text-blue-950',
  rose: 'bg-rose-50/60 border-rose-200/50 hover:bg-rose-50/80 text-rose-950'
};

const categoryBadgeClasses = {
  default: 'bg-slate-100 text-slate-600 border border-slate-200/30',
  lavender: 'bg-purple-100/70 text-purple-700 border border-purple-200/30',
  sage: 'bg-emerald-100/70 text-emerald-700 border border-emerald-200/30',
  sunset: 'bg-amber-100/70 text-amber-700 border border-amber-200/30',
  sky: 'bg-blue-100/70 text-blue-700 border border-blue-200/30',
  rose: 'bg-rose-100/70 text-rose-700 border border-rose-200/30'
};

const tagBadgeClasses = {
  default: 'bg-primary-50 text-primary-600 border border-primary-100/30',
  lavender: 'bg-white/80 text-purple-700 border border-purple-200/20',
  sage: 'bg-white/80 text-emerald-700 border border-emerald-200/20',
  sunset: 'bg-white/80 text-amber-700 border border-amber-200/20',
  sky: 'bg-white/80 text-blue-700 border border-blue-200/20',
  rose: 'bg-white/80 text-rose-700 border border-rose-200/20'
};

const NoteCard = ({ note, onOpenView, onOpenEdit, onOpenDelete, onTogglePin }) => {
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const colorTheme = note.color || 'default';

  // Copy to clipboard helper
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    alert('Note content copied to clipboard!');
  };

  // Export note as text helper
  const handleDownload = (e) => {
    e.stopPropagation();
    const element = document.createElement("a");
    const file = new Blob([`${note.title}\nCategory: ${note.category}\nDate: ${formattedDate}\n\n${note.content}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={`group relative flex flex-col justify-between p-5 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 animate-fade-in ${colorClasses[colorTheme]}`}>
      {/* Pin button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(note);
        }}
        className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-150 z-10 ${
          note.isPinned 
            ? 'bg-amber-100/90 text-amber-600 hover:bg-amber-200' 
            : 'opacity-0 group-hover:opacity-100 bg-slate-100/90 hover:bg-slate-200 text-slate-400 hover:text-slate-600'
        }`}
        title={note.isPinned ? "Unpin Note" : "Pin Note"}
      >
        <Pin className={`h-3.5 w-3.5 ${note.isPinned ? 'fill-amber-600' : ''}`} />
      </button>

      <div>
        {/* Top Header: Category and Date */}
        <div className="flex items-center justify-between gap-2 mb-3.5 pr-6">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${categoryBadgeClasses[colorTheme]}`}>
            {note.category || 'General'}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
        </div>

        {/* Note Title */}
        <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1 pr-6">
          {note.title}
        </h3>

        {/* Truncated Body Content */}
        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3 break-words">
          {note.content}
        </p>
      </div>

      <div>
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-medium ${tagBadgeClasses[colorTheme]}`}
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer: Action Buttons */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100/50">
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              title="Copy to clipboard"
              className="p-2 rounded-xl bg-slate-50/50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all duration-150"
            >
              <Clipboard className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDownload}
              title="Export note as TXT"
              className="p-2 rounded-xl bg-slate-50/50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all duration-150"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenView(note)}
              title="View Details"
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all duration-150"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onOpenEdit(note)}
              title="Edit Note"
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-primary-600 transition-all duration-150"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onOpenDelete(note)}
              title="Delete Note"
              className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all duration-150"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
