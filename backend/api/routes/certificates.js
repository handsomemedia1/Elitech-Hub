/**
 * Certificates Routes
 * Generate and verify certificates
 */

import { Router } from 'express';
import PDFDocument from 'pdfkit';
import supabase from '../services/supabase.js';
import { requireAuth, requirePaidAccess } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/certificates/generate - Generate certificate for completed course
 */
router.post('/generate', requireAuth, requirePaidAccess, async (req, res) => {
    try {
        const { courseId } = req.body;

        // Check if course is completed
        const { data: enrollment } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('course_id', courseId)
            .single();

        if (!enrollment || enrollment.progress < 100) {
            return res.status(400).json({
                error: 'Course not completed',
                progress: enrollment?.progress || 0
            });
        }

        // Check if certificate already exists
        const { data: existing } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('course_id', courseId)
            .single();

        if (existing) {
            return res.json({ certificate: existing });
        }

        // Get course details
        const { data: course } = await supabase
            .from('courses')
            .select('title')
            .eq('id', courseId)
            .single();

        // Generate unique certificate ID
        const certificateId = `EH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // Create certificate record
        const { data: certificate, error } = await supabase
            .from('certificates')
            .insert({
                user_id: req.user.id,
                course_id: courseId,
                certificate_id: certificateId,
                course_title: course.title,
                user_name: req.user.name,
                issued_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        res.json({
            message: 'Certificate generated',
            certificate
        });
    } catch (err) {
        console.error('Certificate generation error:', err);
        res.status(500).json({ error: 'Failed to generate certificate' });
    }
});

/**
 * GET /api/certificates - Get user's certificates
 */
router.get('/', requireAuth, async (req, res) => {
    try {
        const { data: certificates } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', req.user.id)
            .order('issued_at', { ascending: false });

        res.json({ certificates: certificates || [] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch certificates' });
    }
});

/**
 * GET /api/certificates/:id/verify - Verify certificate (public)
 */
router.get('/:id/verify', async (req, res) => {
    try {
        const { id } = req.params;

        const { data: certificate } = await supabase
            .from('certificates')
            .select('certificate_id, user_name, course_title, issued_at')
            .eq('certificate_id', id)
            .single();

        if (!certificate) {
            return res.status(404).json({
                valid: false,
                error: 'Certificate not found'
            });
        }

        res.json({
            valid: true,
            certificate
        });
    } catch (err) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

/**
 * GET /api/certificates/:id/download - Download certificate PDF
 */
router.get('/:id/download', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: certificate } = await supabase
            .from('certificates')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.user.id)
            .single();

        if (!certificate) {
            return res.status(404).json({ error: 'Certificate not found' });
        }

        // Generate PDF
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4'
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificate.certificate_id}.pdf`);

        doc.pipe(res);

        // Certificate design
        doc.rect(20, 20, 802, 555).stroke('#c3151c');
        doc.rect(30, 30, 782, 535).stroke('#0A0A0A');

        // Header
        doc.fontSize(14).fillColor('#c3151c').text('ELITECH HUB', 0, 60, { align: 'center' });
        doc.fontSize(10).fillColor('#666').text("Nigeria's #1 Cybersecurity Training Company", { align: 'center' });

        // Title
        doc.moveDown(2);
        doc.fontSize(36).fillColor('#0A0A0A').font('Helvetica-Bold').text('CERTIFICATE', { align: 'center' });
        doc.fontSize(18).font('Helvetica').text('OF COMPLETION', { align: 'center' });

        // Content
        doc.moveDown(2);
        doc.fontSize(14).fillColor('#333').text('This is to certify that', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(28).fillColor('#c3151c').font('Helvetica-Bold').text(certificate.user_name, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(14).fillColor('#333').font('Helvetica').text('has successfully completed the course', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(20).fillColor('#0A0A0A').font('Helvetica-Bold').text(certificate.course_title, { align: 'center' });

        // Date and ID
        doc.moveDown(2);
        doc.fontSize(12).fillColor('#666').font('Helvetica');
        doc.text(`Issued: ${new Date(certificate.issued_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'center' });
        doc.text(`Certificate ID: ${certificate.certificate_id}`, { align: 'center' });
        doc.text(`Verify at: elitechhub.com/verify/${certificate.certificate_id}`, { align: 'center' });

        doc.end();
    } catch (err) {
        console.error('Certificate download error:', err);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

export default router;
