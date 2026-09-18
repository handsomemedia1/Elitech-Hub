"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import styles from "./FAQAccordion.module.css";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Do I need prior coding experience?",
    answer: "No prior coding experience is required for the beginner tracks. Our curriculum is designed to take you from fundamentals to advanced cybersecurity concepts step-by-step. We start with networking and OS basics before diving into offensive and defensive tactics."
  },
  {
    question: "Is this program online or physical?",
    answer: "Currently, Elitech Hub runs highly interactive online cohorts to accommodate students globally. We use a combination of live instructor-led sessions, recorded materials, and 24/7 access to our cloud-based cyber labs for hands-on practice."
  },
  {
    question: "Will I get a certificate after completion?",
    answer: "Yes, you will receive an official Elitech Hub Certificate of Completion. More importantly, our curriculum prepares you to sit for and pass industry-recognized certifications like CompTIA Security+, CEH, and eJPT."
  },
  {
    question: "Do you offer job placement assistance?",
    answer: "Yes! We have an aggressive career pipeline. Top-performing students are placed in our internal SOC (Security Operations Center) simulation and are highly recommended to our partner organizations for internships and junior analyst roles."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      {faqs.map((faq, index) => (
        <div key={index} className={styles.faqItem}>
          <button
            className={`${styles.faqTrigger} ${openIndex === index ? styles.active : ""}`}
            onClick={() => toggle(index)}
          >
            <span className={styles.faqQuestion}>{faq.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ChevronDown size={20} className={styles.chevron} />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ overflow: "hidden" }}
              >
                <div className={styles.faqAnswer}>
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
