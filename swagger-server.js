#!/usr/bin/env node

/**
 * Simple HTTP server to serve the Swagger Index
 * 
 * Usage:
 *   node swagger-server.js
 *   npm run swagger:serve (if added to package.json)
 * 
 * Then open: http://localhost:8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.SWAGGER_INDEX_PORT || 8080;
const HOST = process.env.SWAGGER_INDEX_HOST || 'localhost';

const server = http.createServer((req, res) => {
  // Serve the swagger-index.html file
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'swagger-index.html');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading Swagger Index');
        console.error('Error reading file:', err);
        return;
      }
      
      res.writeHead(200, { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  } 
  // Serve markdown files as plain text
  else if (req.url.endsWith('.md')) {
    const filePath = path.join(__dirname, req.url);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      
      res.writeHead(200, { 
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  }
  // Health check endpoint
  else if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      service: 'swagger-index',
      timestamp: new Date().toISOString()
    }));
  }
  // 404 for all other routes
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, HOST, () => {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║           📊 Swagger Index Server Running                     ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  console.log(`🌐 Server URL:        http://${HOST}:${PORT}`);
  console.log(`📖 Swagger Index:     http://${HOST}:${PORT}/`);
  console.log(`❤️  Health Check:      http://${HOST}:${PORT}/health`);
  console.log('\n🎯 Access all microservice Swagger documentation from the index!\n');
  console.log('Press Ctrl+C to stop the server\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down Swagger Index server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Swagger Index server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
