import React from 'react';
import styles from './behavioral.module.css';
import { BookOpen, AlertCircle, Users, Shield, Brain, Target } from 'lucide-react';

export const metadata = {
  title: 'Behavioral Cybersecurity Research | Elitech Hub',
  description: 'Conceptual framework for our upcoming research pillar: The Human Firewall. Exploring the intersection of human psychology and technical security systems.',
  keywords: 'behavioral cybersecurity, human firewall, psychological security, cybersecurity research, human-centric security, social engineering research',
  alternates: {
    canonical: 'https://elitechub.com/research/behavioral-cybersecurity',
  },
  openGraph: {
    title: 'Behavioral Cybersecurity Research | Elitech Hub',
    description: 'Conceptual framework for our upcoming research pillar: The Human Firewall.',
    url: 'https://elitechub.com/research/behavioral-cybersecurity',
    type: 'website',
  }
};

export default function BehavioralCybersecurityPage() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.conceptualBadge}>
            <AlertCircle size={16} />
            <span>Conceptual Research Framework</span>
          </div>
          <h1 className={styles.title}>The Human Firewall</h1>
          <p className={styles.subtitle}>
            Behavioral Factors in Cybersecurity Control Failure. Exploring the intersection of human psychology and technical security systems.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <BookOpen className={styles.icon} size={28} />
              <h2>Introduction</h2>
            </div>
            <p className={styles.text}>
              Despite continuous advancements in technical security controls, the human element remains one of the most critical vulnerabilities in modern cybersecurity architectures. This conceptual framework outlines our upcoming research initiative aimed at understanding why humans bypass, ignore, or fail to engage with established security controls.
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Users className={styles.icon} size={28} />
              <h2>Human Factors in Cybersecurity</h2>
            </div>
            <p className={styles.text}>
              Traditional security models often view users as the "weakest link" rather than an integral part of the defense mechanism. We are investigating how cognitive load, stress, and workflow friction contribute to control circumvention. Key areas include:
            </p>
            <ul className={styles.list}>
              <li>Security fatigue and alert habituation.</li>
              <li>The conflict between productivity requirements and security mandates.</li>
              <li>Cultural norms within organizations that normalize insecure behaviors.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Brain className={styles.icon} size={28} />
              <h2>Security Decision-Making</h2>
            </div>
            <p className={styles.text}>
              How do individuals evaluate risk in real-time? Our behavioral analysis aims to model the cognitive processes that occur at the moment a security decision is made, examining heuristic biases and risk perception disparities between security professionals and general end-users.
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Target className={styles.icon} size={28} />
              <h2>Phishing Susceptibility & Social Engineering</h2>
            </div>
            <p className={styles.text}>
              Beyond simple awareness training, we explore the emotional triggers—such as urgency, fear, and authority—that adversaries exploit. This research will catalog psychological manipulation techniques and propose adaptive training models that build genuine cognitive resilience rather than mere compliance.
            </p>
          </section>

          <section className={styles.infoBox}>
            <Shield className={styles.infoIcon} size={32} />
            <div>
              <h3>Future Research Pillar</h3>
              <p>
                This framework represents a foundational pillar for our upcoming lab initiatives. We are actively seeking partnerships with organizational psychologists and cybersecurity researchers to expand this study.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
