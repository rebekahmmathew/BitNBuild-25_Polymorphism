import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { subscriptionRoutes } from './routes/subscriptions';
import { menuRoutes } from './routes/menus';
import { deliveryRoutes } from './routes/deliveries';
import { staffRoutes } from './routes/staff';
import { analyticsRoutes } from './routes/analytics';
import { routeOptimizationRoutes } from './routes/routeOptimization';
import { testGeminiRoutes } from './routes/testGemini';
import { seedDemoData } from './utils/seedData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-dashboard-domain.com', 'https://your-app-domain.com']
    : ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', routeOptimizationRoutes);
app.use('/api/test', testGeminiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);

  // Seed demo data on startup
  seedDemoData();
});

server.on('error', (err: any) => {
  if (err && err.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use. Please free the port or set PORT env var to another port.`);
    process.exit(1);
  } else {
    logger.error('Server error:', err);
    process.exit(1);
  }
});

export default app;