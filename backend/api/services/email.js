/**
 * Email Service using Resend
 * (Switched from SendGrid due to availability issues)
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Elitech Hub <onboarding@resend.dev>';

/**
 * Send OTP email for MFA
 */
export async function sendOTPEmail(to, otp, name) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: 'Your Elitech Hub Login Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #c3151c; text-align: center;">🔐 Login Verification</h2>
                    <p>Hi ${name || 'Writer'},</p>
                    <p>Your one-time login code is:</p>
                    <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #c3151c;">${otp}</span>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        Elitech Hub - Cybersecurity Education Platform
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Resend OTP error:', error);
            return false;
        }

        console.log(`OTP sent to ${to}, ID: ${data?.id}`);
        return true;
    } catch (err) {
        console.error('Email send error:', err);
        return false;
    }
}

/**
 * Send reminder email to writer
 */
export async function sendReminderEmail(to, name, postingDay) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `📝 Reminder: It's your posting day!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #c3151c;">Hi ${name}! 👋</h2>
                    <p>Today is <strong>${postingDay}</strong> - one of your scheduled posting days!</p>
                    <p>Don't forget to write and publish your blog post.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://elitechhub.com/writer.html" style="background: #c3151c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Open Writer Panel
                        </a>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">Need help? Reply to this email.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        Elitech Hub - Content Team
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Resend reminder error:', error);
            return false;
        }

        console.log(`Reminder sent to ${to}`);
        return true;
    } catch (err) {
        console.error('Reminder send error:', err);
        return false;
    }
}

/**
 * Send missed post follow-up
 */
export async function sendMissedPostEmail(to, name, postingDay) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `We missed your post today! 😢`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #c3151c;">Hi ${name},</h2>
                    <p>We noticed you didn't post anything today (${postingDay}).</p>
                    <p>Is everything okay? If you're having trouble, let us know!</p>
                    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #92400e;"><strong>💡 Tip:</strong> Even a short 300-word post is better than no post. Consistency is key for SEO!</p>
                    </div>
                    <p>We're here to help you succeed. Reply to this email if you need assistance.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        Elitech Hub - Content Team
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Resend missed post error:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Missed post send error:', err);
        return false;
    }
}

/**
 * Send application notification to admin
 */
export async function sendApplicationNotification(appData) {
    try {
        const { applicantName, email, phone, program, price, state, education, occupation, motivation } = appData;

        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@elitechhub.com.ng';

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [ADMIN_EMAIL],
            subject: `🚀 New Application: ${applicantName} - ${program}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #c3151c; border-bottom: 2px solid #c3151c; padding-bottom: 10px;">New Student Application</h2>
                    
                    <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0; color: #111827;">Program Details</h3>
                        <p><strong>Program:</strong> ${program}</p>
                        <p><strong>Price:</strong> ₦${price.toLocaleString()}</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #111827;">Applicant Information</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; width: 120px;">Name:</td>
                                <td style="padding: 8px 0; font-weight: 500;">${applicantName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Email:</td>
                                <td style="padding: 8px 0; font-weight: 500;"><a href="mailto:${email}" style="color: #c3151c;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
                                <td style="padding: 8px 0; font-weight: 500;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">State:</td>
                                <td style="padding: 8px 0; font-weight: 500;">${state || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Education:</td>
                                <td style="padding: 8px 0; font-weight: 500;">${education || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280;">Occupation:</td>
                                <td style="padding: 8px 0; font-weight: 500;">${occupation || 'N/A'}</td>
                            </tr>
                        </table>
                    </div>

                    ${motivation ? `
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #111827;">Motivation</h3>
                        <p style="background: #f3f4f6; padding: 15px; border-radius: 6px; font-style: italic; color: #4b5563;">"${motivation}"</p>
                    </div>
                    ` : ''}

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="mailto:${email}?subject=Regarding your Elitech Hub Application" style="background: #c3151c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Reply to Student
                        </a>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Admin notification error:', error);
            return false;
        }

        console.log(`Admin application notification sent to ${ADMIN_EMAIL}`);
        return true;
    } catch (err) {
        console.error('Email send error:', err);
        return false;
    }
}

/**
 * Send application confirmation to applicant
 */
export async function sendApplicationConfirmation(data) {
    try {
        const { to, name, program, price } = data;

        const response = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `Application Received: ${program} at Elitech Hub`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                       <h2 style="color: #c3151c; margin: 0;">Elitech<span style="color: #111827;">Hub</span></h2>
                    </div>
                    
                    <h2 style="color: #111827;">Hi ${name.split(' ')[0]},</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                        Thanks for applying to our <strong>${program}</strong>! We've received your application and our admissions team is reviewing it.
                    </p>
                    
                    <div style="background: #f0fdf4; border-left: 4px solid #c3151c; padding: 15px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #064e3b; font-size: 16px;">Next Step: Secure Your Spot</h3>
                        <p style="margin-bottom: 10px; color: #064e3b;">To complete your enrollment and secure your spot in the upcoming cohort, please proceed with the tuition payment.</p>
                        <p style="margin: 0;"><strong>Program Fee:</strong> ₦${price.toLocaleString()}</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://elitechhub.com/payment.html" style="background: #c3151c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                            Complete Payment Now
                        </a>
                    </div>

                    <p style="color: #6b7280; font-size: 14px;">
                        If you have any questions, feel free to reply to this email or chat with us on WhatsApp at +234 708 196 8062.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        © 2025 Elitech Hub Limited. Lagos, Nigeria.
                    </p>
                </div>
            `
        });

        if (response.error) {
            console.error('Applicant confirmation error:', response.error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Confirmation email error:', err);
        return false;
    }
}

export default { sendOTPEmail, sendReminderEmail, sendMissedPostEmail, sendApplicationNotification, sendApplicationConfirmation };
