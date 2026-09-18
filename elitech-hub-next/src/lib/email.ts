/**
 * Email Service using Resend
 * Matches the templates from the old backend's email.js
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'Elitech Hub <onboarding@resend.dev>';
const ADMIN = process.env.ADMIN_EMAIL || 'Elijah@elitechub.com';

// ─── APPLICATION EMAILS ────────────────────────────────────────────────────

export async function sendApplicationConfirmation({
  to,
  name,
  program,
}: {
  to: string;
  name: string;
  program: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to: [to],
      subject: '✅ Application Received — Elitech Hub',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#c3151c;">Application Received! 🎉</h2>
          <p>Hi ${name},</p>
          <p>We've received your application for the <strong>${program}</strong> program at Elitech Hub.</p>
          <div style="background:#f3f4f6;padding:20px;border-radius:10px;margin:20px 0;">
            <p style="margin:0;font-weight:bold;">What happens next?</p>
            <p>Our admissions team will review your application and contact you within <strong>24–48 hours</strong>.</p>
          </div>
          <p>Questions? Reply to this email or message us on WhatsApp.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
          <p style="color:#9ca3af;font-size:12px;text-align:center;">Elitech Hub — Nigeria's #1 AI Cybersecurity Training<br>
            <a href="https://elitechub.com" style="color:#c3151c;">elitechub.com</a>
          </p>
        </div>`,
    });
  } catch (err) {
    console.error('[Email] Application confirmation failed:', err);
  }
}

export async function sendApplicationNotification(data: {
  applicantName: string;
  email: string;
  phone: string;
  program: string;
  country: string;
  city: string;
  skillLevel: string;
  motivation: string;
  source: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to: [ADMIN],
      subject: `🚀 New Application: ${data.applicantName} — ${data.program}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:20px;">
          <h2 style="color:#c3151c;">New Bootcamp Application 📋</h2>
          <div style="background:#0a0a0a;color:white;padding:20px;border-radius:10px;margin:20px 0;">
            <h3 style="color:#c3151c;margin-top:0;">${data.applicantName}</h3>
            <p style="margin:5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color:#60a5fa;">${data.email}</a></p>
            <p style="margin:5px 0;"><strong>Phone:</strong> ${data.phone}</p>
            <p style="margin:5px 0;"><strong>Location:</strong> ${data.city}, ${data.country}</p>
            <p style="margin:5px 0;"><strong>Program:</strong> ${data.program}</p>
            <p style="margin:5px 0;"><strong>Skill Level:</strong> ${data.skillLevel}</p>
            <p style="margin:5px 0;"><strong>Source:</strong> ${data.source}</p>
          </div>
          <h3>💬 Motivation</h3>
          <p style="background:#f3f4f6;padding:15px;border-radius:8px;">${data.motivation}</p>
          <div style="text-align:center;margin-top:20px;">
            <a href="mailto:${data.email}?subject=Re: Your Elitech Hub Application" 
               style="background:#c3151c;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">
              Reply to Applicant
            </a>
          </div>
        </div>`,
    });
  } catch (err) {
    console.error('[Email] Application notification failed:', err);
  }
}

// ─── CONTACT / INQUIRY EMAILS ──────────────────────────────────────────────

export async function sendContactConfirmation({ to, name }: { to: string; name: string }) {
  try {
    await resend.emails.send({
      from: FROM,
      to: [to],
      subject: '✅ Message Received — Elitech Hub',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#c3151c;">We got your message! 👋</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out to Elitech Hub. Our team will get back to you within <strong>1–2 business days</strong>.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
          <p style="color:#9ca3af;font-size:12px;text-align:center;">
            <a href="https://elitechub.com" style="color:#c3151c;">elitechub.com</a>
          </p>
        </div>`,
    });
  } catch (err) {
    console.error('[Email] Contact confirmation failed:', err);
  }
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  program: string;
  message: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to: [ADMIN],
      subject: `📬 New Contact: ${data.name} (${data.program})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:20px;">
          <h2 style="color:#c3151c;">New Contact Form Submission</h2>
          <div style="background:#0a0a0a;color:white;padding:20px;border-radius:10px;margin:20px 0;">
            <p style="margin:5px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin:5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color:#60a5fa;">${data.email}</a></p>
            ${data.phone ? `<p style="margin:5px 0;"><strong>Phone:</strong> ${data.phone}</p>` : ''}
            <p style="margin:5px 0;"><strong>Interest:</strong> ${data.program}</p>
          </div>
          <h3>📝 Message</h3>
          <p style="background:#f3f4f6;padding:15px;border-radius:8px;">${data.message}</p>
          <div style="text-align:center;margin-top:20px;">
            <a href="mailto:${data.email}?subject=Re: Your Elitech Hub Inquiry"
               style="background:#c3151c;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">
              Reply to ${data.name}
            </a>
          </div>
        </div>`,
    });
  } catch (err) {
    console.error('[Email] Contact notification failed:', err);
  }
}

// ─── NEWSLETTER ────────────────────────────────────────────────────────────

export async function sendNewsletterWelcome({ to }: { to: string }) {
  try {
    await resend.emails.send({
      from: FROM,
      to: [to],
      subject: '🛡️ Welcome to the Elitech Hub Newsletter!',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#c3151c;">You're subscribed! 🎉</h2>
          <p>Welcome to the Elitech Hub community. You'll receive cybersecurity tips, program updates, and industry news straight to your inbox.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
          <p style="color:#9ca3af;font-size:12px;text-align:center;">
            <a href="https://elitechub.com" style="color:#c3151c;">elitechub.com</a> · 
            <a href="https://elitechub.com/policies" style="color:#9ca3af;">Unsubscribe</a>
          </p>
        </div>`,
    });
  } catch (err) {
    console.error('[Email] Newsletter welcome failed:', err);
  }
}

// ─── VOLUNTEER ─────────────────────────────────────────────────────────────

export async function sendVolunteerConfirmation({ to, name, role }: { to: string; name: string; role: string }) {
  try {
    await resend.emails.send({
      from: FROM,
      to: [to],
      subject: '✅ Volunteer Application Received — Elitech Hub',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#c3151c;">Application Received! 🙌</h2>
          <p>Hi ${name},</p>
          <p>We've received your volunteer application for the <strong>${role}</strong> role at Elitech Hub.</p>
          <p>We review applications weekly and will reach out if you're a good fit. Thank you for your interest in contributing to Africa's cybersecurity future!</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
          <p style="color:#9ca3af;font-size:12px;text-align:center;">
            <a href="https://elitechub.com" style="color:#c3151c;">elitechub.com</a>
          </p>
        </div>`,
    });
  } catch (err) {
    console.error('[Email] Volunteer confirmation failed:', err);
  }
}

export async function sendVolunteerNotification(data: {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  motivation: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to: [ADMIN],
      subject: `🙋 New Volunteer: ${data.fullName} — ${data.role}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:20px;">
          <h2 style="color:#c3151c;">New Volunteer Application</h2>
          <div style="background:#0a0a0a;color:white;padding:20px;border-radius:10px;margin:20px 0;">
            <p style="margin:5px 0;"><strong>Name:</strong> ${data.fullName}</p>
            <p style="margin:5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color:#60a5fa;">${data.email}</a></p>
            <p style="margin:5px 0;"><strong>Phone:</strong> ${data.phone}</p>
            <p style="margin:5px 0;"><strong>Role:</strong> ${data.role}</p>
            <p style="margin:5px 0;"><strong>Location:</strong> ${data.location}</p>
          </div>
          <h3>💬 Motivation</h3>
          <p style="background:#f3f4f6;padding:15px;border-radius:8px;">${data.motivation}</p>
        </div>`,
    });
  } catch (err) {
    console.error('[Email] Volunteer notification failed:', err);
  }
}

// ─── PASSWORD RESET EMAIL ────────────────────────────────────────────────────

export async function sendPasswordResetEmail({
  to,
  name,
  resetLink,
}: {
  to: string;
  name: string;
  resetLink: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to: [to],
      subject: '🔐 Reset Your Elitech Hub Password',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#c3151c;">Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset the password for your Elitech Hub account.
             Click the button below to create a new password. This link expires in <strong>1 hour</strong>.</p>

          <div style="text-align:center;margin:32px 0;">
            <a href="${resetLink}"
               style="background:#c3151c;color:#ffffff;padding:14px 32px;border-radius:8px;
                      text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
              Reset My Password
            </a>
          </div>

          <p style="font-size:13px;color:#6b7280;">
            Or paste this link into your browser:<br>
            <a href="${resetLink}" style="color:#c3151c;word-break:break-all;">${resetLink}</a>
          </p>

          <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:16px;margin:24px 0;">
            <p style="margin:0;font-size:13px;color:#856404;">
              <strong>⚠️ Security notice:</strong> If you did not request this reset, you can safely ignore
              this email. Your password will not change. If you're concerned about your account security,
              please contact us immediately at <a href="mailto:security@elitechub.com">security@elitechub.com</a>.
            </p>
          </div>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
          <p style="color:#9ca3af;font-size:12px;text-align:center;">
            Elitech Hub — Nigeria's #1 AI Cybersecurity Training<br>
            <a href="https://elitechub.com" style="color:#c3151c;">elitechub.com</a>
          </p>
        </div>`,
    });
  } catch (err) {
    console.error('[Email] Password reset email failed:', err);
  }
}
