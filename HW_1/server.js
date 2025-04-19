const http = require('http');
const url = require('url');

let homeViews = 0;
let aboutViews = 0;

// Хранилище недавних запросов по IP
const recentRequests = new Map();

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

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  if (path === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }

  const userAgent = req.headers['user-agent'] || '';
  const ip = req.socket.remoteAddress;
  console.log(`Запрос: ${req.method} ${path}, UA: ${userAgent}, IP: ${ip}`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (path === '/') {
    if (shouldCount(ip, path)) homeViews++;
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>Главная</title></head>
        <body>
          <h1>Главная</h1>
          <p>Просмотров: ${homeViews}</p>
          <a href="/about">Перейти на "О нас"</a>
        </body>
      </html>
    `);
  } else if (path === '/about') {
    if (shouldCount(ip, path)) aboutViews++;
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>О нас</title></head>
        <body>
          <h1>О нас</h1>
          <p>Просмотров: ${aboutViews}</p>
          <a href="/">Вернуться на главную</a>
        </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>404</title></head>
        <body>
          <h1>404 - Страница не найдена</h1>
          <a href="/">Вернуться на главную</a>
        </body>
      </html>
    `);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
