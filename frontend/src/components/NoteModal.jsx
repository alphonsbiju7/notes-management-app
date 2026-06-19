import React, { useState, useEffect } from 'react';
import { X, Tag, Save, Pin, Eye, Clipboard, Download, FileText } from 'lucide-react';

const colors = [
  { name: 'default', bg: 'bg-white border-slate-300', label: 'Default' },
  { name: 'lavender', bg: 'bg-purple-50 border-purple-300', label: 'Lavender' },
  { name: 'sage', bg: 'bg-emerald-50 border-emerald-300', label: 'Sage' },
  { name: 'sunset', bg: 'bg-amber-50 border-amber-300', label: 'Sunset' },
  { name: 'sky', bg: 'bg-blue-50 border-blue-300', label: 'Sky' },
  { name: 'rose', bg: 'bg-rose-50 border-rose-300', label: 'Rose' },
];

const modalBackgroundColors = {
  default: 'bg-white',
  lavender: 'bg-purple-50/40',
  sage: 'bg-emerald-50/40',
  sunset: 'bg-amber-50/40',
  sky: 'bg-blue-50/40',
  rose: 'bg-rose-50/40',
};

const renderMarkdown = (text) => {
  if (!text) return '';
  
  // Escape HTML tags to prevent basic XSS
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks: ```code```
  html = html.replace(/```([\s\S]+?)```/g, (match, code) => {
    return `<pre class="bg-slate-800 text-slate-100 p-3.5 rounded-xl font-mono text-xs overflow-x-auto my-2.5">${code.trim()}</pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`\n]+?)`/g, '<code class="bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded font-mono text-xs font-semibold">$1</code>');

  // Headers: ### text, ## text, # text
  html = html.replace(/^### (.*?)$/gm, '<h5 class="text-sm font-extrabold text-slate-800 mt-3 mb-1 capitalize">$1</h5>');
  html = html.replace(/^## (.*?)$/gm, '<h4 class="text-base font-extrabold text-slate-800 mt-4 mb-1 capitalize">$1</h4>');
  html = html.replace(/^# (.*?)$/gm, '<h3 class="text-lg font-extrabold text-slate-800 mt-5 mb-1.5 capitalize">$1</h3>');

  // Bold: **text**
  html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  html = html.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

  // Bullet lists: - item, * item
  html = html.replace(/^\s*[\-\*]\s+(.*?)$/gm, '<li class="ml-4 list-disc text-sm text-slate-700 font-medium">$1</li>');

  // Convert newlines to breaks (if not in lists or block elements)
  html = html.split('\n').map(line => {
    if (line.startsWith('<li') || line.startsWith('<pre') || line.startsWith('</pre') || line.startsWith('<h')) {
      return line;
    }
    return line + '<br/>';
  }).join('\n');

  return html;
};

const NoteModal = ({ isOpen, onClose, mode, note, onSave, categories = [] }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [color, setColor] = useState('default');
  const [previewMarkdown, setPreviewMarkdown] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'view' || mode === 'edit') {
        setTitle(note?.title || '');
        setContent(note?.content || '');
        setCategory(note?.category || 'General');
        setTags(note?.tags || []);
        setIsPinned(note?.isPinned || false);
        setColor(note?.color || 'default');
      } else {
        // Create mode resets
        setTitle('');
        setContent('');
        setCategory('General');
        setTags([]);
        setIsPinned(false);
        setColor('default');
      }
      setTagInput('');
      setErrors({});
    }
  }, [isOpen, mode, note]);

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/,/g, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title}\n\n${content}`);
    alert('Note content copied to clipboard!');
  };

  const handleDownload = () => {
    const formattedDate = new Date(note?.createdAt || new Date()).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const element = document.createElement("a");
    const file = new Blob([`${title}\nCategory: ${category}\nDate: ${formattedDate}\n\n${content}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || 'General',
      tags,
      isPinned,
      color,
    });
  };

  const currentTheme = color || 'default';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh] ${modalBackgroundColors[currentTheme]}`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {mode === 'view' && 'View Note'}
            {mode === 'create' && 'Create New Note'}
            {mode === 'edit' && 'Edit Note'}
          </h2>
          <div className="flex items-center gap-1.5">
            {mode === 'view' && (
              <>
                <button
                  onClick={handleCopy}
                  title="Copy to clipboard"
                  className="p-2 rounded-lg hover:bg-slate-200/65 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Clipboard className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={handleDownload}
                  title="Export Note as TXT"
                  className="p-2 rounded-lg hover:bg-slate-200/65 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Download className="h-4.5 w-4.5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200/65 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View mode details */}
        {mode === 'view' ? (
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100/30 capitalize">
                    {category}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Created {new Date(note?.createdAt).toLocaleString()}
                  </span>
                </div>
                {note?.isPinned && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                    <Pin className="h-3 w-3 fill-amber-600" />
                    Pinned Note
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight break-words">
                {title}
              </h3>
            </div>

            {/* Note text content / Live Markdown Preview */}
            <div className="border border-slate-100 p-5 rounded-2xl bg-white shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-3.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Content</span>
                <button
                  onClick={() => setPreviewMarkdown(!previewMarkdown)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all"
                >
                  {previewMarkdown ? <FileText className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  <span>{previewMarkdown ? 'Show Plain Text' : 'Show Markdown Preview'}</span>
                </button>
              </div>

              {previewMarkdown ? (
                <div 
                  className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words font-medium markdown-preview"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
              ) : (
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
                  {content}
                </p>
              )}
            </div>

            {/* Tags block */}
            {tags.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/30"
                    >
                      <Tag className="h-3 w-3 text-slate-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Form for Create/Edit */
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
            <div className="p-6 space-y-4.5 flex-1">
              {/* Title Input & Pin toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="note-title-input"
                    type="text"
                    placeholder="Enter note title..."
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors({ ...errors, title: '' });
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border ${
                      errors.title ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200 focus:border-primary-500 focus:ring-primary-500/10'
                    } text-sm focus:outline-none focus:ring-4 transition-all duration-200`}
                  />
                  {errors.title && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.title}</p>}
                </div>
                
                {/* Pin Checkbox Button */}
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 self-stretch sm:self-auto justify-center ${
                    isPinned 
                      ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Pin className={`h-4 w-4 ${isPinned ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
                  <span>{isPinned ? 'Pinned' : 'Pin Note'}</span>
                </button>
              </div>

              {/* Grid: Category Selector & Add Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <input
                    id="note-category-input"
                    type="text"
                    list="existing-categories"
                    placeholder="e.g. Work, Personal, Shopping..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 text-sm transition-all duration-200 bg-white"
                  />
                  <datalist id="existing-categories">
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                {/* Tags input */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Tags (Press Enter or comma to add)
                  </label>
                  <input
                    id="note-tags-input"
                    type="text"
                    placeholder="e.g. urgent, idea..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 text-sm transition-all duration-200 bg-white"
                  />
                </div>
              </div>

              {/* Render Tag Pills */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-white border border-slate-200/50 rounded-xl shadow-inner">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-primary-600 border border-slate-200/50 shadow-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="rounded hover:bg-slate-200 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Color Selection row */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Theme Card Color
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      className={`h-7 w-7 rounded-full border-2 transition-all duration-150 relative ${c.bg} ${
                        color === c.name 
                          ? 'ring-2 ring-primary-500 ring-offset-2 scale-110 shadow-md' 
                          : 'hover:scale-105 border-slate-300'
                      }`}
                      title={c.label}
                    >
                      {color === c.name && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-primary-600 font-extrabold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Textarea */}
              <div className="flex-1 flex flex-col min-h-[180px]">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Content <span className="text-rose-500">*</span> (Supports Markdown)
                </label>
                <textarea
                  id="note-content-input"
                  placeholder="Start typing your note here... Use # Header, **bold**, *italic*, `code`, or - bullet items."
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) setErrors({ ...errors, content: '' });
                  }}
                  className={`w-full flex-1 min-h-[160px] px-4 py-3 rounded-xl border resize-none ${
                    errors.content ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200 focus:border-primary-500 focus:ring-primary-500/10'
                  } text-sm focus:outline-none focus:ring-4 transition-all duration-200 bg-white`}
                />
                {errors.content && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.content}</p>}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/50">
              <button
                id="cancel-modal-btn"
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 hover:text-slate-800 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                id="save-note-btn"
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-md shadow-primary-600/10 hover:shadow-primary-700/20 active:scale-95 transition-all duration-200"
              >
                <Save className="h-4 w-4" />
                <span>{mode === 'create' ? 'Create Note' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NoteModal;
