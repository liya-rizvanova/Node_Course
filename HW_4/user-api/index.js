const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const USERS_FILE = path.join(__dirname, 'users.json');

// Парсинг JSON тела запроса
app.use(express.json());

// Функция для чтения пользователей из файла
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data || '[]');
}

// Функция для записи пользователей в файл
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

app.get('/', (req, res) => {
  res.send('API работает. Используйте /users для работы с пользователями');
});

// Получить всех пользователей
app.get('/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});

// Получить пользователя по ID
app.get('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  res.json(user);
});

// Создать нового пользователя
app.post('/users', (req, res) => {
  const users = readUsers();
  const { id, name, email } = req.body;

  if (users.find(u => u.id === id)) {
    return res.status(400).json({ error: 'Пользователь с таким ID уже существует' });
  }

  const newUser = { id, name, email };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json(newUser);
});

// Обновить пользователя по ID
app.put('/users/:id', (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const updatedUser = { ...users[index], ...req.body };
  users[index] = updatedUser;
  writeUsers(users);

  res.json(updatedUser);
});

// Удалить пользователя по ID
app.delete('/users/:id', (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const deleted = users.splice(index, 1);
  writeUsers(users);

  res.json({ message: 'Пользователь удалён', user: deleted[0] });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ API сервер запущен: http://localhost:${PORT}`);
});
