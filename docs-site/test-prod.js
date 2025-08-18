#!/usr/bin/env node

const express = require('express');
const path = require('path');
const app = express();

// Serve files under the /devbar/docs path (simulating GitHub Pages)
app.use('/devbar/docs', express.static(path.join(__dirname, 'out')));

// Redirect root to /devbar/docs
app.get('/', (req, res) => {
  res.redirect('/devbar/docs');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Production build test server running!`);
  console.log(`📄 Docs: http://localhost:${PORT}/devbar/docs`);
  console.log(`\nThis simulates the GitHub Pages environment.`);
});