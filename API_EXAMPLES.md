# 📡 API Examples - Примеры использования API

Эти примеры можно использовать для тестирования backend API напрямую через curl, Postman или другие инструменты.

## Базовый URL
```
http://localhost:5000/api/notes
```

## 📝 Создание заметки

### Пример 1: Простая заметка
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Моя первая заметка",
    "content": "Это содержимое моей первой заметки",
    "color": "#ffebee",
    "isPinned": false
  }'
```

### Пример 2: Закрепленная заметка
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Важная задача",
    "content": "Не забыть сделать эту задачу!",
    "color": "#fff3e0",
    "isPinned": true
  }'
```

### Ответ:
```json
{
  "id": 1,
  "title": "Моя первая заметка",
  "content": "Это содержимое моей первой заметки",
  "color": "#ffebee",
  "isPinned": false,
  "createdAt": "2026-10-17T10:30:00.000Z",
  "updatedAt": "2026-10-17T10:30:00.000Z"
}
```

## 📋 Получение всех заметок

### Пример 1: Все заметки
```bash
curl http://localhost:5000/api/notes
```

### Пример 2: С сортировкой по дате создания
```bash
curl "http://localhost:5000/api/notes?sortBy=createdAt"
```

### Пример 3: С сортировкой по заголовку
```bash
curl "http://localhost:5000/api/notes?sortBy=title"
```

### Пример 4: С поиском
```bash
curl "http://localhost:5000/api/notes?search=важная"
```

### Пример 5: Поиск с сортировкой
```bash
curl "http://localhost:5000/api/notes?search=задача&sortBy=updatedAt"
```

### Ответ:
```json
[
  {
    "id": 1,
    "title": "Важная задача",
    "content": "Не забыть сделать эту задачу!",
    "color": "#fff3e0",
    "isPinned": true,
    "createdAt": "2026-10-17T10:30:00.000Z",
    "updatedAt": "2026-10-17T10:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Моя первая заметка",
    "content": "Это содержимое моей первой заметки",
    "color": "#ffebee",
    "isPinned": false,
    "createdAt": "2026-10-17T10:25:00.000Z",
    "updatedAt": "2026-10-17T10:25:00.000Z"
  }
]
```

## 🔍 Получение конкретной заметки

```bash
curl http://localhost:5000/api/notes/1
```

### Ответ:
```json
{
  "id": 1,
  "title": "Моя первая заметка",
  "content": "Это содержимое моей первой заметки",
  "color": "#ffebee",
  "isPinned": false,
  "createdAt": "2026-10-17T10:30:00.000Z",
  "updatedAt": "2026-10-17T10:30:00.000Z"
}
```

## ✏️ Обновление заметки

### Пример 1: Изменить заголовок и содержимое
```bash
curl -X PUT http://localhost:5000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Обновленный заголовок",
    "content": "Обновленное содержимое"
  }'
```

### Пример 2: Закрепить заметку
```bash
curl -X PUT http://localhost:5000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "isPinned": true
  }'
```

### Пример 3: Изменить цвет
```bash
curl -X PUT http://localhost:5000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "color": "#e8f5e9"
  }'
```

### Пример 4: Полное обновление
```bash
curl -X PUT http://localhost:5000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Полностью обновленная заметка",
    "content": "Новое содержимое с дополнительными деталями",
    "color": "#e3f2fd",
    "isPinned": false
  }'
```

### Ответ:
```json
{
  "id": 1,
  "title": "Обновленный заголовок",
  "content": "Обновленное содержимое",
  "color": "#ffebee",
  "isPinned": false,
  "createdAt": "2026-10-17T10:30:00.000Z",
  "updatedAt": "2026-10-17T10:35:00.000Z"
}
```

## 🗑️ Удаление заметки

```bash
curl -X DELETE http://localhost:5000/api/notes/1
```

### Ответ:
```json
{
  "message": "Заметка успешно удалена"
}
```

## ❌ Обработка ошибок

### Заметка не найдена (404)
```bash
curl http://localhost:5000/api/notes/999
```

Ответ:
```json
{
  "error": "Заметка не найдена"
}
```

### Невалидные данные (400)
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "content": "Содержимое"
  }'
```

Ответ:
```json
{
  "error": "Заголовок обязателен и не может быть пустым"
}
```

### Некорректный цвет (400)
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Заметка",
    "content": "Содержимое",
    "color": "red"
  }'
```

Ответ:
```json
{
  "error": "Цвет должен быть в формате HEX (#RRGGBB)"
}
```

## 🎨 Доступные цвета

Предустановленные цвета в приложении:
- `#ffffff` - Белый
- `#ffebee` - Светло-красный
- `#fff3e0` - Светло-оранжевый
- `#fffde7` - Светло-желтый
- `#f1f8e9` - Светло-зеленый лайм
- `#e8f5e9` - Светло-зеленый
- `#e0f7fa` - Светло-голубой
- `#e3f2fd` - Светло-синий
- `#ede7f6` - Светло-фиолетовый
- `#fce4ec` - Светло-розовый
- `#f3e5f5` - Светло-пурпурный
- `#e8eaf6` - Светло-индиго

## 📊 Типы сортировки

- `createdAt` - По дате создания (новые сверху)
- `updatedAt` - По дате изменения (недавно измененные сверху)
- `title` - По заголовку (алфавитный порядок)

**Примечание:** Закрепленные заметки всегда отображаются первыми независимо от типа сортировки.

## 🧪 Тестирование через PowerShell (Windows)

### Создание заметки
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/notes" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"title":"Тестовая заметка","content":"Содержимое","color":"#ffebee","isPinned":false}'
```

### Получение всех заметок
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/notes" -Method GET
```

### Обновление заметки
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/notes/1" `
  -Method PUT `
  -ContentType "application/json" `
  -Body '{"title":"Обновленная заметка"}'
```

### Удаление заметки
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/notes/1" -Method DELETE
```

## 📝 Примечания

1. Все даты возвращаются в формате ISO 8601 (UTC)
2. Поле `isPinned` может быть `true` или `false`
3. Максимальная длина заголовка: 200 символов
4. Максимальная длина содержимого: 10000 символов
5. Цвет должен быть в формате HEX (#RRGGBB)
6. Поиск работает по заголовку и содержимому (регистронезависимый)
