import React, { useState, useEffect } from 'react';
import './NoteForm.css';

const DEFAULT_COLORS = [
  '#ffffff',
  '#ffebee',
  '#fff3e0',
  '#fffde7',
  '#f1f8e9',
  '#e8f5e9',
  '#e0f7fa',
  '#e3f2fd',
  '#ede7f6',
  '#fce4ec',
  '#f3e5f5',
  '#e8eaf6'
];

function NoteForm({ note, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [isPinned, setIsPinned] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setColor(note.color || '#ffffff');
      setIsPinned(note.isPinned || false);
    }
  }, [note]);

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Заголовок обязателен';
    } else if (title.length > 200) {
      newErrors.title = 'Заголовок не может быть длиннее 200 символов';
    }

    if (!content.trim()) {
      newErrors.content = 'Содержимое заметки обязательно';
    } else if (content.length > 10000) {
      newErrors.content = 'Содержимое не может быть длиннее 10000 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      color,
      isPinned
    };

    if (note) {
      onSave(note.id, noteData);
    } else {
      onSave(noteData);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{note ? 'Редактировать заметку' : 'Новая заметка'}</h2>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="note-form">
          <div className="form-group">
            <label htmlFor="note-title">
              Заголовок <span className="required">*</span>
            </label>
            <input
              id="note-title"
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Введите заголовок заметки"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              autoFocus
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
            <span className="char-count">{title.length}/200</span>
          </div>

          <div className="form-group">
            <label htmlFor="note-content">
              Содержимое <span className="required">*</span>
            </label>
            <textarea
              id="note-content"
              className={`form-textarea ${errors.content ? 'error' : ''}`}
              placeholder="Введите текст заметки"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              maxLength={10000}
            />
            {errors.content && <span className="error-message">{errors.content}</span>}
            <span className="char-count">{content.length}/10000</span>
          </div>

          <div className="form-group">
            <label>Цвет заметки</label>
            <div className="color-picker">
              {DEFAULT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Выбрать цвет ${c}`}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span>Закрепить заметку</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-submit">
              {note ? 'Сохранить изменения' : 'Создать заметку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteForm;
