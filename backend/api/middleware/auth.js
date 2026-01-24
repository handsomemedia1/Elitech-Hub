/**
 * Auth Middleware
 * Verifies JWT token and checks access permissions
 */

import jwt from 'jsonwebtoken';
import supabase from '../services/supabase.js';

/**
 * Require authentication
 */
export const requireAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', decoded.userId)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

/**
 * Require paid access (payment completed or admin granted)
 */
export const requirePaidAccess = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Check if user has active access
        if (!req.user.has_access) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'Payment required to access dashboard. Please complete payment or contact admin.',
                requiresPayment: true
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({ error: 'Access check failed' });
    }
};

/**
 * Require admin role
 */
export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ error: 'Admin check failed' });
    }
};

export default { requireAuth, requirePaidAccess, requireAdmin };
