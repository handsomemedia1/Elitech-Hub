/**
 * Inquiries Routes
 * Handle partner, host company, and sponsorship inquiries
 */

import { Router } from 'express';
import { Resend } from 'resend';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Elijah@elitechub.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Elitech Hub <onboarding@resend.dev>';

/**
 * POST /api/inquiries/partner - Partner inquiry form
 */
router.post('/partner', async (req, res) => {
    try {
        const { organizationName, contactName, email, partnerType, message } = req.body;

        // Validation
        if (!organizationName || !contactName || !email || !partnerType || !message) {
            return res.status(400).json({ error: 'Please fill in all required fields' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Send confirmation email to inquirer
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: [email],
                subject: '✅ Partnership Inquiry Received - Elitech Hub',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #c3151c;">Thank You for Your Interest! 🤝</h2>
                        <p>Dear ${contactName},</p>
                        <p>We've received your partnership inquiry from <strong>${organizationName}</strong>.</p>
                        
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Inquiry Summary:</h3>
                            <p><strong>Organization:</strong> ${organizationName}</p>
                            <p><strong>Partner Type:</strong> ${partnerType}</p>
                        </div>
                        
                        <p>Our partnerships team will review your inquiry and respond within <strong>2-3 business days</strong>.</p>
                        
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
            console.error('Inquirer email failed:', emailErr);
        }

        // Send notification to admin
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: [ADMIN_EMAIL],
                subject: `🤝 New Partnership Inquiry: ${organizationName} (${partnerType})`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #c3151c;">New Partnership Inquiry 🎯</h2>
                        
                        <div style="background: #0a0a0a; color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #c3151c;">${organizationName}</h3>
                            <p style="margin: 5px 0;"><strong>Contact:</strong> ${contactName}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #60a5fa;">${email}</a></p>
                            <p style="margin: 5px 0;"><strong>Partner Type:</strong> ${partnerType}</p>
                        </div>

                        <h3>📝 Message</h3>
                        <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${message}</p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        
                        <p style="text-align: center;">
                            <a href="mailto:${email}?subject=Re: Partnership Inquiry from ${organizationName}" 
                               style="background: #c3151c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                Reply to ${contactName}
                            </a>
                        </p>
                    </div>
                `
            });
        } catch (adminEmailErr) {
            console.error('Admin notification failed:', adminEmailErr);
        }

        res.json({ message: 'Partnership inquiry submitted successfully' });

    } catch (err) {
        console.error('Partner inquiry error:', err);
        res.status(500).json({ error: 'Failed to process inquiry' });
    }
});

/**
 * POST /api/inquiries/host - Host company registration
 */
router.post('/host', async (req, res) => {
    try {
        const { companyName, contactPerson, email, rolesNeeded } = req.body;

        // Validation
        if (!companyName || !contactPerson || !email || !rolesNeeded) {
            return res.status(400).json({ error: 'Please fill in all required fields' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Send confirmation email to company
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: [email],
                subject: '✅ Host Company Registration Received - Elitech Hub',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #c3151c;">Thank You for Registering as a Host Company! 🏢</h2>
                        <p>Dear ${contactPerson},</p>
                        <p>We've received <strong>${companyName}</strong>'s registration to host Elitech Hub interns.</p>
                        
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Registration Summary:</h3>
                            <p><strong>Company:</strong> ${companyName}</p>
                            <p><strong>Roles Needed:</strong> ${rolesNeeded}</p>
                        </div>
                        
                        <h3>What's Next?</h3>
                        <ol>
                            <li>Our team will review your company profile</li>
                            <li>We'll match you with qualified candidates</li>
                            <li>You'll receive candidate profiles within 1 week</li>
                        </ol>
                        
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
            console.error('Company email failed:', emailErr);
        }

        // Send notification to admin
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: [ADMIN_EMAIL],
                subject: `🏢 New Host Company: ${companyName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #c3151c;">New Host Company Registration 🎯</h2>
                        
                        <div style="background: #0a0a0a; color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #c3151c;">${companyName}</h3>
                            <p style="margin: 5px 0;"><strong>Contact Person:</strong> ${contactPerson}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #60a5fa;">${email}</a></p>
                            <p style="margin: 5px 0;"><strong>Roles Looking For:</strong> ${rolesNeeded}</p>
                        </div>
                        
                        <p><strong>Action Required:</strong> Review company and match with suitable graduates.</p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        
                        <p style="text-align: center;">
                            <a href="mailto:${email}?subject=Welcome to Elitech Hub Talent Network - ${companyName}" 
                               style="background: #c3151c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                Contact ${contactPerson}
                            </a>
                        </p>
                    </div>
                `
            });
        } catch (adminEmailErr) {
            console.error('Admin notification failed:', adminEmailErr);
        }

        res.json({ message: 'Host company registration successful' });

    } catch (err) {
        console.error('Host registration error:', err);
        res.status(500).json({ error: 'Failed to process registration' });
    }
});

/**
 * POST /api/inquiries/sponsor - Sponsorship inquiry
 */
router.post('/sponsor', async (req, res) => {
    try {
        const { name, email, organization, sponsorType, amount, message } = req.body;

        // Validation
        if (!name || !email || !sponsorType) {
            return res.status(400).json({ error: 'Please fill in all required fields' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Send confirmation email
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: [email],
                subject: '✅ Sponsorship Inquiry Received - Elitech Hub',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #c3151c;">Thank You for Your Generosity! 💖</h2>
                        <p>Dear ${name},</p>
                        <p>We've received your interest in sponsoring cybersecurity education through Elitech Hub.</p>
                        
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Sponsorship Interest:</h3>
                            <p><strong>Type:</strong> ${sponsorType}</p>
                            ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ''}
                        </div>
                        
                        <p>Our team will reach out within <strong>24 hours</strong> to discuss how your sponsorship can transform lives.</p>
                        
                        <p style="color: #10B981; font-weight: bold;">Every scholarship changes a life. Thank you for making a difference! 🌟</p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                            Elitech Hub - Cybersecurity Education Platform<br>
                            <a href="https://elitechhub.com" style="color: #c3151c;">elitechhub.com</a>
                        </p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Sponsor email failed:', emailErr);
        }

        // Send notification to admin
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: [ADMIN_EMAIL],
                subject: `💖 NEW SPONSOR INTEREST: ${name} - ${sponsorType}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #c3151c;">🎉 Potential Sponsor Alert!</h2>
                        
                        <div style="background: linear-gradient(135deg, #c3151c, #991B1B); color: white; padding: 30px; border-radius: 10px; margin: 20px 0; text-align: center;">
                            <h3 style="margin-top: 0; font-size: 24px;">${name}</h3>
                            <p style="font-size: 18px; opacity: 0.9;">Interested in: ${sponsorType}</p>
                            ${amount ? `<p style="font-size: 28px; font-weight: bold; margin: 10px 0;">${amount}</p>` : ''}
                        </div>

                        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px;">
                            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ''}
                            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
                        </div>
                        
                        <p style="color: #c3151c; font-weight: bold; text-align: center; margin-top: 20px;">
                            ⚡ RESPOND IMMEDIATELY - This is a hot lead!
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        
                        <p style="text-align: center;">
                            <a href="mailto:${email}?subject=Thank You for Supporting Elitech Hub" 
                               style="background: #c3151c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                📞 Contact ${name} Now
                            </a>
                        </p>
                    </div>
                `
            });
        } catch (adminEmailErr) {
            console.error('Admin notification failed:', adminEmailErr);
        }

        res.json({ message: 'Sponsorship inquiry submitted successfully' });

    } catch (err) {
        console.error('Sponsor inquiry error:', err);
        res.status(500).json({ error: 'Failed to process inquiry' });
    }
});

/**
 * POST /api/inquiries/student - Student program application
 */
router.post('/student', async (req, res) => {
    try {
        const { fullName, email, phone, program, experience, motivation } = req.body;

        // Validation
        if (!fullName || !email || !phone || !program || !experience || !motivation) {
            return res.status(400).json({ error: 'Please fill in all required fields' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Send confirmation email to applicant
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: [email],
                subject: '🎓 Application Received - Elitech Hub',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #c3151c; margin: 0;">Elitech Hub</h1>
                            <p style="color: #6b7280;">Cybersecurity Education</p>
                        </div>
                        
                        <h2 style="color: #0a0a0a;">Your Application Has Been Received! 🎉</h2>
                        <p>Dear ${fullName},</p>
                        <p>Thank you for applying to the <strong>${program}</strong> at Elitech Hub!</p>
                        
                        <div style="background: linear-gradient(135deg, #c3151c, #991B1B); color: white; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
                            <h3 style="margin: 0 0 10px 0;">What's Next?</h3>
                            <p style="margin: 0; opacity: 0.9;">Our admissions team will review your application and contact you within <strong>48 hours</strong>.</p>
                        </div>
                        
                        <h3 style="color: #0a0a0a;">Your Application Summary:</h3>
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px;">
                            <p><strong>Name:</strong> ${fullName}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Program:</strong> ${program}</p>
                        </div>
                        
                        <div style="margin-top: 25px; padding: 20px; background: #e6fffa; border-radius: 10px; border-left: 4px solid #10B981;">
                            <p style="margin: 0; color: #065f46;"><strong>💡 Pro Tip:</strong> While waiting, check out our <a href="https://elitechhub.com/blog" style="color: #c3151c;">blog</a> for free cybersecurity resources!</p>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                            Elitech Hub - Nigeria's #1 Cybersecurity Training Platform<br>
                            <a href="https://elitechhub.com" style="color: #c3151c;">elitechhub.com</a>
                        </p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Applicant email failed:', emailErr);
        }

        // Send notification to admin
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: [ADMIN_EMAIL],
                subject: `🎓 NEW STUDENT APPLICATION: ${fullName} - ${program}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #c3151c;">🎓 New Student Application!</h2>
                        
                        <div style="background: linear-gradient(135deg, #0a0a0a, #1f2937); color: white; padding: 25px; border-radius: 12px; margin: 20px 0;">
                            <h3 style="margin: 0 0 15px 0; color: #c3151c; font-size: 24px;">${fullName}</h3>
                            <div style="display: grid; gap: 10px;">
                                <p style="margin: 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #60a5fa;">${email}</a></p>
                                <p style="margin: 0;"><strong>📱 Phone:</strong> <a href="tel:${phone}" style="color: #60a5fa;">${phone}</a></p>
                                <p style="margin: 0;"><strong>📚 Program:</strong> ${program}</p>
                            </div>
                        </div>

                        <h3>💼 Experience Level</h3>
                        <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${experience}</p>

                        <h3>🎯 Motivation</h3>
                        <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${motivation}</p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
                        
                        <div style="text-align: center;">
                            <a href="mailto:${email}?subject=Welcome to Elitech Hub - Your Application for ${program}" 
                               style="display: inline-block; background: #c3151c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                📞 Contact ${fullName}
                            </a>
                        </div>
                    </div>
                `
            });
        } catch (adminEmailErr) {
            console.error('Admin notification failed:', adminEmailErr);
        }

        res.json({ message: 'Application submitted successfully! Check your email for confirmation.' });

    } catch (err) {
        console.error('Student application error:', err);
        res.status(500).json({ error: 'Failed to process application' });
    }
});

export default router;
