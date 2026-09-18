'use client';

import { useState } from 'react';
import styles from './ContactForm.module.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    program: '6-Week Bootcamp',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Failed to send message. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch {
      setServerError('An unexpected error occurred. Please try again later.');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', program: '6-Week Bootcamp', message: '' });
    setIsSubmitted(false);
    setServerError('');
  };

  if (isSubmitted) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h3>Message Sent Successfully!</h3>
          <p>Thank you for reaching out to Elitech Hub. Our team will get back to you within 1–2 business days. Check your inbox for a confirmation email.</p>
          <button onClick={resetForm} className={styles.resetBtn}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="John Doe"
            disabled={isSubmitting}
          />
          {errors.name && <span className={styles.errorText}>⚠ {errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="john@example.com"
            disabled={isSubmitting}
          />
          {errors.email && <span className={styles.errorText}>⚠ {errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>Phone Number (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
            placeholder="+234 ..."
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="program" className={styles.label}>Program Interest</label>
          <select
            id="program"
            name="program"
            value={formData.program}
            onChange={handleChange}
            className={styles.select}
            disabled={isSubmitting}
          >
            <option value="6-Week Bootcamp">6-Week Bootcamp</option>
            <option value="16-Week Professional">16-Week Professional</option>
            <option value="Corporate Training">Corporate Training</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>Your Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="How can we help you?"
            disabled={isSubmitting}
          />
          {errors.message && <span className={styles.errorText}>⚠ {errors.message}</span>}
        </div>

        {serverError && (
          <div className={styles.errorText} style={{ marginBottom: '1rem', display: 'block' }}>
            ⚠ {serverError}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message ➔'}
        </button>
      </form>
    </div>
  );
}
