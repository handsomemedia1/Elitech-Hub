/**
 * Volunteer Routes
 * Handle volunteer applications
 */

import { Router } from 'express';
import supabase from '../services/supabase.js';
import { Resend } from 'resend';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/volunteers/apply - Submit volunteer application
 */
router.post('/apply', async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            location,
            role,
            linkedin,
            portfolio,
            experience,
            availability,
            motivation,
            goals,
            tools
        } = req.body;

        // Validation
        if (!fullName || !email || !phone || !location || !role || !experience || !availability || !motivation || !goals) {
            return res.status(400).json({ error: 'Please fill in all required fields' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check for duplicate application
        const { data: existing } = await supabase
            .from('volunteer_applications')
            .select('id')
            .eq('email', email.toLowerCase())
            .eq('status', 'pending')
            .single();

        if (existing) {
            return res.status(400).json({ error: 'You already have a pending application' });
        }

        // Save application
        const { data: application, error } = await supabase
            .from('volunteer_applications')
            .insert({
                full_name: fullName.trim(),
                email: email.toLowerCase().trim(),
                phone: phone.trim(),
                location: location.trim(),
                role,
                linkedin_url: linkedin || null,
                portfolio_url: portfolio || null,
                experience: experience.trim(),
                availability,
                motivation: motivation.trim(),
                goals: goals.trim(),
                tools: tools?.trim() || null,
                status: 'pending',
                applied_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Volunteer application error:', error);
            return res.status(500).json({ error: 'Failed to submit application' });
        }

        // Send confirmation email to applicant
        try {
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Elitech Hub <onboarding@resend.dev>',
                to: [email],
                subject: '✅ Volunteer Application Received - Elitech Hub',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #c3151c;">Thank You for Applying, ${fullName}! 🎉</h2>
                        <p>We've received your application for the <strong>${role}</strong> volunteer position at Elitech Hub.</p>
                        
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Your Application Summary:</h3>
                            <p><strong>Role:</strong> ${role}</p>
                            <p><strong>Availability:</strong> ${availability}</p>
                            <p><strong>Location:</strong> ${location}</p>
                        </div>
                        
                        <p>Our team will review your application and get back to you within <strong>48 hours</strong>.</p>
                        
                        <p style="color: #6b7280; font-size: 14px;">If you have any questions, reply to this email.</p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                            Elitech Hub - Cybersecurity Education Platform<br>
                            <a href="https://elitechhub.com" style="color: #c3151c;">elitechhub.com</a>
                        </p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Applicant email failed:', emailErr);
        }

        // Send notification to admin with summary
        try {
            const adminEmail = process.env.ADMIN_EMAIL || 'Elijah@elitechub.com';
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Elitech Hub <onboarding@resend.dev>',
                to: [adminEmail],
                subject: `📋 New Volunteer Application: ${fullName} - ${role}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #c3151c;">New Volunteer Application 🎯</h2>
                        
                        <div style="background: #0a0a0a; color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #c3151c;">${fullName}</h3>
                            <p style="margin: 5px 0;"><strong>Role:</strong> ${role}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Location:</strong> ${location}</p>
                            <p style="margin: 5px 0;"><strong>Availability:</strong> ${availability}</p>
                        </div>

                        <h3>📝 Experience</h3>
                        <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${experience}</p>

                        <h3>💡 Motivation</h3>
                        <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${motivation}</p>

                        <h3>🎯 Goals</h3>
                        <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${goals}</p>

                        ${tools ? `<h3>🛠️ Tools/Skills</h3><p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${tools}</p>` : ''}

                        ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>` : ''}
                        ${portfolio ? `<p><strong>Portfolio:</strong> <a href="${portfolio}">${portfolio}</a></p>` : ''}
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        
                        <p style="text-align: center;">
                            <a href="https://elitechhub.com/admin.html" style="background: #c3151c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                View in Admin Panel
                            </a>
                        </p>
                    </div>
                `
            });
        } catch (adminEmailErr) {
            console.error('Admin notification failed:', adminEmailErr);
        }

        res.json({
            message: 'Application submitted successfully',
            applicationId: application.id
        });

    } catch (err) {
        console.error('Volunteer apply error:', err);
        res.status(500).json({ error: 'Failed to process application' });
    }
});

/**
 * GET /api/volunteers/applications - Get all applications (admin only)
 */
router.get('/applications', async (req, res) => {
    try {
        // TODO: Add admin auth middleware
        const { data: applications, error } = await supabase
            .from('volunteer_applications')
            .select('*')
            .order('applied_at', { ascending: false });

        if (error) throw error;

        res.json({ applications: applications || [] });
    } catch (err) {
        console.error('Get applications error:', err);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

/**
 * PATCH /api/volunteers/applications/:id - Update application status
 */
router.patch('/applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!['pending', 'approved', 'rejected', 'interviewed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const { data: application, error } = await supabase
            .from('volunteer_applications')
            .update({ status, admin_notes: notes })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Application updated', application });
    } catch (err) {
        console.error('Update application error:', err);
        res.status(500).json({ error: 'Failed to update application' });
    }
});

export default router;
