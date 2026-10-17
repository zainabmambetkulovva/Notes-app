import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import NoteCard from './components/NoteCard';
import NoteForm from './components/NoteForm';
import ConfirmDialog from './components/ConfirmDialog';
import './App.css';

const API_URL = '/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    noteId: null,
    noteTitle: ''
  });

  // Загрузка заметок с сервера
  useEffect(() => {
    fetchNotes();
  }, [sortBy]);

  // Фильтрация заметок локально при поиске
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}?sortBy=${sortBy}`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки заметок');
      }
      
      const data = await response.json();
      setNotes(data);
      setFilteredNotes(data);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при загрузке заметок:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка создания заметки');
      }

      await fetchNotes();
      setIsFormOpen(false);
    } catch (err) {
      alert(err.message);
      console.error('Ошибка при создании заметки:', err);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка обновления заметки');
      }

      await fetchNotes();
      setIsFormOpen(false);
      setEditingNote(null);
    } catch (err) {
      alert(err.message);
      console.error('Ошибка при обновлении заметки:', err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка удаления заметки');
      }

      await fetchNotes();
      setConfirmDialog({ isOpen: false, noteId: null, noteTitle: '' });
    } catch (err) {
      alert(err.message);
      console.error('Ошибка при удалении заметки:', err);
    }
  };

  const handleTogglePin = async (note) => {
    await handleUpdateNote(note.id, { isPinned: !note.isPinned });
  };

  const openEditForm = (note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const openDeleteConfirm = (note) => {
    setConfirmDialog({
      isOpen: true,
      noteId: note.id,
      noteTitle: note.title
    });
  };

  const closeDeleteConfirm = () => {
    setConfirmDialog({ isOpen: false, noteId: null, noteTitle: '' });
  };

  const confirmDelete = () => {
    if (confirmDialog.noteId) {
      handleDeleteNote(confirmDialog.noteId);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📝 Notes App</h1>
          <button className="btn-create" onClick={openCreateForm}>
            + Создать заметку
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {isLoading ? (
            <div className="loading">Загрузка заметок...</div>
          ) : error ? (
            <div className="error">
              <p>Ошибка: {error}</p>
              <button onClick={fetchNotes} className="btn-retry">
                Попробовать снова
              </button>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? (
                <>
                  <p className="empty-icon">🔍</p>
                  <h2>Ничего не найдено</h2>
                  <p>Попробуйте изменить поисковый запрос</p>
                </>
              ) : (
                <>
                  <p className="empty-icon">📝</p>
                  <h2>У вас пока нет заметок</h2>
                  <p>Создайте свою первую заметку, чтобы начать</p>
                  <button className="btn-primary" onClick={openCreateForm}>
                    Создать заметку
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={openEditForm}
                  onDelete={openDeleteConfirm}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {isFormOpen && (
        <NoteForm
          note={editingNote}
          onSave={editingNote ? handleUpdateNote : handleCreateNote}
          onClose={closeForm}
        />
      )}

      {confirmDialog.isOpen && (
        <ConfirmDialog
          title="Удалить заметку?"
          message={`Вы уверены, что хотите удалить заметку "${confirmDialog.noteTitle}"? Это действие нельзя отменить.`}
          onConfirm={confirmDelete}
          onCancel={closeDeleteConfirm}
        />
      )}
    </div>
  );
}

export default App;
