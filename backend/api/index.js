/**
 * Elitech Hub LMS Backend
 * Main Express Server
 * 
 * Security hardened version
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import usersRoutes from './routes/users.js';
import paymentsRoutes from './routes/payments.js';
import searchRoutes from './routes/search.js';
import adminRoutes from './routes/admin.js';
import certificatesRoutes from './routes/certificates.js';
import blogRoutes from './routes/blog.js';
import ebooksRoutes from './routes/ebooks.js';
import writersRoutes from './routes/writers.js';
import writersAdminRoutes from './routes/writers-admin.js';
import oauthRoutes from './routes/oauth.js';
import researchRoutes from './routes/research.js';
import sitemapRoutes from './routes/sitemap.js';
import volunteersRoutes from './routes/volunteers.js';
import inquiriesRoutes from './routes/inquiries.js';
import chatbotRoutes from './chatbot.js';
import pricingRoutes from './services-pricing.js';
import writersPerformanceRoutes from './routes/writers-performance.js';
import researchersRoutes from './routes/researchers.js';
import researchersAdminRoutes from './routes/researchers-admin.js';
import applicationsRoutes from './routes/applications.js';
import leadsRoutes from './routes/leads.js';
import labStatsRoutes from './routes/lab-stats.js';
import { initReminderCron } from './services/reminder-cron.js';

// ... (middleware setup) ...

// ============================================
// ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/ebooks', ebooksRoutes);
app.use('/api/writers', writersRoutes);
app.use('/api/writers/admin', writersAdminRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/sitemap', sitemapRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/contact', inquiriesRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/services', pricingRoutes);
app.use('/api/writers/performance', writersPerformanceRoutes);
app.use('/api/researchers', researchersRoutes);
app.use('/api/researchers/admin', researchersAdminRoutes);
app.use('/api/applications', applicationsRoutes);

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Security headers
app.use(helmet({
    contentSecurityPolicy: isProduction ? undefined : false, // Disable CSP in dev
    crossOriginEmbedderPolicy: false
}));

// CORS - Restrict origins
const allowedOrigins = isProduction
    ? ['https://elitechub.com', 'https://www.elitechub.com', 'https://elitechcysb.netlify.app']
    : ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true); // Still allow in dev, log in production
    },
    credentials: true
}));

// Body parser with size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ============================================
// RATE LIMITING
// ============================================

// General API rate limit
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

// OTP resend limiter
const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1, // 1 request per minute
    message: { error: 'Please wait before requesting another OTP.' }
});

// Apply general limiter to all API routes
app.use('/api', generalLimiter);

// ============================================
// ROUTES
// ============================================

// Sitemap and robots.txt at root (no rate limit)
app.use('/', sitemapRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes with strict rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/writers/login', authLimiter);
app.use('/api/writers/resend-otp', otpLimiter);

// Routes
app.use('/api/auth', oauthRoutes); // Google OAuth
app.use('/api/auth', authRoutes); // Standard auth
app.use('/api/courses', coursesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin/writers', writersAdminRoutes); // Admin writer management
app.use('/api/admin', adminRoutes); // General admin
app.use('/api/certificates', certificatesRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/ebooks', ebooksRoutes);
app.use('/api/writers', writersRoutes);
app.use('/api/writers/performance', writersPerformanceRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/researchers', researchersRoutes);
app.use('/api/admin/researchers', researchersAdminRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/services', pricingRoutes);
app.use('/api/admin/services', pricingRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/lab', labStatsRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler - hide details in production
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);

    // Don't expose error details in production
    if (isProduction) {
        res.status(500).json({ error: 'Internal server error' });
    } else {
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// ============================================
// SERVER START
// ============================================

// For Vercel serverless
export default app;

// For local development
const PORT = process.env.PORT || 3001;
if (!isProduction) {
    app.listen(PORT, () => {
        console.log(`🚀 Elitech Hub API running on http://localhost:${PORT}`);
        console.log('🛡️ Security middleware enabled: Helmet, Rate Limiting, CORS');
        // Start cron jobs
        initReminderCron();
    });
}
