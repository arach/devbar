const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files under /devbar/docs path
app.use('/devbar/docs', express.static(path.join(__dirname, 'out')));

// Redirect root to /devbar/docs
app.get('/', (req, res) => {
  res.redirect('/devbar/docs');
});

app.listen(PORT, () => {
  console.log(`Static docs site running at http://localhost:${PORT}/devbar/docs`);
});