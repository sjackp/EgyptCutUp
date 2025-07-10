import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { registerRoutes } from './routes';
import { setupVite, serveStatic, log } from './vite';
import { pool } from './db';

const app = express();

// Middleware: Parse JSON and url-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any = undefined;

  // Monkey-patch res.json to capture response body
  const originalResJson = res.json.bind(res);
  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalResJson(body, ...args);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }
      log(logLine);
    }
  });

  next();
});

// Main Async Bootstrap
(async () => {
  try {
    // Register all routes and get http.Server instance
    const server = await registerRoutes(app);

    // Error handler (must be AFTER all routes)
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      res.status(status).json({ message });
      // Optionally: log error here, but don't throw again (would crash server)
      log(`[ERROR] ${status} - ${message}`);
    });

    // Vite in dev, static in prod
    if (app.get('env') === 'development') {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Listen on port 5000, host 127.0.0.1 or from ENV
    const port = 5000;
    const host = process.env.HOST || '127.0.0.1';

    server.listen(port, host, () => {
      log(`serving on http://${host}:${port}`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      log(`\n[SHUTDOWN] Received ${signal}. Starting graceful shutdown...`);
      
      // Stop accepting new connections
      server.close(() => {
        log('[SHUTDOWN] HTTP server closed');
      });
      
      // Close database connections
      try {
        await pool.end();
        log('[SHUTDOWN] Database connections closed');
      } catch (error) {
        log(`[SHUTDOWN] Error closing database connections: ${error}`);
      }
      
      log('[SHUTDOWN] Graceful shutdown completed');
      process.exit(0);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (err: any) {
    log(`[FATAL ERROR] ${err.message || err}`);
    process.exit(1);
  }
})();
