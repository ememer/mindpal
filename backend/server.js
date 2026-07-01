const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3009;

app.use(express.json());

// Kod wygenerowany przez AI w celu mackupu endpointów
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const notificationsPath = path.join(__dirname, 'src', 'data', 'notification.json');

// Kod wygenerowany przez AI w celu mackupu endpointów
// Pierwotny stan wczytywany raz przy starcie serwera, żeby endpoint reset mógł do niego wrócić.
const initialNotifications = JSON.parse(fs.readFileSync(notificationsPath, 'utf-8'));
let notifications = JSON.parse(JSON.stringify(initialNotifications));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Kod wygenerowany przez AI w celu mackupu endpointów
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

// Kod wygenerowany przez AI w celu mackupu endpointów
// Przyjmuje pojedynczy rekord ({ id, isUnread }) lub tablicę takich rekordów.
app.post('/api/notifications', (req, res) => {
  const updates = Array.isArray(req.body) ? req.body : [req.body];

  for (const update of updates) {
    if (!update || typeof update.id !== 'string' || typeof update.isUnread !== 'boolean') {
      return res.status(400).json({
        error: 'Każdy rekord musi zawierać pole "id" (string) oraz "isUnread" (boolean).',
      });
    }
  }

  for (const update of updates) {
    const notification = notifications.find((n) => n.id === update.id);
    if (notification) {
      notification.isUnread = update.isUnread;
    }
  }

  res.json(notifications);
});

// Kod wygenerowany przez AI w celu mackupu endpointów
app.get('/api/notifications/reset', (req, res) => {
  notifications = JSON.parse(JSON.stringify(initialNotifications));
  res.json(notifications);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
