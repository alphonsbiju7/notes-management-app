const mongoose = require('mongoose');
const { getIsConnected } = require('../config/db');
const JsonNote = require('./jsonDb');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'default',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseNote = mongoose.model('Note', noteSchema);

class NoteWrapper {
  constructor(data) {
    if (getIsConnected()) {
      this.impl = new MongooseNote(data);
      this.isMongoose = true;
    } else {
      this.impl = new JsonNote(data);
      this.isMongoose = false;
    }
  }

  // Getters and setters for document properties
  get id() { return this.impl.id || this.impl._id; }
  get _id() { return this.impl._id; }
  
  get title() { return this.impl.title; }
  set title(val) { this.impl.title = val; }

  get content() { return this.impl.content; }
  set content(val) { this.impl.content = val; }

  get category() { return this.impl.category; }
  set category(val) { this.impl.category = val; }

  get tags() { return this.impl.tags; }
  set tags(val) { this.impl.tags = val; }

  get isPinned() { return this.impl.isPinned; }
  set isPinned(val) { this.impl.isPinned = val; }

  get color() { return this.impl.color; }
  set color(val) { this.impl.color = val; }

  get createdAt() { return this.impl.createdAt; }
  get updatedAt() { return this.impl.updatedAt; }

  async save() {
    return await this.impl.save();
  }

  async deleteOne() {
    return await this.impl.deleteOne();
  }

  // Static methods
  static find(query) {
    if (getIsConnected()) {
      return MongooseNote.find(query);
    } else {
      return JsonNote.find(query);
    }
  }

  static async findById(id) {
    if (getIsConnected()) {
      return MongooseNote.findById(id);
    } else {
      return JsonNote.findById(id);
    }
  }
}

module.exports = NoteWrapper;
