// ============================================================
// Before Cybersecurity — Assessment Engine & Question Bank
// Two tiers: Free (14 questions) and Full (32 questions)
// ============================================================

export type ArchetypeId =
  | 'builder'
  | 'investigator'
  | 'defender'
  | 'researcher'
  | 'analyst'
  | 'strategist'
  | 'communicator'
  | 'organizer';

export interface ArchetypeProfile {
  id: ArchetypeId;
  name: string;
  tagline: string;
  description: string;
  transferableStrengths: string[];
  recommendedRoles: string[];
  firstLearningPriorities: string[];
  initialDeliverables: string[];
  bookReference: string;
}

export interface AssessmentOption {
  id: string;
  text: string;
  archetypeWeights: Partial<Record<ArchetypeId, number>>;
  dimension: string;
}

export interface AssessmentQuestion {
  id: string;
  number: number;
  tier: 'free' | 'full';
  category: string;
  title: string;
  subtitle?: string;
  options: AssessmentOption[];
}

export const ARCHETYPES: Record<ArchetypeId, ArchetypeProfile> = {
  builder: {
    id: 'builder',
    name: 'The Builder',
    tagline: 'Engineering resilient systems and automating defensive pipelines.',
    description: 'You enjoy creating, assembling, and configuring systems that work reliably. You prefer writing automation scripts, architecting cloud environments, and implementing security guardrails into development workflows rather than purely observing or reacting.',
    transferableStrengths: ['Scripting/coding comfort', 'System administration intuition', 'Infrastructure awareness', 'Iterative debugging'],
    recommendedRoles: ['Security Engineer', 'Cloud Security Architect', 'DevSecOps Specialist', 'Application Security Engineer'],
    firstLearningPriorities: ['Operating system internals (Ch. 8)', 'Network routing & ports (Ch. 9)', 'Infrastructure as Code & CI/CD basics', 'Host hardening scripts'],
    initialDeliverables: ['Automated firewall configuration script', 'Hardened Linux server baseline', 'Documented Docker container lab'],
    bookReference: 'Chapter 26 (Page 11) — Builder / Defender Direction',
  },
  investigator: {
    id: 'investigator',
    name: 'The Investigator',
    tagline: 'Uncovering digital evidence, tracing root causes, and solving technical mysteries.',
    description: 'When something goes wrong or an anomaly appears, you cannot rest until you know exactly why, when, and how it occurred. You thrive on examining server logs, correlating timestamps, memory dumps, and dissecting forensic artifacts.',
    transferableStrengths: ['Attention to anomalous detail', 'Root-cause persistence', 'Evidence-first mindset', 'Pattern recognition'],
    recommendedRoles: ['Digital Forensics & Incident Response (DFIR)', 'Malware Analyst', 'Threat Hunter', 'Forensic Investigator'],
    firstLearningPriorities: ['Log interpretation & telemetry (Ch. 9, 12)', 'File system structures & artifacts', 'Network packet capture (Wireshark)', 'Incident triage methodology'],
    initialDeliverables: ['Synthetic SSH/web intrusion analysis write-up', 'Timeline reconstruction of a test breach', 'Memory acquisition lab report'],
    bookReference: 'Chapter 26 (Page 11) — Investigator / Analyst Direction',
  },
  defender: {
    id: 'defender',
    name: 'The Defender',
    tagline: 'Safeguarding infrastructure, monitoring telemetry, and rapid incident triage.',
    description: 'You have a natural protective instinct. You take satisfaction in maintaining visibility over network traffic, configuring defensive perimeter rules, detecting intrusion attempts, and ensuring systems remain operational and resilient under pressure.',
    transferableStrengths: ['Situational vigilance', 'Calm prioritization under stress', 'Systems-level thinking', 'Defensive mindset'],
    recommendedRoles: ['SOC Analyst (Tier 1/2)', 'Blue Team Engineer', 'Network Security Administrator', 'Defensive Operations Specialist'],
    firstLearningPriorities: ['TCP/UDP protocols & ports (Ch. 9)', 'SIEM log ingestion and alert tuning', 'MITRE ATT&CK defensive mapping (Ch. 12)', 'Incident response playbooks'],
    initialDeliverables: ['Home network segment diagram (Ch. 28)', 'Configured local intrusion detection rule (Snort/Suricata)', 'Documented alert triage flow'],
    bookReference: 'Chapter 26 (Page 11) — Builder / Defender Direction',
  },
  researcher: {
    id: 'researcher',
    name: 'The Researcher',
    tagline: 'Probing assumptions, finding edge-case vulnerabilities, and offensive testing.',
    description: 'You look at a finished system and immediately wonder: "What assumption did the creators make that is not true in reality?" You enjoy disciplined, authorized offensive testing, reverse engineering, and understanding attack mechanisms to make defense stronger.',
    transferableStrengths: ['Challenging assumptions', 'Tenacious problem deconstruction', 'Curiosity for edge cases', 'Technical agility'],
    recommendedRoles: ['Penetration Tester / Ethical Hacker', 'Vulnerability Researcher', 'Red Team Operator', 'Application Security Tester'],
    firstLearningPriorities: ['Legal boundaries & written authorization (Ch. 18)', 'Web protocol internals (HTTP/S, APIs)', 'Buffer & memory basics', 'OWASP Top 10 mechanisms'],
    initialDeliverables: ['Local authorized web application vulnerability audit', 'Explanatory write-up of an OWASP flaw (Ch. 22)', 'Documented CTF lab resolution'],
    bookReference: 'Chapter 26 (Page 11) — Researcher / Strategist Direction',
  },
  analyst: {
    id: 'analyst',
    name: 'The Analyst / Problem Solver',
    tagline: 'Connecting dots across threat intelligence, data feeds, and business risks.',
    description: 'You enjoy organizing complex information, tracking attacker groups (threat actors), and translating disparate technical data into structured insight. You naturally bridge technical telemetry with organizational risk decisions.',
    transferableStrengths: ['Data synthesis', 'Structured research habits', 'Clear technical writing', 'Risk modeling'],
    recommendedRoles: ['Cyber Threat Intelligence (CTI) Analyst', 'Security Operations Analyst', 'Vulnerability Management Analyst', 'Cyber Risk Analyst'],
    firstLearningPriorities: ['Threat intelligence feeds & STIX/TAXII', 'Common Vulnerabilities and Exposures (CVE) analysis', 'NIST Cybersecurity Framework 2.0 (Ch. 5)', 'Analytical briefing memos'],
    initialDeliverables: ['Threat intelligence briefing on a current campaign', 'Vulnerability exposure assessment report', 'Sector impact scenario analysis (Ch. 6)'],
    bookReference: 'Chapter 26 (Page 11) — Investigator / Analyst Direction',
  },
  strategist: {
    id: 'strategist',
    name: 'The Strategist',
    tagline: 'Aligning security architecture with long-term business objectives and threat landscapes.',
    description: 'You think several moves ahead. You enjoy understanding organizational priorities, defining zero-trust boundaries, threat modeling complex architectures, and helping executives make sound risk investments rather than reacting to headlines.',
    transferableStrengths: ['Big-picture systems vision', 'Business-technology alignment', 'Risk prioritization', 'Executive communication'],
    recommendedRoles: ['Security Architect', 'Enterprise Risk Manager', 'Virtual CISO (vCISO) Advisor', 'Identity & Access Architect'],
    firstLearningPriorities: ['Enterprise architecture & Zero Trust principles', 'NIST SP 800-181 NICE framework (Ch. 3)', 'Business impact analysis & threat modeling', 'Security metrics & budgeting'],
    initialDeliverables: ['Architecture threat model for a web service', 'Risk tolerance assessment memo', 'Zero-trust transition roadmap'],
    bookReference: 'Chapter 26 (Page 11) — Researcher / Strategist Direction',
  },
  communicator: {
    id: 'communicator',
    name: 'The Communicator',
    tagline: 'Translating technical security into human understanding, policy, and behavior.',
    description: 'You recognize that the human element is the heart of security. You excel at explaining complex technical concepts in plain language, creating engaging security training, managing crisis communications, and shaping positive security culture.',
    transferableStrengths: ['Empathy and verbal clarity', 'Engaging educational design', 'Persuasive writing', 'Interdisciplinary translation'],
    recommendedRoles: ['Security Awareness Manager', 'Cybersecurity Technical Writer', 'Security Culture Specialist', 'Cybersecurity Educator / Trainer'],
    firstLearningPriorities: ['Social engineering psychology & heuristics (Ch. 17)', 'Clear technical documentation standards', 'Security policy formulation (Ch. 18)', 'Educational instructional design'],
    initialDeliverables: ['Engaging phishing awareness briefing guide', 'Clear end-user password & MFA onboarding guide', 'Published technical explainer article'],
    bookReference: 'Chapter 26 (Page 11) — Communicator / Organizer Direction',
  },
  organizer: {
    id: 'organizer',
    name: 'The Organizer / GRC',
    tagline: 'Ensuring governance, regulatory compliance, data privacy, and audit integrity.',
    description: 'You take pride in structured processes, thorough documentation, statutory compliance, and objective audit evidence. You thrive when navigating data protection laws (like the NDPA 2023 or GDPR), industry certifications (ISO 27001, SOC 2), and risk registers.',
    transferableStrengths: ['Regulatory and statutory rigor', 'Process discipline', 'Audit trail verification', 'Risk documentation'],
    recommendedRoles: ['Governance, Risk & Compliance (GRC) Analyst', 'Data Privacy Officer (DPO)', 'Information Security Auditor', 'Compliance Assessor'],
    firstLearningPriorities: ['Nigeria Data Protection Act 2023 (Ch. 18)', 'ISO 27001 & SOC 2 control frameworks', 'Risk assessment methodologies (NIST SP 800-30)', 'Third-party vendor risk assessment'],
    initialDeliverables: ['Data mapping audit for personal data (NDPA)', 'Vendor security risk questionnaire template', 'Comprehensive risk register entry'],
    bookReference: 'Chapter 26 (Page 11) — Communicator / Organizer Direction',
  },
};

// 14 Free Assessment Questions
export const FREE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'free_1',
    number: 1,
    tier: 'free',
    category: 'Motivation & Curiosity',
    title: 'When you consider starting cybersecurity, what most strongly draws your interest?',
    subtitle: 'From Chapter 1: Auditing your genuine starting motivation.',
    options: [
      { id: 'f1_a', text: 'Understanding how computers and networks communicate under the hood.', archetypeWeights: { builder: 3, defender: 2 }, dimension: 'systems_thinking' },
      { id: 'f1_b', text: 'Investigating digital clues and discovering how a security incident happened.', archetypeWeights: { investigator: 3, analyst: 2 }, dimension: 'curiosity_investigation' },
      { id: 'f1_c', text: 'Testing systems to uncover hidden weaknesses before attackers find them.', archetypeWeights: { researcher: 3, builder: 1 }, dimension: 'offensive_inquiry' },
      { id: 'f1_d', text: 'Helping organizations comply with laws, protect client privacy, and manage risk.', archetypeWeights: { organizer: 3, strategist: 2 }, dimension: 'risk_governance' },
    ],
  },
  {
    id: 'free_2',
    number: 2,
    tier: 'free',
    category: 'Problem-Solving Approach',
    title: 'A software program crashes unexpectedly on your personal laptop. What is your first instinct?',
    subtitle: 'From Chapter 8 & 11: System layers and unexpected behavior.',
    options: [
      { id: 'f2_a', text: 'Open Event Viewer or system logs to see what error code and module caused the fault.', archetypeWeights: { investigator: 3, defender: 2 }, dimension: 'curiosity_investigation' },
      { id: 'f2_b', text: 'Check what input or memory boundary caused the crash to see if it can be reproduced.', archetypeWeights: { researcher: 3, builder: 2 }, dimension: 'offensive_inquiry' },
      { id: 'f2_c', text: 'Restart the service or check configuration files to quickly restore stability.', archetypeWeights: { defender: 3, builder: 1 }, dimension: 'defensive_hardening' },
      { id: 'f2_d', text: 'Document what happened, check if other users are impacted, and notify affected parties.', archetypeWeights: { organizer: 2, communicator: 3 }, dimension: 'human_factors' },
    ],
  },
  {
    id: 'free_3',
    number: 3,
    tier: 'free',
    category: 'Transferable Background',
    title: 'Which of these non-cybersecurity activities feels most satisfying to you in daily life?',
    subtitle: 'From Chapter 2: Inventorying your starting resources.',
    options: [
      { id: 'f3_a', text: 'Assembling furniture, building DIY electronics, or writing short scripts.', archetypeWeights: { builder: 3, defender: 1 }, dimension: 'engineering_building' },
      { id: 'f3_b', text: 'Reading investigative journalism, solving puzzles, or analyzing datasets.', archetypeWeights: { investigator: 3, analyst: 2 }, dimension: 'curiosity_investigation' },
      { id: 'f3_c', text: 'Organizing files, planning detailed itineraries, or reviewing contracts.', archetypeWeights: { organizer: 3, strategist: 1 }, dimension: 'structured_organization' },
      { id: 'f3_d', text: 'Teaching a friend a difficult concept, writing articles, or public speaking.', archetypeWeights: { communicator: 3, strategist: 1 }, dimension: 'human_factors' },
    ],
  },
  {
    id: 'free_4',
    number: 4,
    tier: 'free',
    category: 'Systems Thinking',
    title: 'When you learn that a website was breached, which question comes to your mind first?',
    subtitle: 'From Chapter 3 & 29: The five security questions.',
    options: [
      { id: 'f4_a', text: 'What technical vulnerability in the code or server port allowed the initial access?', archetypeWeights: { researcher: 2, builder: 2 }, dimension: 'systems_thinking' },
      { id: 'f4_b', text: 'What digital footprint or log entries revealed that an intruder was inside?', archetypeWeights: { investigator: 3, defender: 2 }, dimension: 'curiosity_investigation' },
      { id: 'f4_c', text: 'What customer data was exposed, and what legal penalties apply under data protection laws?', archetypeWeights: { organizer: 3, analyst: 1 }, dimension: 'risk_governance' },
      { id: 'f4_d', text: 'How will the company explain this breach honestly to customers and stakeholders?', archetypeWeights: { communicator: 3, strategist: 2 }, dimension: 'human_factors' },
    ],
  },
  {
    id: 'free_5',
    number: 5,
    tier: 'free',
    category: 'Work Environment',
    title: 'What style of day-to-day work environment energizes you most?',
    subtitle: 'From Chapter 26: The Work-Style Compass.',
    options: [
      { id: 'f5_a', text: 'Headphones on, deep in code, terminals, and architecture diagrams.', archetypeWeights: { builder: 3, researcher: 2 }, dimension: 'engineering_building' },
      { id: 'f5_b', text: 'Monitoring dashboards, responding to live alerts, and rapid tactical triage.', archetypeWeights: { defender: 3, investigator: 2 }, dimension: 'defensive_hardening' },
      { id: 'f5_c', text: 'Cross-functional collaboration with legal, executive, and development teams.', archetypeWeights: { strategist: 3, organizer: 2 }, dimension: 'risk_governance' },
      { id: 'f5_d', text: 'Running interactive workshops, coaching learners, or writing clear guides.', archetypeWeights: { communicator: 3, organizer: 1 }, dimension: 'human_factors' },
    ],
  },
  {
    id: 'free_6',
    number: 6,
    tier: 'free',
    category: 'Hardware & Labs',
    title: 'How do you feel about setting up your own computer lab and working with virtual machines?',
    subtitle: 'From Chapter 7 & 8: Your Computer Is Your First Classroom.',
    options: [
      { id: 'f6_a', text: 'Excited — I want to install VirtualBox, allocate RAM, and experiment hands-on.', archetypeWeights: { builder: 3, defender: 2 }, dimension: 'systems_thinking' },
      { id: 'f6_b', text: 'Interested in the results — I want to generate log files to analyze them.', archetypeWeights: { investigator: 3, analyst: 2 }, dimension: 'curiosity_investigation' },
      { id: 'f6_c', text: 'Cautious — I want to ensure my host machine is completely safe and isolated first.', archetypeWeights: { defender: 2, organizer: 2 }, dimension: 'defensive_hardening' },
      { id: 'f6_d', text: 'I prefer understanding the concepts, policies, and frameworks first before tweaking configs.', archetypeWeights: { organizer: 2, strategist: 3 }, dimension: 'risk_governance' },
    ],
  },
  {
    id: 'free_7',
    number: 7,
    tier: 'free',
    category: 'Handling Uncertainty',
    title: 'How do you handle situations where the instructions are unclear or an error appears?',
    subtitle: 'From Chapter 11 & 16: When Systems Don\'t Behave.',
    options: [
      { id: 'f7_a', text: 'I enjoy the challenge; I will read the protocol RFCs or test alternate parameters until it works.', archetypeWeights: { researcher: 3, builder: 2 }, dimension: 'curiosity_investigation' },
      { id: 'f7_b', text: 'I follow a structured diagnostic checklist: check cables, check IP, check firewall.', archetypeWeights: { defender: 3, organizer: 2 }, dimension: 'structured_organization' },
      { id: 'f7_c', text: 'I reach out to peers, search documentation, and document the resolution once found.', archetypeWeights: { communicator: 2, investigator: 2 }, dimension: 'human_factors' },
      { id: 'f7_d', text: 'I evaluate whether the process itself was flawed and update the standard operating procedure.', archetypeWeights: { organizer: 3, strategist: 2 }, dimension: 'risk_governance' },
    ],
  },
  {
    id: 'free_8',
    number: 8,
    tier: 'free',
    category: 'Legal & Ethical Mindset',
    title: 'You discover an unauthenticated administrative page on a public website. What is your reaction?',
    subtitle: 'From Chapter 18: Statutory law and written authorization.',
    options: [
      { id: 'f8_a', text: 'Never touch it. Technical discovery does not equal legal authorization.', archetypeWeights: { organizer: 3, defender: 2 }, dimension: 'risk_governance' },
      { id: 'f8_b', text: 'Look for the organization\'s coordinated vulnerability disclosure policy or security.txt file to report it lawfully.', archetypeWeights: { researcher: 2, communicator: 3 }, dimension: 'human_factors' },
      { id: 'f8_c', text: 'Note the URL structure to understand what architecture misconfiguration caused it, without sending further requests.', archetypeWeights: { investigator: 2, analyst: 2 }, dimension: 'curiosity_investigation' },
      { id: 'f8_d', text: 'Wonder what internal access control policies and audit controls failed inside that organization.', archetypeWeights: { strategist: 3, organizer: 2 }, dimension: 'risk_governance' },
    ],
  },
  {
    id: 'free_9',
    number: 9,
    tier: 'free',
    category: 'Technical Tools',
    title: 'When you hear practitioners talk about tools like Wireshark, Nmap, or Burp Suite, what is your view?',
    subtitle: 'From Chapter 10: Don\'t Collect Tools. Learn Problems.',
    options: [
      { id: 'f9_a', text: 'They are helpful, but understanding the underlying TCP/IP protocol is ten times more important.', archetypeWeights: { builder: 2, investigator: 3 }, dimension: 'systems_thinking' },
      { id: 'f9_b', text: 'They are forensic lenses that allow me to see what traffic is traversing the wire.', archetypeWeights: { investigator: 3, defender: 2 }, dimension: 'curiosity_investigation' },
      { id: 'f9_c', text: 'They are offensive instruments to test input filters and API endpoints.', archetypeWeights: { researcher: 3, builder: 1 }, dimension: 'offensive_inquiry' },
      { id: 'f9_d', text: 'They are evidence generators whose outputs must be synthesized into actionable risk reports.', archetypeWeights: { analyst: 3, strategist: 2 }, dimension: 'structured_organization' },
    ],
  },
  {
    id: 'free_10',
    number: 10,
    tier: 'free',
    category: 'Human Element',
    title: 'Why do you believe phishing and social engineering remain the top entry point for breaches?',
    subtitle: 'From Chapter 6 & 17: Human factors and psychology.',
    options: [
      { id: 'f10_a', text: 'Because humans are subjected to urgency and authority cues that bypass rational skepticism.', archetypeWeights: { communicator: 3, analyst: 2 }, dimension: 'human_factors' },
      { id: 'f10_b', text: 'Because technical controls failed to enforce hardware-bound MFA (FIDO2) that prevents credential theft.', archetypeWeights: { builder: 3, defender: 2 }, dimension: 'engineering_building' },
      { id: 'f10_c', text: 'Because training programs are boring compliance exercises rather than empathetic culture shifts.', archetypeWeights: { communicator: 3, organizer: 1 }, dimension: 'human_factors' },
      { id: 'f10_d', text: 'Because organizations fail to build zero-trust boundaries that limit blast radius after a click.', archetypeWeights: { strategist: 3, defender: 2 }, dimension: 'systems_thinking' },
    ],
  },
  {
    id: 'free_11',
    number: 11,
    tier: 'free',
    category: 'Learning Timeline',
    title: 'What is your current expectation regarding how long it takes to become job-ready in cybersecurity?',
    subtitle: 'From Chapter 14: Stop Trying to Become Good in Three Months.',
    options: [
      { id: 'f11_a', text: 'I understand 3 months provides foundational literacy, but true capability compounds over 9–18 months of disciplined practice.', archetypeWeights: { strategist: 2, investigator: 2 }, dimension: 'systems_thinking' },
      { id: 'f11_b', text: 'I want to build concrete proof of work (documented lab reports) over the next 90 days to demonstrate my trajectory.', archetypeWeights: { builder: 3, researcher: 2 }, dimension: 'engineering_building' },
      { id: 'f11_c', text: 'I want to focus on passing one targeted certification first to validate my baseline knowledge.', archetypeWeights: { organizer: 2, defender: 2 }, dimension: 'structured_organization' },
      { id: 'f11_d', text: 'I am taking an exploratory orientation first to discover where my skills actually fit before committing.', archetypeWeights: { analyst: 3, communicator: 2 }, dimension: 'curiosity_investigation' },
    ],
  },
  {
    id: 'free_12',
    number: 12,
    tier: 'free',
    category: 'Role Preference',
    title: 'If an organization offered you four different entry projects, which would you pick first?',
    subtitle: 'From Chapter 27: Find Your Starting Point.',
    options: [
      { id: 'f12_a', text: 'Configure and test automated security baselines for all employee laptops.', archetypeWeights: { builder: 3, defender: 2 }, dimension: 'engineering_building' },
      { id: 'f12_b', text: 'Analyze server logs from a simulated malware outbreak to trace the infection path.', archetypeWeights: { investigator: 3, analyst: 2 }, dimension: 'curiosity_investigation' },
      { id: 'f12_c', text: 'Conduct an authorized penetration test against an internal staging web app.', archetypeWeights: { researcher: 3, builder: 1 }, dimension: 'offensive_inquiry' },
      { id: 'f12_d', text: 'Perform a compliance audit against the Nigeria Data Protection Act 2023.', archetypeWeights: { organizer: 3, strategist: 2 }, dimension: 'risk_governance' },
    ],
  },
  {
    id: 'free_13',
    number: 13,
    tier: 'free',
    category: 'Communication Style',
    title: 'How do you prefer to communicate technical findings to others?',
    subtitle: 'From Chapter 5: Cybersecurity Is a Team Sport.',
    options: [
      { id: 'f13_a', text: 'Through clean code, annotated configuration files, and architectural diagrams.', archetypeWeights: { builder: 3, defender: 1 }, dimension: 'engineering_building' },
      { id: 'f13_b', text: 'Through chronological incident timelines and forensic evidence reports.', archetypeWeights: { investigator: 3, analyst: 2 }, dimension: 'curiosity_investigation' },
      { id: 'f13_c', text: 'Through executive summaries emphasizing financial, operational, and regulatory impact.', archetypeWeights: { strategist: 3, organizer: 2 }, dimension: 'risk_governance' },
      { id: 'f13_d', text: 'Through engaging stories, practical workshops, and accessible non-technical guides.', archetypeWeights: { communicator: 3, analyst: 1 }, dimension: 'human_factors' },
    ],
  },
  {
    id: 'free_14',
    number: 14,
    tier: 'free',
    category: 'AI in Cybersecurity',
    title: 'How do you view the role of Artificial Intelligence in your cybersecurity learning journey?',
    subtitle: 'From Chapter 24: Cybersecurity in the Age of AI.',
    options: [
      { id: 'f14_a', text: 'As a research assistant to explain complex concepts, provided I always verify and reproduce the facts.', archetypeWeights: { investigator: 2, analyst: 3 }, dimension: 'curiosity_investigation' },
      { id: 'f14_b', text: 'As an automation engine to write initial boilerplate scripts and parse large log files.', archetypeWeights: { builder: 3, defender: 2 }, dimension: 'engineering_building' },
      { id: 'f14_c', text: 'As a new attack surface whose prompts, models, and training data require rigorous security.', archetypeWeights: { researcher: 3, strategist: 2 }, dimension: 'offensive_inquiry' },
      { id: 'f14_d', text: 'As a technology that requires strict data governance, privacy guardrails, and acceptable-use policies.', archetypeWeights: { organizer: 3, communicator: 2 }, dimension: 'risk_governance' },
    ],
  },
];

// Helper to score assessment answers
export interface ScoreResult {
  scores: Record<ArchetypeId, number>;
  topArchetype: ArchetypeProfile;
  secondaryArchetype: ArchetypeProfile;
  dimensionScores: Record<string, number>;
  totalAnswered: number;
}

export function scoreAssessment(answers: Record<string, string>, questionSet: AssessmentQuestion[] = FREE_QUESTIONS): ScoreResult {
  const scores: Record<ArchetypeId, number> = {
    builder: 0,
    investigator: 0,
    defender: 0,
    researcher: 0,
    analyst: 0,
    strategist: 0,
    communicator: 0,
    organizer: 0,
  };

  const dimensionScores: Record<string, number> = {
    systems_thinking: 0,
    curiosity_investigation: 0,
    defensive_hardening: 0,
    offensive_inquiry: 0,
    risk_governance: 0,
    human_factors: 0,
    engineering_building: 0,
    structured_organization: 0,
  };

  let totalAnswered = 0;

  for (const question of questionSet) {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId) continue;

    const option = question.options.find((o) => o.id === selectedOptionId);
    if (!option) continue;

    totalAnswered++;

    // Add archetype weights
    for (const [arch, weight] of Object.entries(option.archetypeWeights)) {
      if (weight && arch in scores) {
        scores[arch as ArchetypeId] += weight;
      }
    }

    // Add dimension score
    if (option.dimension in dimensionScores) {
      dimensionScores[option.dimension] += 3;
    }
  }

  // Sort archetypes by score
  const sorted = (Object.keys(scores) as ArchetypeId[]).sort((a, b) => scores[b] - scores[a]);
  const topArchetype = ARCHETYPES[sorted[0]] || ARCHETYPES.defender;
  const secondaryArchetype = ARCHETYPES[sorted[1]] || ARCHETYPES.investigator;

  return {
    scores,
    topArchetype,
    secondaryArchetype,
    dimensionScores,
    totalAnswered,
  };
}
