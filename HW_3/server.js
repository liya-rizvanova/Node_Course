const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Путь к файлу для хранения данных
const viewsFilePath = path.join(__dirname, 'viewsCount.json');

// Загружаем данные из файла, если он существует, иначе создаем объект с нуля
let viewsData = {};
if (fs.existsSync(viewsFilePath)) {
  const fileData = fs.readFileSync(viewsFilePath, 'utf-8');
  viewsData = JSON.parse(fileData);
} else {
  viewsData = { '/': 0, '/about': 0 };  // Инициализируем счетчики, если файл пуст
}

// Хранилище для недавних запросов по IP
const recentRequests = new Map();

// Функция для проверки, можно ли считать новый просмотр
function shouldCount(ip, path) {
  const now = Date.now();
  const key = `${ip}-${path}`;
  const lastTime = recentRequests.get(key) || 0;

  if (now - lastTime > 1000) { // 1 секунду "антиспам"
    recentRequests.set(key, now);
    return true;
  }
  return false;
}

// Функция для сохранения счетчиков в файл
function saveViewsData() {
  fs.writeFileSync(viewsFilePath, JSON.stringify(viewsData, null, 2), 'utf-8');
}

// Упрощенный обработчик для главной страницы
app.get('/', (req, res) => {
  const ip = req.socket.remoteAddress; // Получаем IP клиента

  if (shouldCount(ip, '/')) {
    viewsData['/'] = (viewsData['/'] || 0) + 1;
    saveViewsData();
  }

  res.send(`<h1>Главная</h1>`);
});

// Упрощенный обработчик для страницы "О нас"
app.get('/about', (req, res) => {
  const ip = req.socket.remoteAddress; // Получаем IP клиента

  if (shouldCount(ip, '/about')) {
    viewsData['/about'] = (viewsData['/about'] || 0) + 1;
    saveViewsData();
  }

  res.send(`<h1>О нас</h1>`);
});

// Обработчик для страницы "404"
app.use((req, res) => {
  res.status(404).send(`<h1>404 - Страница не найдена</h1>`);
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
