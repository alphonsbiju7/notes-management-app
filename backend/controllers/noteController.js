const Note = require('../models/Note');

// @desc    Get all notes (with optional search and category filter)
// @route   GET /api/notes
// @access  Public
const getNotes = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Filter by category if specified
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Search query across title, content, category, and tags
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { category: searchRegex },
        { tags: { $regex: searchRegex } }
      ];
    }

    // Fetch notes, sorted by pinned first, then latest first
    const notes = await Note.find(query).sort({ isPinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error: unable to fetch notes', error: error.message });
  }
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
// @access  Public
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Server error: unable to fetch note', error: error.message });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Public
const createNote = async (req, res) => {
  try {
    const { title, content, category, tags, isPinned, color } = req.body;

    // Simple validation
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Format tags if they are a string (comma separated) or array
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map(tag => tag.trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    const note = new Note({
      title: title.trim(),
      content: content.trim(),
      category: category && category.trim() ? category.trim() : 'General',
      tags: processedTags,
      isPinned: isPinned !== undefined ? !!isPinned : false,
      color: color && color.trim() ? color.trim() : 'default'
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error: unable to create note', error: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Public
const updateNote = async (req, res) => {
  try {
    const { title, content, category, tags, isPinned, color } = req.body;

    // Simple validation
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    if (content !== undefined && !content.trim()) {
      return res.status(400).json({ message: 'Content cannot be empty' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update fields if provided
    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content.trim();
    if (category !== undefined) note.category = category.trim() || 'General';
    if (isPinned !== undefined) note.isPinned = !!isPinned;
    if (color !== undefined) note.color = color.trim() || 'default';
    
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        note.tags = tags.map(tag => tag.trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        note.tags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }
    }

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Server error: unable to update note', error: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Public
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Server error: unable to delete note', error: error.message });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
