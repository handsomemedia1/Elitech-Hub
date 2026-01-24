/**
 * Researchers Admin Routes
 * Admin management of researchers
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import supabase from '../services/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { generatePaperPDF } from '../services/pdf.js';

const router = Router();

/**
 * GET /api/admin/researchers - List all researchers
 */
router.get('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { data: researchers, error } = await supabase
            .from('researchers')
            .select('id, name, email, affiliation, publications_count, total_citations, h_index, active, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ researchers: researchers || [] });
    } catch (err) {
        console.error('List researchers error:', err);
        res.status(500).json({ error: 'Failed to fetch researchers' });
    }
});

/**
 * POST /api/admin/researchers - Create new researcher
 */
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { name, email, password, affiliation, bio, research_interests } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Validate academic/institutional email
        const academicDomains = ['.edu', '.ac.uk', '.edu.ng', '.ac.jp', '.org', '.gov', '.mil', '.sch.ng'];
        const emailDomain = email.toLowerCase().split('@')[1];
        const isAcademic = academicDomains.some(d => email.toLowerCase().endsWith(d));

        // Also allow specific approved domains if needed (e.g., elitechhub.com)
        const allowedDomains = ['elitechhub.com', 'elitechhub.com.ng'];
        const isAllowed = isAcademic || allowedDomains.includes(emailDomain);

        if (!isAllowed) {
            return res.status(400).json({
                error: 'Registration restricted to academic (.edu, .ac) or institutional emails only.'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const { data: researcher, error } = await supabase
            .from('researchers')
            .insert({
                name,
                email: email.toLowerCase(),
                password_hash: passwordHash,
                affiliation,
                bio,
                research_interests: research_interests || [],
                active: true
            })
            .select('id, name, email, affiliation, active')
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            throw error;
        }

        res.json({ message: 'Researcher created successfully', researcher });
    } catch (err) {
        console.error('Create researcher error:', err);
        res.status(500).json({ error: 'Failed to create researcher' });
    }
});

/**
 * PATCH /api/admin/researchers/:id/toggle - Toggle researcher active status
 */
router.patch('/:id/toggle', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Get current status
        const { data: current } = await supabase
            .from('researchers')
            .select('active')
            .eq('id', id)
            .single();

        if (!current) {
            return res.status(404).json({ error: 'Researcher not found' });
        }

        const { data: researcher, error } = await supabase
            .from('researchers')
            .update({ active: !current.active })
            .eq('id', id)
            .select('id, name, email, active')
            .single();

        if (error) throw error;

        res.json({
            message: `Researcher ${researcher.active ? 'activated' : 'deactivated'}`,
            researcher
        });
    } catch (err) {
        console.error('Toggle researcher error:', err);
        res.status(500).json({ error: 'Failed to toggle researcher status' });
    }
});

/**
 * DELETE /api/admin/researchers/:id - Delete researcher
 */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('researchers')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Researcher deleted' });
    } catch (err) {
        console.error('Delete researcher error:', err);
        res.status(500).json({ error: 'Failed to delete researcher' });
    }
});

/**
 * GET /api/admin/researchers/papers/pending - Get pending papers for review
 */
router.get('/papers/pending', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { data: papers, error } = await supabase
            .from('research')
            .select(`
                id, title, status, category, created_at, abstract, pdf_url, word_count,
                plagiarism_claimed, plagiarism_tool, plagiarism_report_url, grammar_score,
                researchers (id, name, email, affiliation)
            `)
            .eq('status', 'under_review')
            .order('created_at', { ascending: true });

        if (error) throw error;

        res.json({ papers: papers || [] });
    } catch (err) {
        console.error('Fetch pending papers error:', err);
        res.status(500).json({ error: 'Failed to fetch pending papers' });
    }
});

/**
 * PATCH /api/admin/researchers/papers/:id/review - Review paper (Approve/Reject/Reject with Strike)
 */
router.patch('/papers/:id/review', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { action, feedback, issueStrike, strikeReason, actualPlagiarism } = req.body;

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ error: 'Invalid action. Use approve or reject.' });
        }

        // Get paper details first
        const { data: paperDetails, error: fetchError } = await supabase
            .from('research')
            .select('id, title, researcher_id, plagiarism_claimed')
            .eq('id', id)
            .single();

        if (fetchError || !paperDetails) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        const newStatus = action === 'approve' ? 'published' : 'rejected';
        const isPublished = action === 'approve';

        const { data: paper, error } = await supabase
            .from('research')
            .update({
                status: newStatus,
                published: isPublished,
                plagiarism_verified: actualPlagiarism || null,
                admin_notes: feedback || null,
                rejection_reason: action === 'reject' ? (strikeReason || feedback || 'Rejected by admin') : null
            })
            .eq('id', id)
            .select('id, title, researcher_id')
            .single();

        if (error) throw error;

        // Issue strike if requested (for false reports)
        if (issueStrike && action === 'reject') {
            const strikeValue = strikeReason?.includes('false') ? 2 : 1; // 2 strikes for false reports

            await supabase.from('writer_strikes').insert({
                researcher_id: paper.researcher_id,
                strike_value: strikeValue,
                reason: strikeReason || 'Paper rejected with violation',
                paper_id: paper.id,
                claimed_score: paperDetails.plagiarism_claimed,
                actual_score: actualPlagiarism
            });

            // Check if researcher should be banned (3+ strikes)
            const { data: totalStrikes } = await supabase
                .from('writer_strikes')
                .select('strike_value')
                .eq('researcher_id', paper.researcher_id);

            const strikeSum = (totalStrikes || []).reduce((sum, s) => sum + (s.strike_value || 0), 0);

            if (strikeSum >= 3) {
                // Ban the researcher
                await supabase
                    .from('researchers')
                    .update({
                        active: false,
                        strike_status: 'banned',
                        total_strikes: strikeSum
                    })
                    .eq('id', paper.researcher_id);
            } else {
                // Update strike count
                await supabase
                    .from('researchers')
                    .update({
                        total_strikes: strikeSum,
                        strike_status: strikeSum >= 2 ? 'warning' : 'good'
                    })
                    .eq('id', paper.researcher_id);
            }
        }

        // Log review activity
        await supabase.from('researcher_activity').insert({
            researcher_id: paper.researcher_id,
            type: 'paper_reviewed',
            data: {
                paper_id: paper.id,
                title: paper.title,
                action,
                feedback,
                strike_issued: issueStrike || false
            }
        });

        // Generate PDF if paper is approved
        let pdfUrl = null;
        if (action === 'approve') {
            try {
                // Fetch full paper data for PDF generation
                const { data: fullPaper } = await supabase
                    .from('research')
                    .select(`
                        *,
                        researchers (id, name, email, affiliation, orcid)
                    `)
                    .eq('id', paper.id)
                    .single();

                if (fullPaper) {
                    pdfUrl = await generatePaperPDF(fullPaper);

                    // Update paper with generated PDF URL
                    await supabase
                        .from('research')
                        .update({
                            pdf_url: pdfUrl,
                            published_at: new Date().toISOString()
                        })
                        .eq('id', paper.id);
                }
            } catch (pdfError) {
                console.error('PDF generation error:', pdfError);
                // Don't fail the approval if PDF fails - it can be regenerated
            }
        }

        res.json({
            message: issueStrike
                ? `Paper rejected with strike issued`
                : `Paper ${action}d successfully${pdfUrl ? ' - PDF generated' : ''}`,
            paper,
            pdfUrl
        });
    } catch (err) {
        console.error('Review paper error:', err);
        res.status(500).json({ error: 'Failed to process review' });
    }
});

/**
 * GET /api/admin/researchers/:id/strikes - Get researcher's strike history
 */
router.get('/:id/strikes', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { data: strikes, error } = await supabase
            .from('writer_strikes')
            .select(`
                id, strike_value, reason, claimed_score, actual_score, created_at,
                research (id, title)
            `)
            .eq('researcher_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const { data: researcher } = await supabase
            .from('researchers')
            .select('total_strikes, strike_status')
            .eq('id', id)
            .single();

        res.json({
            strikes: strikes || [],
            totalStrikes: researcher?.total_strikes || 0,
            status: researcher?.strike_status || 'good'
        });
    } catch (err) {
        console.error('Get strikes error:', err);
        res.status(500).json({ error: 'Failed to fetch strikes' });
    }
});

/**
 * POST /api/admin/researchers/:id/strike - Manually issue a strike
 */
router.post('/:id/strike', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { strikeValue, reason, paperId } = req.body;

        if (!reason) {
            return res.status(400).json({ error: 'Reason is required' });
        }

        const value = parseFloat(strikeValue) || 1;

        await supabase.from('writer_strikes').insert({
            researcher_id: id,
            strike_value: value,
            reason,
            paper_id: paperId || null
        });

        // Get updated total
        const { data: allStrikes } = await supabase
            .from('writer_strikes')
            .select('strike_value')
            .eq('researcher_id', id);

        const total = (allStrikes || []).reduce((sum, s) => sum + (s.strike_value || 0), 0);

        // Update researcher
        const updateData = {
            total_strikes: total,
            strike_status: total >= 3 ? 'banned' : total >= 2 ? 'warning' : 'good'
        };

        if (total >= 3) {
            updateData.active = false;
        }

        await supabase
            .from('researchers')
            .update(updateData)
            .eq('id', id);

        res.json({
            message: total >= 3 ? 'Strike issued - Researcher BANNED' : 'Strike issued',
            totalStrikes: total,
            status: updateData.strike_status
        });
    } catch (err) {
        console.error('Issue strike error:', err);
        res.status(500).json({ error: 'Failed to issue strike' });
    }
});

/**
 * POST /api/admin/researchers/papers/:id/regenerate-pdf - Manually regenerate PDF
 */
router.post('/papers/:id/regenerate-pdf', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch full paper data
        const { data: paper, error } = await supabase
            .from('research')
            .select(`
                *,
                researchers (id, name, email, affiliation, orcid)
            `)
            .eq('id', id)
            .single();

        if (error || !paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        if (!paper.published && paper.status !== 'published') {
            return res.status(400).json({ error: 'Can only generate PDF for published papers' });
        }

        // Generate PDF
        const pdfUrl = await generatePaperPDF(paper);

        // Update paper with new PDF URL
        await supabase
            .from('research')
            .update({ pdf_url: pdfUrl })
            .eq('id', id);

        res.json({
            message: 'PDF regenerated successfully',
            pdfUrl
        });
    } catch (err) {
        console.error('PDF regeneration error:', err);
        res.status(500).json({ error: 'Failed to regenerate PDF' });
    }
});

export default router;
