'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FREE_QUESTIONS, scoreAssessment } from '@/data/beforeCybersecurityAssessment';

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = FREE_QUESTIONS;
  const totalQuestions = questions.length;
  const activeQuestion = questions[currentStep];

  // Load any previously saved progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bc_assessment_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers && typeof parsed.answers === 'object') {
          setAnswers(parsed.answers);
        }
        if (typeof parsed.step === 'number' && parsed.step < totalQuestions) {
          setCurrentStep(parsed.step);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [totalQuestions]);

  const handleSelectOption = (optionId: string) => {
    const updated = { ...answers, [activeQuestion.id]: optionId };
    setAnswers(updated);

    try {
      localStorage.setItem(
        'bc_assessment_progress',
        JSON.stringify({ answers: updated, step: currentStep })
      );
    } catch {
      // Ignore storage errors
    }
  };

  const handleNext = async () => {
    if (!answers[activeQuestion.id]) {
      alert('Please select an option to continue.');
      return;
    }

    if (currentStep < totalQuestions - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      try {
        localStorage.setItem(
          'bc_assessment_progress',
          JSON.stringify({ answers, step: nextStep })
        );
      } catch {
        // Ignore storage errors
      }
    } else {
      // Final submission
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/before-cybersecurity/assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, tier: 'free' }),
        });

        const data = await res.json();
        const scoredResult = data.result || scoreAssessment(answers, questions);

        // Save result locally for results page
        localStorage.setItem('bc_assessment_result', JSON.stringify(scoredResult));
        localStorage.removeItem('bc_assessment_progress');

        router.push('/before-cybersecurity/results');
      } catch (err) {
        console.error('Error submitting assessment:', err);
        // Fallback: local score calculation if API has network glitch
        const fallback = scoreAssessment(answers, questions);
        localStorage.setItem('bc_assessment_result', JSON.stringify(fallback));
        router.push('/before-cybersecurity/results');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = Math.round(((currentStep + 1) / totalQuestions) * 100);
  const selectedOptionId = answers[activeQuestion.id];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      color: '#F5F5F7',
      fontFamily: 'var(--font-inter), system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top Header */}
      <header style={{
        padding: '1.25rem 2rem',
        borderBottom: '1px solid #1F1F24',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0D0D10',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            background: '#C3151C',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            textTransform: 'uppercase',
          }}>
            Assessment
          </span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
            BEFORE CYBERSECURITY
          </span>
        </div>

        <Link
          href="/before-cybersecurity"
          style={{
            color: '#8E8E93',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            transition: 'color 0.2s',
          }}
        >
          ✕ Exit Assessment
        </Link>
      </header>

      {/* Progress Line */}
      <div style={{ width: '100%', height: '4px', backgroundColor: '#1A1A20' }}>
        <div style={{
          width: `${progressPercentage}%`,
          height: '100%',
          backgroundColor: '#C3151C',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Question Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem 1.5rem',
      }}>
        <div style={{ maxWidth: '680px', width: '100%' }}>
          {/* Step Metadata */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            color: '#71717A',
            fontFamily: 'monospace',
          }}>
            <span>QUESTION {currentStep + 1} OF {totalQuestions}</span>
            <span>{activeQuestion.category}</span>
          </div>

          {/* Question Title */}
          <h1 style={{
            fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
            fontWeight: 700,
            lineHeight: 1.35,
            color: '#FFFFFF',
            marginBottom: activeQuestion.subtitle ? '0.5rem' : '2rem',
          }}>
            {activeQuestion.title}
          </h1>

          {activeQuestion.subtitle && (
            <p style={{
              fontSize: '0.9rem',
              color: '#8E8E93',
              marginBottom: '2rem',
            }}>
              {activeQuestion.subtitle}
            </p>
          )}

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id;
              const optionLetters = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(195, 21, 28, 0.12)' : '#111114',
                    border: isSelected ? '2px solid #C3151C' : '1px solid #24242A',
                    color: '#F5F5F7',
                    padding: '1.15rem 1.25rem',
                    borderRadius: '10px',
                    textAlign: 'left',
                    fontSize: '1rem',
                    lineHeight: 1.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    transition: 'border-color 0.15s, background-color 0.15s',
                  }}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isSelected ? '#C3151C' : '#1C1C22',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    {optionLetters[idx]}
                  </span>
                  <span style={{ flex: 1 }}>{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div style={{
            marginTop: '3rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentStep === 0 ? '#3F3F46' : '#8E8E93',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                padding: '0.6rem 1rem',
              }}
            >
              ← Back
            </button>

            <button
              onClick={handleNext}
              disabled={isSubmitting || !selectedOptionId}
              style={{
                backgroundColor: !selectedOptionId ? '#3F3F46' : '#C3151C',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.85rem 2rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: !selectedOptionId ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s, transform 0.15s',
              }}
            >
              {isSubmitting
                ? 'Scoring...'
                : currentStep === totalQuestions - 1
                ? 'Complete & View Results →'
                : 'Next Question →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
