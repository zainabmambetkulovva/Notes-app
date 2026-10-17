import React from 'react';
import './NoteCard.css';

function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} дн. назад`;

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="note-card" style={{ backgroundColor: note.color }}>
      {note.isPinned && (
        <div className="pin-badge" title="Закреплено">
          📌
        </div>
      )}

      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <button
          className="btn-pin"
          onClick={() => onTogglePin(note)}
          title={note.isPinned ? 'Открепить' : 'Закрепить'}
          aria-label={note.isPinned ? 'Открепить заметку' : 'Закрепить заметку'}
        >
          {note.isPinned ? '📌' : '📍'}
        </button>
      </div>

      <p className="note-content">{truncateText(note.content)}</p>

      <div className="note-card-footer">
        <span className="note-date" title={new Date(note.updatedAt).toLocaleString('ru-RU')}>
          {formatDate(note.updatedAt)}
        </span>

        <div className="note-actions">
          <button
            className="btn-action btn-edit"
            onClick={() => onEdit(note)}
            title="Редактировать"
            aria-label="Редактировать заметку"
          >
            ✏️
          </button>
          <button
            className="btn-action btn-delete"
            onClick={() => onDelete(note)}
            title="Удалить"
            aria-label="Удалить заметку"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
