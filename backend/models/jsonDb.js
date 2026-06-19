const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/notes.json');

// Ensure database directory and file exist
function initDb() {
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
  }
}

function readData() {
  initDb();
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading notes JSON file:', err);
    return [];
  }
}

function writeData(data) {
  initDb();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing notes JSON file:', err);
  }
}

class JsonNote {
  constructor(data) {
    this._id = data._id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.title = data.title || '';
    this.content = data.content || '';
    this.category = data.category || 'General';
    this.tags = data.tags || [];
    this.isPinned = data.isPinned !== undefined ? !!data.isPinned : false;
    this.color = data.color || 'default';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  async save() {
    const notes = readData();
    const index = notes.findIndex(n => n._id === this._id);
    
    this.updatedAt = new Date().toISOString();
    
    const noteData = {
      _id: this._id,
      title: this.title,
      content: this.content,
      category: this.category,
      tags: this.tags,
      isPinned: this.isPinned,
      color: this.color,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    if (index !== -1) {
      notes[index] = noteData;
    } else {
      notes.push(noteData);
    }

    writeData(notes);
    return this;
  }

  async deleteOne() {
    const notes = readData();
    const filtered = notes.filter(n => n._id !== this._id);
    writeData(filtered);
    return { deletedCount: 1 };
  }

  // Static methods
  static find(query) {
    const promise = (async () => {
      const notes = readData().map(n => new JsonNote(n));
      let filtered = notes;

      if (query.category) {
        const catRegex = query.category.$regex;
        filtered = filtered.filter(n => catRegex.test(n.category));
      }

      if (query.$or) {
        filtered = filtered.filter(n => {
          return query.$or.some(cond => {
            if (cond.title) return cond.title.test(n.title);
            if (cond.content) return cond.content.test(n.content);
            if (cond.category) return cond.category.test(n.category);
            if (cond.tags && cond.tags.$regex) {
              return n.tags.some(tag => cond.tags.$regex.test(tag));
            }
            return false;
          });
        });
      }
      return filtered;
    })();

    // Return a thenable custom query object with a .sort() method to match Mongoose
    const queryObj = {
      sortObj: null,
      sort(sortVal) {
        this.sortObj = sortVal;
        return this;
      },
      then(resolve, reject) {
        promise.then(notes => {
          if (this.sortObj) {
            const keys = Object.keys(this.sortObj);
            notes.sort((a, b) => {
              for (const key of keys) {
                const order = this.sortObj[key]; // -1 for desc, 1 for asc
                const valA = a[key] !== undefined ? a[key] : '';
                const valB = b[key] !== undefined ? b[key] : '';
                
                if (valA < valB) return order === -1 ? 1 : -1;
                if (valA > valB) return order === -1 ? -1 : 1;
              }
              return 0;
            });
          }
          resolve(notes);
        }).catch(reject);
      }
    };

    return queryObj;
  }

  static async findById(id) {
    const notes = readData();
    const note = notes.find(n => n._id === id);
    return note ? new JsonNote(note) : null;
  }
}

module.exports = JsonNote;
