/**
 * Google OAuth Routes for Writer Login
 */

import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import supabase from '../services/supabase.js';

const router = Router();

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Step 1: Redirect to Google
router.get('/google', (req, res) => {
    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['email', 'profile', 'openid'],
        prompt: 'select_account'
    });
    res.redirect(authUrl);
});

// Step 2: Google callback
router.get('/google/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect('/writer.html?error=no_code');
    }

    try {
        // Exchange code for tokens
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        // Get user info
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        // Check if writer exists with this email
        let { data: writer } = await supabase
            .from('writers')
            .select('*')
            .eq('email', email)
            .single();

        if (!writer) {
            // Check if Google ID is linked
            const { data: linkedWriter } = await supabase
                .from('writers')
                .select('*')
                .eq('google_id', googleId)
                .single();

            if (linkedWriter) {
                writer = linkedWriter;
            } else {
                // No writer account - redirect with error
                return res.redirect('/writer.html?error=no_account&email=' + encodeURIComponent(email));
            }
        }

        // Link Google ID if not already linked
        if (!writer.google_id) {
            await supabase
                .from('writers')
                .update({ google_id: googleId, avatar_url: picture })
                .eq('id', writer.id);
        }

        // Check if writer is active
        if (!writer.active) {
            return res.redirect('/writer.html?error=inactive');
        }

        // Generate JWT
        const token = jwt.sign(
            { writerId: writer.id, email: writer.email, name: writer.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Redirect to writer panel with token
        res.redirect(`/writer.html?token=${token}&name=${encodeURIComponent(writer.name)}`);

    } catch (err) {
        console.error('Google OAuth error:', err);
        res.redirect('/writer.html?error=auth_failed');
    }
});

// Verify Google token (for frontend-initiated login)
router.post('/google/verify', async (req, res) => {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        // Check if writer exists
        let { data: writer } = await supabase
            .from('writers')
            .select('*')
            .or(`email.eq.${email},google_id.eq.${googleId}`)
            .single();

        if (!writer) {
            return res.status(404).json({ error: 'No writer account found for this email' });
        }

        if (!writer.active) {
            return res.status(403).json({ error: 'Writer account is inactive' });
        }

        // Link Google ID if not linked
        if (!writer.google_id) {
            await supabase
                .from('writers')
                .update({ google_id: googleId, avatar_url: picture })
                .eq('id', writer.id);
        }

        // Generate JWT
        const token = jwt.sign(
            { writerId: writer.id, email: writer.email, name: writer.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, writer: { id: writer.id, name: writer.name, email: writer.email } });

    } catch (err) {
        console.error('Google verify error:', err);
        res.status(401).json({ error: 'Invalid Google token' });
    }
});

export default router;
