import express from 'express';
import cors from 'cors';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes
} from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Валидация заметки
const validateNote = (note, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate || note.title !== undefined) {
    if (!note.title || typeof note.title !== 'string' || note.title.trim().length === 0) {
      errors.push('Заголовок обязателен и не может быть пустым');
    } else if (note.title.length > 200) {
      errors.push('Заголовок не может быть длиннее 200 символов');
    }
  }
  
  if (!isUpdate || note.content !== undefined) {
    if (!note.content || typeof note.content !== 'string') {
      errors.push('Содержимое заметки обязательно');
    } else if (note.content.length > 10000) {
      errors.push('Содержимое не может быть длиннее 10000 символов');
    }
  }
  
  if (note.color !== undefined) {
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(note.color)) {
      errors.push('Цвет должен быть в формате HEX (#RRGGBB)');
    }
  }
  
  return errors;
};

// GET /api/notes - Получить все заметки
app.get('/api/notes', (req, res) => {
  try {
    const { search, sortBy } = req.query;
    
    let notes;
    if (search && search.trim()) {
      notes = searchNotes(search.trim(), sortBy);
    } else {
      notes = getAllNotes(sortBy);
    }
    
    // Преобразование isPinned в boolean
    notes = notes.map(note => ({
      ...note,
      isPinned: note.isPinned === 1
    }));
    
    res.json(notes);
  } catch (error) {
    console.error('Ошибка при получении заметок:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении заметок' });
  }
});

// GET /api/notes/:id - Получить заметку по ID
app.get('/api/notes/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Некорректный ID заметки' });
    }
    
    const note = getNoteById(id);
    
    if (!note) {
      return res.status(404).json({ error: 'Заметка не найдена' });
    }
    
    // Преобразование isPinned в boolean
    note.isPinned = note.isPinned === 1;
    
    res.json(note);
  } catch (error) {
    console.error('Ошибка при получении заметки:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении заметки' });
  }
});

// POST /api/notes - Создать новую заметку
app.post('/api/notes', (req, res) => {
  try {
    const errors = validateNote(req.body);
    
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    const note = createNote(req.body);
    
    // Преобразование isPinned в boolean
    note.isPinned = note.isPinned === 1;
    
    res.status(201).json(note);
  } catch (error) {
    console.error('Ошибка при создании заметки:', error);
    res.status(500).json({ error: 'Ошибка сервера при создании заметки' });
  }
});

// PUT /api/notes/:id - Обновить заметку
app.put('/api/notes/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Некорректный ID заметки' });
    }
    
    const errors = validateNote(req.body, true);
    
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    const note = updateNote(id, req.body);
    
    if (!note) {
      return res.status(404).json({ error: 'Заметка не найдена' });
    }
    
    // Преобразование isPinned в boolean
    note.isPinned = note.isPinned === 1;
    
    res.json(note);
  } catch (error) {
    console.error('Ошибка при обновлении заметки:', error);
    res.status(500).json({ error: 'Ошибка сервера при обновлении заметки' });
  }
});

// DELETE /api/notes/:id - Удалить заметку
app.delete('/api/notes/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Некорректный ID заметки' });
    }
    
    const success = deleteNote(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Заметка не найдена' });
    }
    
    res.json({ message: 'Заметка успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении заметки:', error);
    res.status(500).json({ error: 'Ошибка сервера при удалении заметки' });
  }
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error('Необработанная ошибка:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
