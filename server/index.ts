/**
 * Socket.io Server Entry Point
 * 
 * This server handles all real-time game communication
 * with session recovery support via token-based identity.
 * 
 * Run with: npm run server
 */

import { createServer } from 'http';
import { setupSocketHandlers } from './socket';

const PORT = process.env.PORT || 3001;

// Create HTTP server
const httpServer = createServer((req, res) => {
  // Basic health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

// Set up Socket.io handlers
const io = setupSocketHandlers(httpServer);

// Start the server
httpServer.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║          GAME SERVER STARTED                   ║');
  console.log('╠═══════════════════════════════════════════════╣');
  console.log(`║  Port: ${PORT}                                   ║`);
  console.log('║  Session Recovery: ENABLED                     ║');
  console.log('║  Disconnect Timeout: 5 minutes                 ║');
  console.log('╚═══════════════════════════════════════════════╝');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down gracefully...');
  io.close();
  httpServer.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received, shutting down gracefully...');
  io.close();
  httpServer.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});
