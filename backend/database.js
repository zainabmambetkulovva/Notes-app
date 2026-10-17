import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'notes.db'));

// Создание таблицы заметок
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    color TEXT DEFAULT '#ffffff',
    isPinned INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

// Получить все заметки с сортировкой
export const getAllNotes = (sortBy = 'updatedAt') => {
  const validSortColumns = ['createdAt', 'updatedAt', 'title'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'updatedAt';
  
  const stmt = db.prepare(`
    SELECT * FROM notes 
    ORDER BY isPinned DESC, ${sortColumn} DESC
  `);
  return stmt.all();
};

// Получить заметку по ID
export const getNoteById = (id) => {
  const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
  return stmt.get(id);
};

// Создать заметку
export const createNote = (note) => {
  const { title, content, color, isPinned } = note;
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO notes (title, content, color, isPinned, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(title, content, color || '#ffffff', isPinned ? 1 : 0, now, now);
  return getNoteById(result.lastInsertRowid);
};

// Обновить заметку
export const updateNote = (id, note) => {
  const existingNote = getNoteById(id);
  if (!existingNote) return null;
  
  const { title, content, color, isPinned } = note;
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    UPDATE notes 
    SET title = ?, content = ?, color = ?, isPinned = ?, updatedAt = ?
    WHERE id = ?
  `);
  
  stmt.run(
    title !== undefined ? title : existingNote.title,
    content !== undefined ? content : existingNote.content,
    color !== undefined ? color : existingNote.color,
    isPinned !== undefined ? (isPinned ? 1 : 0) : existingNote.isPinned,
    now,
    id
  );
  
  return getNoteById(id);
};

// Удалить заметку
export const deleteNote = (id) => {
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};

// Поиск заметок
export const searchNotes = (query, sortBy = 'updatedAt') => {
  const validSortColumns = ['createdAt', 'updatedAt', 'title'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'updatedAt';
  
  const stmt = db.prepare(`
    SELECT * FROM notes 
    WHERE title LIKE ? OR content LIKE ?
    ORDER BY isPinned DESC, ${sortColumn} DESC
  `);
  
  const searchPattern = `%${query}%`;
  return stmt.all(searchPattern, searchPattern);
};

export default db;
