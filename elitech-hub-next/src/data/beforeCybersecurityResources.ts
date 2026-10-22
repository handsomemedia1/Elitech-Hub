// ============================================================
// Before Cybersecurity — Curated Resource Library
// Verified, authoritative resources across core security disciplines
// ============================================================

export interface CuratedResource {
  id: string;
  title: string;
  description: string;
  category:
    | 'foundations'
    | 'networking'
    | 'operating-systems'
    | 'security-frameworks'
    | 'labs-and-practice'
    | 'legal-and-policy'
    | 'ai-and-security'
    | 'careers-and-evidence';
  level: 'Beginner' | 'Intermediate' | 'All Levels';
  cost: 'Free' | 'Freemium' | 'Paid';
  url: string;
  organization: string;
  bookChapterRef?: string;
  keyTakeaway: string;
}

export const RESOURCE_CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'foundations', label: 'Foundations & Computing' },
  { id: 'networking', label: 'Networking & Protocols' },
  { id: 'operating-systems', label: 'Operating Systems & Linux' },
  { id: 'security-frameworks', label: 'Security Frameworks & Standards' },
  { id: 'labs-and-practice', label: 'Safe Labs & Environments' },
  { id: 'legal-and-policy', label: 'Cyber Law, Ethics & Privacy' },
  { id: 'ai-and-security', label: 'AI & Cybersecurity' },
  { id: 'careers-and-evidence', label: 'Career Navigation & Portfolios' },
];

export const CURATED_RESOURCES: CuratedResource[] = [
  // Foundations
  {
    id: 'res_cs50',
    title: 'CS50: Introduction to Computer Science',
    description: 'Harvard University\'s foundational course covering algorithms, memory architecture, data structures, and how computers execute instructions.',
    category: 'foundations',
    level: 'Beginner',
    cost: 'Free',
    url: 'https://cs50.harvard.edu/x/',
    organization: 'Harvard University / edX',
    bookChapterRef: 'Chapter 13 (The Basics Are Not a Detour)',
    keyTakeaway: 'Understanding how memory and machine instructions execute prevents security from feeling like magic.',
  },
  {
    id: 'res_nand2tetris',
    title: 'The Elements of Computing Systems (Nand to Tetris)',
    description: 'A ground-up journey building a modern computer system from basic logic gates through hardware, compiler, and operating system.',
    category: 'foundations',
    level: 'Intermediate',
    cost: 'Free',
    url: 'https://www.nand2tetris.org/',
    organization: 'Noam Nisan & Shimon Schocken',
    bookChapterRef: 'Chapter 8 (The Computer You Don\'t See)',
    keyTakeaway: 'Demystifies the layered hardware architecture underlying all computing devices.',
  },

  // Networking
  {
    id: 'res_messer_net',
    title: 'Professor Messer\'s CompTIA Network+ Training Course',
    description: 'Free, modular video curriculum covering OSI layers, IP addressing, TCP/UDP transport, subnetting, and switching fundamentals.',
    category: 'networking',
    level: 'Beginner',
    cost: 'Free',
    url: 'https://www.professormesser.com/network-plus/n10-008/n10-008-training-course/',
    organization: 'Professor Messer',
    bookChapterRef: 'Chapter 9 (Learn the Language of Computers)',
    keyTakeaway: 'You cannot defend a network if you cannot trace a packet from sender to receiver.',
  },
  {
    id: 'res_wireshark_docs',
    title: 'Wireshark User\'s Guide & Sample Captures',
    description: 'Official documentation and public packet captures for analyzing live network traffic, HTTP handshakes, and DNS queries.',
    category: 'networking',
    level: 'Beginner',
    cost: 'Free',
    url: 'https://www.wireshark.org/docs/',
    organization: 'Wireshark Foundation',
    bookChapterRef: 'Chapter 10 (Don\'t Collect Tools. Learn Problems.)',
    keyTakeaway: 'Packet inspection reveals what applications are actually transmitting, not what you assume they are transmitting.',
  },

  // Operating Systems
  {
    id: 'res_linux_journey',
    title: 'Linux Journey',
    description: 'A self-paced, accessible guide to learning Linux command-line navigation, file permissions, processes, systemd services, and routing.',
    category: 'operating-systems',
    level: 'Beginner',
    cost: 'Free',
    url: 'https://linuxjourney.com/',
    organization: 'Linux Journey Community',
    bookChapterRef: 'Chapter 7 (Your Computer Is Your First Classroom)',
    keyTakeaway: 'The command line gives you direct visibility into processes and file system permissions.',
  },
  {
    id: 'res_sysinternals',
    title: 'Microsoft Windows Sysinternals Suite',
    description: 'Advanced system utilities and technical documentation for managing, diagnosing, and troubleshooting Windows environments (Process Explorer, ProcMon).',
    category: 'operating-systems',
    level: 'Intermediate',
    cost: 'Free',
    url: 'https://learn.microsoft.com/en-us/sysinternals/',
    organization: 'Microsoft Learn (Mark Russinovich)',
    bookChapterRef: 'Chapter 8 (The Computer You Don\'t See)',
    keyTakeaway: 'Process Explorer reveals hidden background threads, DLLs, and handle leaks that Task Manager hides.',
  },

  // Security Frameworks
  {
    id: 'res_nist_nice',
    title: 'NIST Workforce Framework for Cybersecurity (NICE Framework SP 800-181)',
    description: 'The global standard taxonomy of cybersecurity work roles, knowledge units, and competencies across enterprise security.',
    category: 'security-frameworks',
    level: 'All Levels',
    cost: 'Free',
    url: 'https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center',
    organization: 'National Institute of Standards and Technology (NIST)',
    bookChapterRef: 'Chapter 3 (What Cybersecurity Actually Is)',
    keyTakeaway: 'Cybersecurity is a multi-disciplinary spectrum of specialized roles, not a single monolithic job.',
  },
  {
    id: 'res_mitre_attack',
    title: 'MITRE ATT&CK® Knowledge Base',
    description: 'A globally-accessible knowledge base of adversary tactics, techniques, and procedures (TTPs) based on real-world observations.',
    category: 'security-frameworks',
    level: 'All Levels',
    cost: 'Free',
    url: 'https://attack.mitre.org/',
    organization: 'MITRE Corporation',
    bookChapterRef: 'Chapter 12 (To Defend, Understand)',
    keyTakeaway: 'Defenders structure detection around attacker techniques, from initial access to command and control.',
  },
  {
    id: 'res_owasp_top10',
    title: 'OWASP Top 10 Web Application Security Risks',
    description: 'The authoritative awareness document for web developers and security practitioners detailing the most critical web application risks.',
    category: 'security-frameworks',
    level: 'Beginner',
    cost: 'Free',
    url: 'https://owasp.org/www-project-top-ten/',
    organization: 'OWASP Foundation',
    bookChapterRef: 'Chapter 9 (Learn the Language of Computers)',
    keyTakeaway: 'Broken Access Control and Injection arise when software fails to enforce strict boundaries between code and data.',
  },

  // Labs & Practice
  {
    id: 'res_overthewire',
    title: 'OverTheWire Bandit Wargame',
    description: 'A terminal-based SSH challenge specifically designed for beginners to learn Linux commands, file permissions, and shell scripting.',
    category: 'labs-and-practice',
    level: 'Beginner',
    cost: 'Free',
    url: 'https://overthewire.org/wargames/bandit/',
    organization: 'OverTheWire Community',
    bookChapterRef: 'Chapter 7 (Your Computer Is Your First Classroom)',
    keyTakeaway: 'Interactive problem-solving builds command-line intuition ten times faster than reading alone.',
  },
  {
    id: 'res_portswigger_academy',
    title: 'PortSwigger Web Security Academy',
    description: 'Comprehensive, free hands-on web security training covering SQL injection, XSS, CSRF, authentication flaws, and API vulnerabilities.',
    category: 'labs-and-practice',
    level: 'All Levels',
    cost: 'Free',
    url: 'https://portswigger.net/web-security',
    organization: 'PortSwigger (Creators of Burp Suite)',
    bookChapterRef: 'Chapter 11 (What Happens When Systems Don\'t Behave?)',
    keyTakeaway: 'Combines clear theoretical explanations with realistic, isolated laboratory targets.',
  },

  // Legal & Policy
  {
    id: 'res_ndpc_act',
    title: 'Nigeria Data Protection Act (NDPA) 2023 Official Portal',
    description: 'Statutory framework governing personal data protection, controller obligations, data subjects\' rights, and compliance penalties in Nigeria.',
    category: 'legal-and-policy',
    level: 'All Levels',
    cost: 'Free',
    url: 'https://ndpc.gov.ng/',
    organization: 'Nigeria Data Protection Commission (NDPC)',
    bookChapterRef: 'Chapter 18 (Know the Rules Before You Travel)',
    keyTakeaway: 'Technical systems handling personal data operate under binding legal duties of confidentiality and consent.',
  },
  {
    id: 'res_disclose_io',
    title: 'disclose.io Safe Harbor and Vulnerability Disclosure Guidelines',
    description: 'Collaborative terms, legal safe harbor language, and best practices for coordinated vulnerability disclosure between hackers and organizations.',
    category: 'legal-and-policy',
    level: 'Beginner',
    cost: 'Free',
    url: 'https://disclose.io/',
    organization: 'disclose.io Project',
    bookChapterRef: 'Chapter 18 (Know the Rules Before You Travel)',
    keyTakeaway: 'Always verify explicit program scope and safe harbor authorization before sending unexpected traffic to external systems.',
  },

  // AI & Security
  {
    id: 'res_owasp_llm_top10',
    title: 'OWASP Top 10 for Large Language Model Applications',
    description: 'Standard guidelines on security risks when building with LLMs, including prompt injection, insecure output handling, and model denial of service.',
    category: 'ai-and-security',
    level: 'Intermediate',
    cost: 'Free',
    url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
    organization: 'OWASP Foundation',
    bookChapterRef: 'Chapter 24 (Cybersecurity in the Age of AI)',
    keyTakeaway: 'AI systems introduce novel input-trust boundaries where natural language prompts can hijack execution logic.',
  },
  {
    id: 'res_nist_ai_rmf',
    title: 'NIST Artificial Intelligence Risk Management Framework (AI RMF 1.0)',
    description: 'Guidance for managing risks to individuals, organizations, and society associated with artificial intelligence systems.',
    category: 'ai-and-security',
    level: 'All Levels',
    cost: 'Free',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    organization: 'National Institute of Standards and Technology (NIST)',
    bookChapterRef: 'Chapter 24 (Cybersecurity in the Age of AI)',
    keyTakeaway: 'AI governance requires evaluating data provenance, model bias, explainability, and adversarial robustness.',
  },

  // Careers & Evidence
  {
    id: 'res_isc2_study',
    title: 'ISC2 Cybersecurity Workforce Study',
    description: 'Annual global research detailing workforce shortage numbers, hiring manager requirements, salary benchmarks, and skills demand.',
    category: 'careers-and-evidence',
    level: 'All Levels',
    cost: 'Free',
    url: 'https://www.isc2.org/research',
    organization: 'ISC2 (International Information System Security Certification Consortium)',
    bookChapterRef: 'Chapter 20 (What Does a Certification Actually Prove?)',
    keyTakeaway: 'Hiring managers prioritize troubleshooting ability, curiosity, and teamwork alongside certifications.',
  },
];
