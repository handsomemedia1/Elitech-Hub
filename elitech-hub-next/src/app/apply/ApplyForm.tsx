'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './apply.module.css';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  program: string;
  source: string;
  skillLevel: string;
  motivation: string;
  agreedToTerms: boolean;
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  program: '',
  source: '',
  skillLevel: '',
  motivation: '',
  agreedToTerms: false,
};

export default function ApplyForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (serverError) setServerError('');
  };

  const nextStep = () => { if (step < totalSteps) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Failed to submit application. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setServerError('An unexpected error occurred. Please try again later.');
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.fullName && formData.email && formData.phone && formData.country && formData.city;
  const isStep2Valid = formData.program && formData.source && formData.skillLevel && formData.motivation;
  const isStep3Valid = formData.agreedToTerms;

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  if (isSubmitted) {
    return (
      <motion.div
        className={styles.formWrapper}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.successScreen}>
          <div className={styles.successIcon}>✓</div>
          <h3 className={styles.successTitle}>Application Submitted!</h3>
          <p className={styles.successText}>
            Thank you for applying to Elitech Hub. Our admissions team will review your application and reach out within 24–48 hours. Check your inbox for a confirmation email.
          </p>
          <a href="https://wa.me/2347081968062" target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Follow up on WhatsApp
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.stepContent}
              >
                <h3>Step 1: Personal Information</h3>

                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="John Doe" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+234 ..." />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label htmlFor="country">Country</label>
                    <select id="country" name="country" value={formData.country} onChange={handleInputChange} required>
                      <option value="">Select Country</option>
                      <option value="NG">Nigeria</option>
                      <option value="GH">Ghana</option>
                      <option value="KE">Kenya</option>
                      <option value="ZA">South Africa</option>
                      <option value="UK">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required placeholder="Lagos" />
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <div></div>
                  <button type="button" className={`${styles.btn} ${styles.btnNext}`} onClick={nextStep} disabled={!isStep1Valid}>
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.stepContent}
              >
                <h3>Step 2: Program Selection</h3>

                <div className={styles.formGroup}>
                  <label htmlFor="program">Which program are you interested in?</label>
                  <select id="program" name="program" value={formData.program} onChange={handleInputChange} required>
                    <option value="">Select a Program</option>
                    <option value="6-Week Bootcamp">6-Week AI Cybersecurity Bootcamp</option>
                    <option value="16-Week Professional">16-Week Professional Program</option>
                    <option value="Not Sure Yet">Not Sure Yet</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="skillLevel">Current Skill Level</label>
                  <select id="skillLevel" name="skillLevel" value={formData.skillLevel} onChange={handleInputChange} required>
                    <option value="">Select Skill Level</option>
                    <option value="Complete Beginner">Complete Beginner</option>
                    <option value="Some IT Background">Some IT Background</option>
                    <option value="IT Professional">IT Professional</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="source">How did you hear about us?</label>
                  <select id="source" name="source" value={formData.source} onChange={handleInputChange} required>
                    <option value="">Select an option</option>
                    <option value="Google">Google Search</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Friend">Friend / Referral</option>
                    <option value="WhatsApp">WhatsApp Group</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="motivation">Why do you want to learn cybersecurity?</label>
                  <textarea id="motivation" name="motivation" value={formData.motivation} onChange={handleInputChange} rows={4} required placeholder="Briefly describe your goals..." />
                </div>

                <div className={styles.buttonGroup}>
                  <button type="button" className={`${styles.btn} ${styles.btnBack}`} onClick={prevStep}>Back</button>
                  <button type="button" className={`${styles.btn} ${styles.btnNext}`} onClick={nextStep} disabled={!isStep2Valid}>Review</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.stepContent}
              >
                <h3>Step 3: Review &amp; Confirm</h3>

                <div className={styles.reviewSection}>
                  <div className={styles.reviewItem}>
                    <div className={styles.reviewLabel}>Applicant</div>
                    <div className={styles.reviewValue}>{formData.fullName} ({formData.email})</div>
                  </div>
                  <div className={styles.reviewItem}>
                    <div className={styles.reviewLabel}>Location</div>
                    <div className={styles.reviewValue}>{formData.city}, {formData.country}</div>
                  </div>
                  <div className={styles.reviewItem}>
                    <div className={styles.reviewLabel}>Program</div>
                    <div className={styles.reviewValue}>{formData.program}</div>
                  </div>
                  <div className={styles.reviewItem}>
                    <div className={styles.reviewLabel}>Skill Level</div>
                    <div className={styles.reviewValue}>{formData.skillLevel}</div>
                  </div>
                </div>

                <div className={styles.checkbox}>
                  <input type="checkbox" id="agreedToTerms" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleInputChange} required />
                  <label htmlFor="agreedToTerms">
                    I confirm that the information provided is accurate. I understand that submitting this application does not guarantee admission, that all payments are strictly non-refundable, and I agree to Elitech Hub&apos;s terms of service and privacy policy.
                  </label>
                </div>

                {serverError && (
                  <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>⚠ {serverError}</p>
                )}

                <div className={styles.buttonGroup}>
                  <button type="button" className={`${styles.btn} ${styles.btnBack}`} onClick={prevStep}>Back</button>
                  <button type="submit" className={`${styles.btn} ${styles.btnNext}`} disabled={!isStep3Valid || isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
