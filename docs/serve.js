#!/usr/bin/env node

/**
 * Simple static server for viewing documentation locally
 * Usage: node serve.js
 * Then open http://localhost:3001/docs
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DOCS_DIR = __dirname;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DOCS_DIR, req.url === '/' ? 'index.md' : req.url);
  
  // If no extension, assume .md
  if (!path.extname(filePath)) {
    filePath += '.md';
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - File Not Found', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`📚 Documentation server running at http://localhost:${PORT}`);
  console.log(`   View docs at http://localhost:${PORT}/`);
  console.log(`   Press Ctrl+C to stop`);
});