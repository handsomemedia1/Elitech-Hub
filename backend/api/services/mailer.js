import nodemailer from 'nodemailer';

// Universal Mailer supporting any SMTP provider (Brevo, SendGrid, Mailgun, etc.)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Wrapper that mimics the exact Resend SDK syntax so we don't have to rewrite routes
export const mailer = {
    emails: {
        send: async ({ from, to, subject, html }) => {
            try {
                // Ensure to is a string or comma-separated string
                const toAddress = Array.isArray(to) ? to.join(', ') : to;
                
                const info = await transporter.sendMail({
                    from,
                    to: toAddress,
                    subject,
                    html
                });
                return { data: info, error: null };
            } catch (err) {
                console.error('[SMTP Mailer Error]', err);
                return { data: null, error: err };
            }
        }
    }
};
