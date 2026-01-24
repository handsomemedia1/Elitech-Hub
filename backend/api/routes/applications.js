/**
 * Applications API Route
 * Handles program application submissions
 */

import express from 'express';
import { sendApplicationNotification, sendApplicationConfirmation } from '../services/email.js';

const router = express.Router();

// Supabase client (from env)
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API_KEY
);

/**
 * POST /api/applications
 * Submit a new program application
 */
router.post('/', async (req, res) => {
    try {
        const {
            program,
            fullName,
            email,
            phone,
            state,
            education,
            occupation,
            motivation
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone || !program) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: fullName, email, phone, program'
            });
        }

        // Get program details
        const programDetails = {
            'bootcamp': { name: '6-Week Bootcamp', price: 45000 },
            'professional': { name: '16-Week Professional Program', price: 75000 }
        };

        const selectedProgram = programDetails[program] || programDetails['professional'];

        // Store application in database
        const { data: application, error } = await supabase
            .from('applications')
            .insert([{
                program: program,
                program_name: selectedProgram.name,
                full_name: fullName,
                email: email,
                phone: phone,
                state: state || null,
                education: education || null,
                occupation: occupation || null,
                motivation: motivation || null,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            // Continue even if DB fails - still send emails
        }

        // Send notification email to admin
        await sendApplicationNotification({
            applicantName: fullName,
            email: email,
            phone: phone,
            state: state,
            education: education,
            occupation: occupation,
            program: selectedProgram.name,
            price: selectedProgram.price,
            motivation: motivation
        });

        // Send confirmation email to applicant
        await sendApplicationConfirmation({
            to: email,
            name: fullName,
            program: selectedProgram.name,
            price: selectedProgram.price
        });

        res.json({
            success: true,
            message: 'Application submitted successfully',
            applicationId: application?.id || null,
            program: selectedProgram.name
        });

    } catch (err) {
        console.error('Application submission error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application. Please try again.'
        });
    }
});

/**
 * GET /api/applications
 * Get all applications (admin only)
 */
router.get('/', async (req, res) => {
    try {
        // TODO: Add admin authentication check

        const { data: applications, error } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            applications: applications || []
        });

    } catch (err) {
        console.error('Get applications error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications'
        });
    }
});

export default router;
