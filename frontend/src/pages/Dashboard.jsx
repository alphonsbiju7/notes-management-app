import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { noteService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { FileText, Loader2, Sparkles, FolderDot } from 'lucide-react';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedNote, setSelectedNote] = useState(null);

  // Confirmation modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const toast = useToast();

  // Fetch all notes (incorporating search + category filter)
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await noteService.getNotes(search, activeCategory);
      setNotes(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load notes. Please make sure the backend is active.');
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory, toast]);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchNotes();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search, activeCategory, fetchNotes]);

  // Dynamically update unique category list and counts from notes list
  const fetchCategoriesList = useCallback(async () => {
    try {
      // Get all notes raw to compute total categories (without the current activeCategory filters)
      const allNotesRaw = await noteService.getNotes('', 'All');
      const uniqueCats = ['All', ...new Set(allNotesRaw.map((n) => n.category || 'General').filter(Boolean))];
      setCategories(uniqueCats);

      // Compute static counts per category
      const counts = { All: allNotesRaw.length };
      allNotesRaw.forEach((n) => {
        const cat = n.category || 'General';
        counts[cat] = (counts[cat] || 0) + 1;
      });
      setCategoryCounts(counts);
    } catch (err) {
      console.error('Failed to calculate categories list', err);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesList();
  }, [notes, fetchCategoriesList]);

  // Create Note Save action
  const handleCreateNoteSave = async (noteData) => {
    try {
      await noteService.createNote(noteData);
      toast.success('Note created successfully!');
      setIsModalOpen(false);
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating note');
    }
  };

  // Edit Note Save action
  const handleEditNoteSave = async (noteData) => {
    try {
      await noteService.updateNote(selectedNote._id, noteData);
      toast.success('Note updated successfully!');
      setIsModalOpen(false);
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating note');
    }
  };

  // Toggle Pin action
  const handleTogglePin = async (note) => {
    try {
      await noteService.updateNote(note._id, { isPinned: !note.isPinned });
      toast.success(note.isPinned ? 'Note unpinned from top' : 'Note pinned to top!');
      fetchNotes();
    } catch (err) {
      toast.error('Error toggling pin state');
    }
  };

  // Delete Note confirm trigger
  const handleDeleteConfirm = async () => {
    try {
      await noteService.deleteNote(selectedNote._id);
      toast.success('Note deleted successfully!');
      setIsConfirmOpen(false);
      setSelectedNote(null);
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting note');
    }
  };

  // Modal Open wrappers
  const triggerCreateNote = () => {
    setModalMode('create');
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const triggerViewNote = (note) => {
    setModalMode('view');
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const triggerEditNote = (note) => {
    setModalMode('edit');
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const triggerDeleteNote = (note) => {
    setSelectedNote(note);
    setIsConfirmOpen(true);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 animate-fade-in">
      {/* Navbar */}
      <Navbar search={search} setSearch={setSearch} />

      {/* Main Container */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categoryCounts={categoryCounts}
          onCreateNoteClick={triggerCreateNote}
        />

        {/* Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span id="active-category-title">{activeCategory === 'All' ? 'All Notes' : activeCategory}</span>
                {notes.length > 0 && !loading && (
                  <span className="text-sm font-medium text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full">
                    {notes.length}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {search ? `Search results for "${search}"` : 'Manage and organize your notes efficiently.'}
              </p>
            </div>
            
            {/* Quick dashboard metric pills */}
            <div className="flex items-center gap-3.5 text-xs text-slate-500 font-bold bg-white p-2 rounded-xl border border-slate-200/40 shadow-sm self-start sm:self-auto">
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                Total: {notes.length}
              </span>
              <span className="h-3.5 w-[1px] bg-slate-200" />
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary-500" />
                Active Category: {activeCategory}
              </span>
            </div>
          </div>

          {/* Loader */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-500">Syncing with database...</p>
            </div>
          ) : notes.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-slate-200/50 shadow-sm">
              <div className="bg-primary-50 p-4.5 rounded-full mb-4 border border-primary-100/30">
                <FolderDot className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {search ? 'No search results found' : 'No notes in this category'}
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed font-medium">
                {search
                  ? 'Try clearing your search keyword or checking for spelling errors.'
                  : 'Start adding new thoughts, code snippets, or project documents to organize your dashboard.'}
              </p>
              {!search && (
                <button
                  id="create-first-note-btn"
                  onClick={triggerCreateNote}
                  className="inline-flex items-center gap-1.5 py-2.5 px-5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Create Your First Note
                </button>
              )}
            </div>
          ) : (
            /* Notes Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onOpenView={triggerViewNote}
                  onOpenEdit={triggerEditNote}
                  onOpenDelete={triggerDeleteNote}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Note Creation / Editing / Viewing Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        note={selectedNote}
        onSave={modalMode === 'create' ? handleCreateNoteSave : handleEditNoteSave}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        message={`Are you sure you want to delete "${selectedNote?.title}"? This note will be permanently removed from our databases.`}
      />
    </div>
  );
};

export default Dashboard;
