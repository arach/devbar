#!/usr/bin/env node

const handler = require('serve-handler');
const http = require('http');
const path = require('path');

const server = http.createServer((request, response) => {
  // Rewrite URLs to handle the base path
  if (request.url.startsWith('/devbar/docs')) {
    request.url = request.url.replace('/devbar/docs', '');
  } else if (request.url === '/' || request.url === '') {
    // Redirect root to /devbar/docs
    response.writeHead(302, { Location: '/devbar/docs' });
    response.end();
    return;
  }
  
  return handler(request, response, {
    public: path.join(__dirname, 'out'),
    rewrites: [
      { source: '/devbar/docs/**', destination: '/$1' }
    ]
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Production build preview running at http://localhost:${PORT}/devbar/docs`);
  console.log(`This simulates the GitHub Pages environment`);
});