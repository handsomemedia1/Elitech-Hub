// ============================================================
// Before Cybersecurity — Complete Manuscript Data & Structure
// Author: Elijah Adeyeye (Founder & Lead Instructor, Elitech Hub)
// Edition: 2026 Revised Interactive Edition
// ============================================================

export interface PracticalExercise {
  number: number;
  title: string;
  objective: string;
  steps: string[];
  observation: string;
  takeaway: string;
}

export interface Chapter {
  number: number;
  partNumber: number;
  title: string;
  slug: string;
  subtitle?: string;
  readTimeMinutes: number;
  keyPrinciple: string;
  summary: string;
  content: string[];
  exercise?: PracticalExercise;
  analogyOrFigure?: {
    title: string;
    caption: string;
    keyPoints: string[];
  };
  keyTakeaways: string[];
  discussionQuestions: string[];
}

export interface Part {
  number: number;
  title: string;
  slug: string;
  theme: string;
  description: string;
  chapters: number[]; // Chapter numbers
}

export const BOOK_METADATA = {
  title: 'Before Cybersecurity',
  subtitle: 'What Nobody Tells You Before You Start Learning Cybersecurity',
  author: 'Elijah Adegboyega Adeyeye',
  authorTitle: 'Founder & Lead Instructor, Elitech Hub',
  publisher: 'Elitech Hub Press',
  year: 2026,
  edition: '2026 Revised Interactive Edition',
  canonicalUrl: 'https://www.elitechub.com/before-cybersecurity',
  corePremise: 'You do not need to know everything before you start cybersecurity. You need to understand what you are starting.',
  summary: 'A practical, technically grounded orientation system designed to help you understand systems, evaluate your starting resources, build safe home laboratories, navigate Nigerian and international cyber law, and develop real capability before chasing tools or certificates.',
  stats: {
    partsCount: 10,
    chaptersCount: 29,
    exercisesCount: 9,
  },
  frameworksReferenced: [
    { name: 'NIST NICE Framework', version: 'SP 800-181 Rev. 1 (2020)', org: 'National Institute of Standards and Technology' },
    { name: 'NIST CSF', version: '2.0 (2024)', org: 'National Institute of Standards and Technology' },
    { name: 'OWASP', version: 'Top 10 & AppSec Guidance (2024)', org: 'Open Worldwide Application Security Project' },
    { name: 'ISC2 Cybersecurity Workforce Study', version: '2025 Edition', org: 'ISC2' },
    { name: 'Cybercrimes (Prohibition, Prevention, etc.) (Amendment) Act', version: '2024 Amendment', org: 'Federal Republic of Nigeria' },
    { name: 'Nigeria Data Protection Act (NDPA)', version: '2023', org: 'Nigeria Data Protection Commission (NDPC)' },
  ],
};

export const PARTS: Part[] = [
  {
    number: 1,
    title: 'Before You Enter',
    slug: 'before-you-enter',
    theme: 'Motivation, Expectations & Starting Resources',
    description: 'An honest audit of why you are entering the field and the transferable skills you already bring.',
    chapters: [1, 2],
  },
  {
    number: 2,
    title: 'The Landscape',
    slug: 'the-landscape',
    theme: 'Landscape vs. Ladder, Teamwork & Real-World Contexts',
    description: 'Understanding cybersecurity as an interconnected terrain, a multi-disciplinary team sport, and an organizational reality.',
    chapters: [3, 4, 5, 6],
  },
  {
    number: 3,
    title: 'Your First Lab',
    slug: 'your-first-lab',
    theme: 'Your Computer Classroom, System Layers & RAM Realities',
    description: 'Mastering the machine on your desk, understanding layered computing architecture, and sizing home virtualization labs.',
    chapters: [7, 8],
  },
  {
    number: 4,
    title: 'Learn to Think',
    slug: 'learn-to-think',
    theme: 'System Vocabulary, Problem-First Thinking & Defense',
    description: 'Learning the language of computing, solving problems rather than collecting tools, analyzing anomalies, and defending through understanding.',
    chapters: [9, 10, 11, 12],
  },
  {
    number: 5,
    title: 'Learn Without Wasting Your Time',
    slug: 'learn-without-wasting-time',
    theme: 'Fundamentals, Compounding & Interdisciplinary Range',
    description: 'Why the basics are not a detour, debunking the 3-month mastery myth, embracing depth, collaborating with peers, and learning beyond security.',
    chapters: [13, 14, 15, 16, 17],
  },
  {
    number: 6,
    title: 'Protect Yourself',
    slug: 'protect-yourself',
    theme: 'Cyber Law, Ethics & Personal Operational Security',
    description: 'Understanding statutory legal rules (Nigerian Cybercrimes Act 2024 & NDPA 2023), written authorization, and establishing personal security hygiene.',
    chapters: [18, 19],
  },
  {
    number: 7,
    title: 'Turn Learning Into Capability',
    slug: 'turn-learning-into-capability',
    theme: 'Certifications, Hiring Pipeline & Portfolio Evidence',
    description: 'What certifications actually prove, navigating the 4-stage employability pipeline, building project evidence, and shaping a T-shaped profile.',
    chapters: [20, 21, 22, 23],
  },
  {
    number: 8,
    title: 'The Future',
    slug: 'the-future',
    theme: 'Cybersecurity in the Age of AI & Continuous Change',
    description: 'Distinguishing AI-powered cybersecurity from securing AI models, and preparing for an industry that never stops moving.',
    chapters: [24, 25],
  },
  {
    number: 9,
    title: 'Find Your Direction',
    slug: 'find-your-direction',
    theme: 'Work-Style Compass & 30-60-90 Day Deliverable Plan',
    description: 'Aligning your problem preferences with real roles (Builder, Defender, Investigator, Researcher, Communicator), and executing your first 90 days.',
    chapters: [26, 27, 28],
  },
  {
    number: 10,
    title: 'The Journey',
    slug: 'the-journey',
    theme: 'Cybersecurity as a Way of Seeing & You Are Not Late',
    description: 'Developing the five investigative questions, shifting your perception of systems, and beginning with confidence.',
    chapters: [29],
  },
];

export const CHAPTERS: Chapter[] = [
  // PART I
  {
    number: 1,
    partNumber: 1,
    title: 'Why Are You Here?',
    slug: 'why-are-you-here',
    subtitle: 'Auditing Motivation and Setting Realistic Expectations',
    readTimeMinutes: 6,
    keyPrinciple: 'Cybersecurity is not a shortcut to quick money, instant status, or effortless technical authority. It is a discipline that rewards curiosity, patience, structured problem-solving, and continuous learning.',
    summary: 'Every meaningful learning journey begins with an honest audit of motivation. Your reason for entering shapes how you respond when the technical work becomes difficult or unfamiliar.',
    content: [
      'Every meaningful learning journey begins with an honest audit of motivation. Are you here because you genuinely like computers, want a stable career, heard that cybersecurity pays well, watched someone hack a system in a demonstration, want to protect yourself and your family, want to understand how complex systems work, or simply heard that cybersecurity is "the future"?',
      'None of these reasons automatically makes your decision right or wrong. However, your reason for entering matters deeply because it shapes what you expect when the work becomes difficult, abstract, or frustratingly unfamiliar.',
      'The first question is not: "How do I become a cybersecurity professional?" The first question is: "Why do I want to enter this field?"',
      'FIRST MAJOR WARNING: Cybersecurity is not a shortcut to quick money, instant status, or effortless technical authority. It is a discipline that rewards curiosity, patience, structured problem-solving, and continuous learning.',
      'If you enter solely expecting rapid financial rewards without an appetite for understanding how operating systems, networking stacks, and data structures function, you will quickly find the daily reality exhausting. If, however, you bring curiosity about why systems work and where they break down, you will find cybersecurity an endlessly fascinating intellectual home.',
    ],
    keyTakeaways: [
      'Honest motivation shapes persistence through technical difficulty.',
      'Cybersecurity is an engineering and investigative discipline, not an overnight shortcut.',
      'Curiosity about underlying systems is the most reliable predictor of long-term success.',
    ],
    discussionQuestions: [
      'What specifically made you want to explore cybersecurity over other tech fields?',
      'How do you typically react when a technical setup fails and no immediate tutorial answers it?',
    ],
  },
  {
    number: 2,
    partNumber: 1,
    title: 'What Are You Bringing With You?',
    slug: 'what-are-you-bringing-with-you',
    subtitle: 'Transferable Strengths and the Starting-Skills Inventory',
    readTimeMinutes: 7,
    keyPrinciple: 'Personality is a clue, not an assignment. Your existing analytical, technical, or human habits do not lock you into a single job, but they serve as concrete starting resources.',
    summary: 'Before asking what cybersecurity can teach you, inventory what you already know. Beginners routinely overlook valuable transferable skills in administration, logic, writing, and problem-solving.',
    content: [
      'Before asking what cybersecurity can teach you, inventory what you already know. Beginners routinely overlook valuable transferable skills. Those existing habits do not automatically determine your career path, but they serve as concrete starting resources:',
      '01 // TECHNICAL & SYSTEMS: Building websites, managing computers, repairing devices, administering operating systems, or troubleshooting why a device or program stopped working.',
      '02 // ANALYTICAL & LOGIC: Organizing information, investigating problems, enjoying mathematics, conducting structured research, or analyzing patterns in data.',
      '03 // HUMAN & BUSINESS: Working effectively with people, writing clearly, understanding business operations, or explaining complex technical rules and workflows to non-technical stakeholders.',
      'Personality Is a Clue, Not an Assignment: Introversion does not lock you into technical engineering roles; extroversion does not confine you to governance, risk, and compliance (GRC). These traits simply highlight where your cognitive energy naturally flows.',
    ],
    exercise: {
      number: 1,
      title: 'Personal Starting-Skills & 7-Question Self-Inquiry Inventory',
      objective: 'Audit your natural tendencies and transferable skills before choosing any course, certification, or tool.',
      steps: [
        'In a dedicated notebook, write honest 2-sentence answers to these seven foundational questions:',
        '(1) What kind of problems do I enjoy?',
        '(2) What kind of work holds my attention when nobody is supervising me?',
        '(3) Do I prefer building, investigating, explaining, organizing, or defending?',
        '(4) Do I enjoy working alone, with a team, or both?',
        '(5) Do I prefer uncertainty and novel challenges, or predictable and structured processes?',
        '(6) Do I naturally ask "why" when something breaks?',
        '(7) Do I enjoy taking things apart to understand how they work?',
      ],
      observation: 'The goal is not to label yourself permanently, but to understand yourself before choosing what to learn.',
      takeaway: 'Compare your answers with the work-style directions in Chapter 26 to see which foundational domains naturally align with your instincts.',
    },
    keyTakeaways: [
      'Prior non-security experience (troubleshooting, writing, administration) is an active advantage.',
      'Self-awareness prevents you from forcing yourself into roles that conflict with your thinking style.',
      'Your starting point is unique; do not measure your beginning against an established practitioner.',
    ],
    discussionQuestions: [
      'Which of the three skill categories (Technical, Analytical, Human) is currently your strongest?',
      'What is an example of a non-computing problem you recently enjoyed solving?',
    ],
  },

  // PART II
  {
    number: 3,
    partNumber: 2,
    title: 'What Cybersecurity Actually Is',
    slug: 'what-cybersecurity-actually-is',
    subtitle: 'NIST NICE Framework, Scope of Defense & Hacking Distinctions',
    readTimeMinutes: 9,
    keyPrinciple: 'Cybersecurity exists wherever technology, information, people, organizations, and risk intersect. Hacking is not synonymous with cybersecurity.',
    summary: 'Cybersecurity is much larger than hacking. Grounded in the NIST NICE Framework, it spans protecting data, systems, and people across diverse economic sectors.',
    content: [
      'Cybersecurity is much larger than hacking. At a baseline, it involves protecting systems, information, identities, applications, infrastructure, organizations, and people from threats and unwanted outcomes. Yet even that definition is incomplete: Cybersecurity exists wherever technology, information, people, organizations, and risk intersect.',
      'This breadth explains why cybersecurity cannot be described as a single job. The National Institute of Standards and Technology\'s (NIST) Workforce Framework for Cybersecurity (NICE Framework, SP 800-181 Rev. 1) organizes the profession into distinct work roles, competencies, and tasks rather than treating cybersecurity as one uniform role (NIST, 2020).',
      'WHAT ARE WE PROTECTING? Information, applications, networks, endpoint devices, identities, cloud environments, operational technology (OT), organizations, and people.',
      'WHAT ARE WE DOING? Building, monitoring, testing, defending, investigating, responding, threat hunting, governing, assessing risk, researching, and educating.',
      'WHERE DOES IT HAPPEN? Banking, healthcare, government, telecoms, education, oil & gas, manufacturing, technology, maritime, aviation, defense, startups, and SMEs.',
      'AND WHAT ABOUT HACKING? Hacking is not synonymous with cybersecurity. As a working definition: Hacking is a broad term for exploring, manipulating, modifying, or interacting with systems in ways that go beyond their ordinary or intended use. The word itself does not tell you whether the activity is authorized, beneficial, harmless, or malicious.',
      'Four essential technical distinctions must be kept clear:',
      '1. Vulnerability: A weakness or flaw in design, implementation, or operation that can affect security.',
      '2. Exploit: A specific technique, code, or method used to take advantage of a vulnerability.',
      '3. Exploitation: The act of executing an exploit against that weakness.',
      '4. Unauthorized Access: Accessing a system or resource without explicit permission from the owner.',
    ],
    analogyOrFigure: {
      title: 'The Office-Pin Hardware Reset Analogy',
      caption: 'Intuition: Systems do not always behave solely within the assumptions made by their designers.',
      keyPoints: [
        'An ordinary metal office pin is manufactured to hold sheets of paper together.',
        'In practice, engineers unbend that pin to press a recessed reset switch on a router or eject a stuck drive tray.',
        'Core Principle: Exploring how an object behaves outside intended designer assumptions is the foundation of hacking intuition.',
        'Crucial distinction: Physical intuition does not equal legal authorization.',
      ],
    },
    keyTakeaways: [
      'Cybersecurity is an organizational and systemic discipline, not just an offensive trick.',
      'NIST NICE categorizes cybersecurity into specialized roles rather than a single monolithic career.',
      'Always distinguish vulnerabilities (flaws) from exploits (methods) and unauthorized access (violations).',
    ],
    discussionQuestions: [
      'Why do you think media representations almost exclusively focus on offensive hacking rather than defense and governance?',
      'How does the office-pin analogy illustrate both the power and risk of unexpected system behavior?',
    ],
  },
  {
    number: 4,
    partNumber: 2,
    title: 'Cybersecurity Is a Landscape, Not a Ladder',
    slug: 'cybersecurity-is-a-landscape-not-a-ladder',
    subtitle: 'Debunking the Linear Progression Myth',
    readTimeMinutes: 7,
    keyPrinciple: 'Cybersecurity is not a vertical climb from beginner to hacker to expert. It is an interconnected landscape where one domain opens a doorway into another.',
    summary: 'Stop imagining cybersecurity as a single vertical ladder. Understanding the landscape prevents you from treating tool exposure as true expertise.',
    content: [
      'MYTH: Beginner → Intermediate → Advanced → Hacker → Expert.',
      'Stop imagining cybersecurity as a single vertical ladder. It is an interconnected landscape where one domain opens a doorway into another. However, exposure is not expertise. Tools expose you to concepts; true competence comes from understanding, repetition, context, and experience.',
      '01 // NETWORK SECURITY ENTRY: Connects to operating systems, scripting, cloud, identity, logging, incident response, threat intelligence, and application security. (Running Wireshark does not make you a Network Engineer).',
      '02 // WEB DEVELOPMENT ENTRY: Connects to authentication, authorization, APIs, databases, secure coding, and application security. (Opening Burp Suite does not make you an AppSec Specialist).',
      '03 // PSYCHOLOGY & HUMAN ENTRY: Connects to social engineering, security awareness, human behavior, fraud, trust, and risk decisions. (Viewing an IP or log file does not make you a Forensics Investigator).',
      'When you see cybersecurity as a terrain, you no longer feel lost when you discover an unfamiliar topic. You simply recognize that you have walked into an adjacent valley.',
    ],
    keyTakeaways: [
      'There is no universal single path that every cybersecurity practitioner must walk.',
      'Operating tools gives exposure; building mental models creates competence.',
      'Adjacent domains reinforce each other over time.',
    ],
    discussionQuestions: [
      'Which doorway (Networking, Web, Human Factors, Systems) currently feels most approachable to you?',
    ],
  },
  {
    number: 5,
    partNumber: 2,
    title: 'Cybersecurity Is a Team Sport',
    slug: 'cybersecurity-is-a-team-sport',
    subtitle: 'Cross-Functional Defense and the Reality of Incident Response',
    readTimeMinutes: 6,
    keyPrinciple: 'Learning cybersecurity means learning how to collaborate with specialists who know things you do not know.',
    summary: 'Cinema portrays cybersecurity as an isolated genius in a dark room. In reality, modern security is cross-functional, requiring coordination across engineers, analysts, legal counsel, and leadership.',
    content: [
      'Cinema portrays cybersecurity as one isolated genius staring at six monitors in a dark room typing furiously. In reality, a serious incident crosses organizational boundaries and requires coordinated action.',
      'An effective defense relies on security analysts, incident responders, system administrators, network engineers, security engineers, threat hunters, software developers, executive management, legal counsel, compliance officers, communications teams, human resources, and external incident response providers.',
      'Both the NIST Cybersecurity Framework (CSF) 2.0 (NIST, 2024) and global workforce studies (ISC2, 2025) emphasize problem-solving, teamwork, and cross-functional communication above isolated technical tricks.',
      'Learning cybersecurity means learning how to ask intelligent questions, document findings clearly, and collaborate with specialists whose deep domain knowledge complements your own.',
    ],
    keyTakeaways: [
      'Solo heroics do not survive real-world enterprise incidents.',
      'Communication and clear technical writing are core technical skills.',
      'Frameworks like NIST CSF 2.0 structure collaboration across entire organizations.',
    ],
    discussionQuestions: [
      'How would you explain a critical security vulnerability to a company director who does not know what an IP address is?',
    ],
  },
  {
    number: 6,
    partNumber: 2,
    title: 'Where Cybersecurity Meets the Real World',
    slug: 'where-cybersecurity-meets-the-real-world',
    subtitle: 'Sector Realities, Operational Constraints and Business Risk',
    readTimeMinutes: 8,
    keyPrinciple: 'Cybersecurity never operates in a vacuum. The identical technical flaw produces radically different consequences depending on the data, business process, and legal jurisdiction involved.',
    summary: 'A hospital, commercial bank, oil refinery, and SaaS startup operate under completely different realities. Security tools alone cannot calculate risk without understanding the operational context.',
    content: [
      'Cybersecurity never operates in a vacuum. A hospital has different operational realities from a commercial bank. A telecommunications provider manages different infrastructure from a university. An oil-and-gas operator faces physical operational technology (OT) hazards unknown to a software startup, and a government agency operates under different regulatory constraints from a small business (SME).',
      'Because the identical technical flaw produces radically different consequences depending on the data, business process, and legal jurisdiction involved, cybersecurity is simultaneously technical, organizational, economic, legal, operational, and human.',
      'SECTOR IMPACT ANALYSIS: Consider a missing patch that forces a 20-minute system reboot. In a small e-commerce startup, that reboot delays a few orders; in a hospital intensive-care unit or an offshore drilling platform, an unplanned 20-minute outage threatens human life and physical safety.',
      'Before examining enterprise networks, you must master the machine on your own desk.',
    ],
    keyTakeaways: [
      'Context determines risk: impact is tied to the mission of the organization.',
      'Operational Technology (OT) and Industrial Control Systems have safety requirements far stricter than standard IT.',
      'Security decisions must balance protection with business continuity and human life.',
    ],
    discussionQuestions: [
      'Why might a hospital delay patching an MRI machine even after a critical vulnerability is announced?',
    ],
  },

  // PART III
  {
    number: 7,
    partNumber: 3,
    title: 'Your Computer Is Your First Classroom',
    slug: 'your-computer-is-your-first-classroom',
    subtitle: 'The Safe Learning Progression and Ground Zero for Practice',
    readTimeMinutes: 7,
    keyPrinciple: 'Before attempting to test anyone else\'s system, learn to understand your own. Learn how systems work before you try to break them.',
    summary: 'You do not need an expensive enterprise lab or cloud subscription to begin. Start with the computer you already own and study its hardware, processes, files, and network activity.',
    content: [
      'Before attempting to test anyone else\'s system, learn to understand your own. You do not need an expensive enterprise laboratory or paid cloud subscription to begin. Start with the machine you already own and control.',
      'Use it to study: hardware, operating systems, file systems, user accounts, permissions, running processes, background services, event logs, networking, patching, authentication, storage, backups, and command-line utilities.',
      'THE SAFE LEARNING PROGRESSION: YOU → YOUR COMPUTER → YOUR NETWORK → YOUR LAB → OTHER SYSTEMS (ONLY WITH EXPLICIT WRITTEN AUTHORIZATION).',
      'Core Habit: Learn to understand how systems work normally before you try to break them or diagnose abnormalities.',
    ],
    keyTakeaways: [
      'Your everyday laptop contains enough operating system complexity to study for months.',
      'The safest place to make mistakes is in an isolated local environment you control.',
      'Never scan external systems before establishing deep familiarity with your own.',
    ],
    discussionQuestions: [
      'What are the five most active background processes running on your computer right now, and what do they do?',
    ],
  },
  {
    number: 8,
    partNumber: 3,
    title: 'The Computer You Don\'t See & Virtualization Memory Limits',
    slug: 'the-computer-you-dont-see',
    subtitle: 'System Layers, Firmware, and Sizing Local Virtual Machines',
    readTimeMinutes: 9,
    keyPrinciple: 'A computer is a layered system: hardware, UEFI/BIOS, kernel, hypervisor, OS, services, applications. Advanced threats persist below the screen.',
    summary: 'When you open your laptop, you only see the desktop interface. Understand the layers underneath and how physical RAM dictates what virtualization home labs you can safely run.',
    content: [
      'When you open your laptop, you see the desktop interface—just one surface layer. Underneath lie interconnected layers of hardware, UEFI/BIOS firmware, bootloaders, operating-system kernels, device drivers, applications, hypervisors (virtualization), network stacks, and external services.',
      'Because advanced threats can persist below the operating-system layer, reinstalling the OS does not always remove every compromise. The lesson is not "your computer is never yours"—the lesson is that a computer is a layered system, and cybersecurity requires seeing beyond the screen.',
      'HARDWARE REALITIES: VIRTUALIZATION & RAM SIZING',
      'Virtual machines (VMs) are the cornerstone of safe learning, but they require physical memory. Understand the budget:',
      'Host Windows 11 OS: 3–4 GB RAM idle baseline.',
      'Kali Linux VM: 2–4 GB RAM allocated.',
      'Target VM (Metasploitable, Windows Server, Ubuntu): 2–4 GB RAM allocated.',
      'Host Browser, Documentation & Analysis Tools: 2–4 GB RAM.',
      'Total required for a simultaneous 2-VM lab: 9–14 GB RAM.',
      'If your laptop has 8GB of soldered RAM, running two heavy graphical VMs will cause memory thrashing. The workaround: run lightweight headless Linux containers or upgrade via SODIMM slots to 16GB+.',
    ],
    exercise: {
      number: 2,
      title: 'Hardware & Virtualization Lab Planning Worksheet',
      objective: 'Audit your physical machine\'s RAM and CPU specs before installing hypervisors like VirtualBox or VMware.',
      steps: [
        'Open Task Manager (Windows) or Activity Monitor / `free -h` (macOS/Linux).',
        'Record total physical RAM, memory type (soldered vs. removable SODIMM slots), and current idle host memory usage.',
        'Calculate your VM headroom: Total RAM minus (Host OS idle RAM + 2GB safety buffer).',
        'If headroom is under 4GB, plan for headless CLI VMs (Alpine, Ubuntu Server) rather than graphical desktop images.',
      ],
      observation: 'Proper resource budgeting prevents system crashes and frustrating lab freezes.',
      takeaway: 'Match your home lab architecture to your actual physical hardware specifications.',
    },
    keyTakeaways: [
      'Computing operates in distinct hierarchical layers from silicon to applications.',
      'Memory management is a primary constraint for local home security labs.',
      'Headless CLI environments are far more memory-efficient than heavy graphical desktop VMs.',
    ],
    discussionQuestions: [
      'Does your current laptop have soldered memory or expandable SODIMM slots?',
    ],
  },

  // PART IV
  {
    number: 9,
    partNumber: 4,
    title: 'Learn the Language of Computers',
    slug: 'learn-the-language-of-computers',
    subtitle: 'System Vocabulary, Protocols, and Foundations of Telemetry',
    readTimeMinutes: 8,
    keyPrinciple: 'You cannot investigate systems you cannot describe. Understand what each term represents inside a live machine rather than memorizing buzzwords.',
    summary: 'Master the fundamental vocabulary of computing: IP and MAC addresses, TCP/UDP protocols, DNS, HTTP/HTTPS, Authentication vs. Authorization, processes, and logs.',
    content: [
      'You cannot investigate systems you cannot describe. Do not memorize buzzwords simply because security practitioners repeat them; understand what each term represents inside a live machine:',
      'IP & MAC Address: Logical network routing address (Layer 3) vs. physical hardware interface identifier (Layer 2).',
      'Port & Protocol (TCP/UDP): Service endpoints (e.g., port 80/443 for web, 22 for SSH, 53 for DNS) and reliable, connection-oriented transport (TCP) vs. lightweight, connectionless transport (UDP).',
      'DNS & HTTP/HTTPS: Translating human domain names into numerical IP addresses, and structuring client-server web requests and encrypted TLS sessions.',
      'Authentication vs. Authorization: Proving who you are (AuthN) vs. determining what permissions and actions you are permitted to perform (AuthZ).',
      'Process, Service & Log: Active programs executing in memory, background daemons running without user interfaces, and the historical audit trail they record.',
      'Vulnerability (OWASP, 2024): A flaw in system design, implementation, operation, or configuration that can be leveraged to violate security policies.',
    ],
    keyTakeaways: [
      'Technical vocabulary is an analytical tool, not decorative jargon.',
      'Authentication (identity verification) must never be confused with Authorization (permission check).',
      'Logs are the primary evidence repository for defensive investigation.',
    ],
    discussionQuestions: [
      'What is an example of an operation that has valid authentication but fails authorization?',
    ],
  },
  {
    number: 10,
    partNumber: 4,
    title: 'Don\'t Collect Tools. Learn Problems.',
    slug: 'dont-collect-tools-learn-problems',
    subtitle: 'The Four-Question Problem-First Investigation Framework',
    readTimeMinutes: 7,
    keyPrinciple: 'Tools are instruments, not the discipline itself. Understand the underlying protocol and problem before launching the scanner.',
    summary: 'A beginner can download dozens of security utilities and still understand nothing. Learn to reason from the problem statement down to the tool, never the reverse.',
    content: [
      'A beginner can download Kali Linux, Burp Suite, Wireshark, Nmap, Metasploit, PowerShell scripts, and Python scanners and still understand very little about security.',
      'When you focus on collecting tools, you become dependent on buttons without understanding what the tool is doing on the wire. When the tool encounters an unexpected error or an unusual network environment, you are stuck.',
      'Instead, adopt the 4-Question Problem-First Investigation Framework:',
      '1. What problem am I trying to solve? (e.g., "Is this server exposing unnecessary management ports?")',
      '2. What information do I need? (e.g., "A list of open TCP listening sockets on this host.")',
      '3. What technique answers that? (e.g., "Sending TCP SYN packets and listening for SYN-ACK responses.")',
      '4. Which tool helps me execute it? (e.g., "Nmap or a simple local netstat command.")',
    ],
    keyTakeaways: [
      'Tools change every few years; underlying network and OS protocols remain stable for decades.',
      'Always identify what question you are asking before opening a tool.',
      'Command-line native utilities (netstat, curl, tcpdump) teach deeper concepts than automated GUI suites.',
    ],
    discussionQuestions: [
      'Why is it more dangerous to run an automated vulnerability scanner without understanding it than to do nothing at all?',
    ],
  },
  {
    number: 11,
    partNumber: 4,
    title: 'What Happens When Systems Don\'t Behave?',
    slug: 'what-happens-when-systems-dont-behave',
    subtitle: 'Assumptions, Trust Boundaries, and the Anatomy of Anomalies',
    readTimeMinutes: 8,
    keyPrinciple: 'Every system embeds assumptions. When reality contradicts those assumptions, security vulnerabilities and system anomalies emerge.',
    summary: 'Software developers expect clean inputs, network architects assume internal traffic is trustworthy. Security practitioners study the gap between assumption and reality.',
    content: [
      'Every system embeds assumptions: a developer expects clean numeric input in a form, but a user supplies crafted characters; an administrator expects an internal database to be unreachable from the internet, but a misconfigured routing rule exposes it.',
      'When investigating any system behavior, train your mind to ask four sequential questions:',
      '1. What did the designers expect to happen?',
      '2. What actually happened in practice?',
      '3. Why is there a difference between the expectation and the outcome?',
      '4. Does that gap create risk, exposure, or an unintended capability?',
      'This mental habit transforms you from someone who merely memorizes security advisories into someone who understands why systems fail.',
    ],
    keyTakeaways: [
      'Vulnerabilities exist at the boundaries of unverified assumptions.',
      'Trust boundaries must be explicitly validated, never assumed.',
      'Investigating anomalies requires knowing what baseline "normal" behavior looks like.',
    ],
    discussionQuestions: [
      'Think of an everyday application you use. What assumptions does it make about its users?',
    ],
  },
  {
    number: 12,
    partNumber: 4,
    title: 'To Defend, Understand',
    slug: 'to-defend-understand',
    subtitle: 'Offensive Insight in Service of Defensive Resilience',
    readTimeMinutes: 9,
    keyPrinciple: 'Defenders reason better when they understand attack stages: reconnaissance, initial access, exploitation, credential abuse, privilege escalation, persistence, and lateral movement.',
    summary: 'The goal of understanding offensive techniques is not to cause harm, but to recognize attack patterns, interpret forensic artifacts, and construct resilient defenses.',
    content: [
      'Defenders reason far more effectively when they understand attack stages. You do not study attack techniques to become a criminal; you study them to recognize the fingerprints an attacker leaves across an enterprise.',
      'The modern attack lifecycle involves predictable stages: reconnaissance, initial access, exploitation, credential abuse, privilege escalation, persistence, lateral movement, command & control (C2), data exfiltration, and operational impact.',
      'Goal: Understand enough about attack behavior to recognize, investigate, and construct layered defensive detections.',
    ],
    exercise: {
      number: 3,
      title: 'Local Network Observation & Guided Log Interpretation',
      objective: 'Observe active sockets on your owned machine and interpret synthetic server authentication logs.',
      steps: [
        'On your own computer, open a terminal and run `ipconfig /all` (Windows) or `ip a` (Linux/macOS) and `netstat -ano` (or `ss -tulnp`).',
        'Identify your local IP address, subnet mask, default gateway, and at least one listening local port mapped to its Process ID (PID).',
        'Next, inspect this synthetic SSH log entry: `Oct 21 14:12:04 lab-vm sshd[2194]: Failed password for invalid user admin from 192.168.56.102 port 51422 ssh2`.',
        'Identify: (1) Timestamp, (2) Service, (3) Failed Authentication event, (4) Targeted username, (5) Source IP, and (6) Ephemeral source port.',
      ],
      observation: 'Security telemetry maps directly to real system vocabulary and attack stages (Initial Access / Credential Abuse).',
      takeaway: 'Defensive investigation is the systematic decoding of machine audit trails against known behavior models.',
    },
    keyTakeaways: [
      'Offensive awareness strengthens defensive architecture.',
      'Every attack step generates telemetry somewhere in the system.',
      'Log analysis is the foundation of digital forensics and threat hunting.',
    ],
    discussionQuestions: [
      'What kind of log entry would you expect to see if someone successfully guessed a user password?',
    ],
  },

  // PART V
  {
    number: 13,
    partNumber: 5,
    title: 'The Basics Are Not a Detour',
    slug: 'the-basics-are-not-a-detour',
    subtitle: 'Why Foundational Computing Is the Shortest Path to Security Mastery',
    readTimeMinutes: 7,
    keyPrinciple: 'Advanced security rests on ordinary fundamentals. Whenever an investigation stalls, return to the basics.',
    summary: 'Beginners frequently rush toward advanced exploitation topics while skipping foundational computing. Without fundamentals, advanced tools only create the illusion of understanding.',
    content: [
      'Beginners frequently rush toward advanced exploitation topics while skipping foundational computing. Yet if you cannot explain how an operating system schedules processes, how file permissions work, how DNS resolves a domain, how HTTP carries web state, or what a system log records, advanced security tools will only create the illusion of understanding.',
      'When an investigation stalls or an exploit fails to trigger, the expert does not guess; they examine the packet capture, verify the permissions, or check the system architecture.',
      'The basics are not a detour you must endure before reaching "real" cybersecurity—the basics ARE cybersecurity.',
    ],
    keyTakeaways: [
      'Rushing into tools without fundamentals leads to rapid plateaus.',
      'Deep knowledge of operating systems and networks is an unfair advantage.',
      'Troubleshooting always reduces to fundamentals.',
    ],
    discussionQuestions: [
      'Can you explain what happens when you type a URL into a browser and press Enter?',
    ],
  },
  {
    number: 14,
    partNumber: 5,
    title: 'Stop Trying to Become Good in Three Months',
    slug: 'stop-trying-to-become-good-in-three-months',
    subtitle: 'The Compounding Nature of Technical Judgment',
    readTimeMinutes: 7,
    keyPrinciple: 'Three months of study can transform your awareness, but it does not guarantee professional mastery. Judgment and pattern recognition compound over time.',
    summary: 'Debunking the pervasive commercial myth of overnight mastery. Technical capability requires repetition, failure, and cognitive consolidation.',
    content: [
      'Three months of focused study can transform your awareness, but it does not guarantee professional mastery. Touching Linux, networking, Python, cloud, and a certification syllabus is not the same as developing reliable capability.',
      'The Gym Analogy: A person who trains for six months cannot expect the physique or stamina of an elite athlete simply because they watched the same training videos. Knowledge, mental models, troubleshooting judgment, and pattern recognition compound through continuous practice.',
      'Set realistic expectations. Celebrate initial literacy, but commit to long-term compounding.',
    ],
    keyTakeaways: [
      'Beware of bootcamps promising complete mastery in 90 days.',
      'Awareness is rapid; troubleshooting judgment takes time to mature.',
      'Consistency across 12 months outperforms intense burnout over 6 weeks.',
    ],
    discussionQuestions: [
      'How does knowing that mastery takes time change your daily study schedule?',
    ],
  },
  {
    number: 15,
    partNumber: 5,
    title: 'The More You Learn, the More You Discover',
    slug: 'the-more-you-learn-the-more-you-discover',
    subtitle: 'Navigating Technical Depth and the Horizon of Knowledge',
    readTimeMinutes: 6,
    keyPrinciple: 'In cybersecurity, learning rarely makes the field look smaller—it makes it look larger. Realizing how much you still need to know is what depth looks like.',
    summary: 'As you understand networking, you encounter cloud routing; as you learn operating systems, you discover kernels and hypervisors. This expansion is natural progress, not failure.',
    content: [
      'In cybersecurity, learning rarely makes the field look smaller—it makes it look larger. Networking leads to cloud networking; operating systems lead to virtualization; web applications lead to APIs, identity systems, and distributed databases; malware analysis leads to reverse engineering, OS internals, and detection engineering.',
      'Realizing how much you still need to know is not failure; that is what depth looks like.',
      'Break things deliberately in your lab, but break them where you are prepared to rebuild them and document the fix.',
    ],
    keyTakeaways: [
      'Feeling that the field is expanding is evidence of genuine learning.',
      'Specialize in depth while maintaining situational awareness across adjacent fields.',
      'Document what you rebuild after breaking it.',
    ],
    discussionQuestions: [
      'When did a topic you recently studied lead you into an entirely new set of questions?',
    ],
  },
  {
    number: 16,
    partNumber: 5,
    title: 'Don\'t Travel Alone',
    slug: 'dont-travel-alone',
    subtitle: 'Communities, Mentors, and the Peer Verification Cycle',
    readTimeMinutes: 7,
    keyPrinciple: 'A learner working in isolation can spend three weeks stuck on an error a peer could clarify in ten minutes. Apply the verification cycle: Discover → Verify → Reproduce → Understand.',
    summary: 'Engage with reputable technical communities and documentation, but never blindly copy scripts or commands. Verify and reproduce every solution yourself.',
    content: [
      'A learner working in isolation can spend three weeks stuck on a misconfigured network adapter or syntax error that a mentor or peer could clarify in ten minutes.',
      'Engage with communities, practitioners, technical writers, documentation, and authorized CTFs—but never blindly copy commands or AI-generated code snippets.',
      'Always apply the four-step verification cycle: DISCOVER → VERIFY → REPRODUCE → UNDERSTAND.',
    ],
    keyTakeaways: [
      'Isolation increases the risk of giving up on minor setup hurdles.',
      'Copying commands without comprehension builds fragile knowledge.',
      'Explaining a concept to a peer is the ultimate test of your own understanding.',
    ],
    discussionQuestions: [
      'What cybersecurity study groups or local tech meetups exist in your area or online?',
    ],
  },
  {
    number: 17,
    partNumber: 5,
    title: 'Learn Beyond Cybersecurity',
    slug: 'learn-beyond-cybersecurity',
    subtitle: 'The Interdisciplinary Edge: Psychology, Law, Economics, and Systems',
    readTimeMinutes: 7,
    keyPrinciple: 'Sometimes the missing answer lies in psychology, economics, law, business, communication, or sociology—vital for social engineering, fraud, GRC, and AI governance.',
    summary: 'Cybersecurity is not just computer science. The strongest practitioners draw insights from economics (incentive models), psychology (cognitive bias), and law (statutory compliance).',
    content: [
      'Sometimes the missing answer lies outside of computer science: in psychology, statistics, economics, law, business management, communication, sociology, or mathematics.',
      'Social engineering relies on human heuristics and stress triggers; fraud investigation relies on financial incentive analysis; governance, risk, and compliance (GRC) relies on legal statutory interpretation; AI governance relies on data provenance and risk ethics.',
      'Your non-technical interests are not distractions; they are the interdisciplinary lenses that will give you an analytical edge.',
    ],
    exercise: {
      number: 5,
      title: 'Lab Failure Troubleshooting & Documentation Protocol',
      objective: 'Execute a disciplined 4-step diagnostic protocol when a virtual machine connection fails.',
      steps: [
        'Scenario: Two VirtualBox VMs on your laptop cannot ping each other.',
        'Step 1: Check hypervisor network mode (NAT vs. Host-Only vs. Internal Network / Bridged).',
        'Step 2: Verify IP subnet assignments and link state on both guests (`ip a` or `ipconfig`).',
        'Step 3: Check host and guest firewall rules (verify whether ICMP echo requests are blocked).',
        'Step 4: Record root cause and verified resolution in your lab journal so a peer could reproduce it.',
      ],
      observation: 'Disciplined methodology replaces chaotic guessing with repeatable engineering judgment.',
      takeaway: 'Documenting failures and resolutions creates the foundation of real troubleshooting capability.',
    },
    keyTakeaways: [
      'Security problems are fundamentally human and organizational problems.',
      'Understanding attacker and business incentives is as vital as understanding protocols.',
      'Interdisciplinary thinkers make the best risk strategists.',
    ],
    discussionQuestions: [
      'How do economic incentives influence whether an organization prioritizes security or speed?',
    ],
  },

  // PART VI
  {
    number: 18,
    partNumber: 6,
    title: 'Know the Rules Before You Travel',
    slug: 'know-the-rules-before-you-travel',
    subtitle: 'Statutory Law, Written Authorization, and the 2024 Cybercrimes Amendment',
    readTimeMinutes: 10,
    keyPrinciple: 'Technical capability never creates legal permission. Before interacting with any external system, understand written authorization, defined scope, and statutory law.',
    summary: 'A critical analysis of cyber law. In Nigeria, unauthorized access is penalized under the Cybercrimes Act (2024 Amendment) and personal data handling is governed by the NDPA 2023.',
    content: [
      'Cybersecurity operates within strict legal and ethical boundaries. Learning how a vulnerability or scanning tool works never grants you permission to test infrastructure you do not own.',
      'Before interacting with any external system, you must understand written authorization, defined scope, acceptable-use policies, coordinated vulnerability disclosure, privacy obligations, and statutory law.',
      'NIGERIAN LEGAL FRAMEWORK: 2024 AMENDMENT & NDPA 2023',
      'In Nigeria, unauthorized access, unlawful interception, system interference, and cyberstalking are criminal offenses under the Cybercrimes (Prohibition, Prevention, etc.) Act 2015, as updated by the Cybercrimes (Amendment) Act 2024 (which revised key reporting, critical infrastructure, and penalty provisions—always consult the amended 2024 statutory text).',
      'Furthermore, handling personal data is governed by the Nigeria Data Protection Act (NDPA) 2023 enforced by the Nigeria Data Protection Commission (NDPC).',
      'Golden Rule: Technical capability never creates legal permission.',
    ],
    keyTakeaways: [
      'Scanning or testing an organization without explicit written permission is illegal.',
      'Bug bounties require strict adherence to program scope and rules of engagement.',
      'The 2024 Amendment to the Nigerian Cybercrimes Act strengthens penalties for critical national information infrastructure violations.',
    ],
    discussionQuestions: [
      'Why is verbal permission from a friend to test their website not legally sufficient?',
    ],
  },
  {
    number: 19,
    partNumber: 6,
    title: 'Protect Yourself Before You Protect Others',
    slug: 'protect-yourself-before-you-protect-others',
    subtitle: 'Personal Operational Security Baseline and Digital Hygiene',
    readTimeMinutes: 8,
    keyPrinciple: 'Your cybersecurity education should make you safer, not merely more curious. Implement strong personal operational security before defending enterprise infrastructure.',
    summary: 'Establish an unassailable personal security baseline: password managers, hardware/app MFA, full-disk encryption, encrypted backups, and lab credential isolation.',
    content: [
      'Your cybersecurity education should make you safer, not merely more curious. You cannot convincingly advise an organization on data protection if your personal email password is recycled across ten websites and lacks multifactor authentication.',
      'Personal security is where your professional discipline begins. Clean up your personal attack surface today before configuring corporate firewalls.',
    ],
    exercise: {
      number: 6,
      title: 'Personal Security Baseline Checklist',
      objective: 'Audit and harden your personal accounts, devices, and laboratory environment.',
      steps: [
        '[ ] 1. Passwords & Manager: Replace all reused passwords with unique passphrases stored in an audited password manager.',
        '[ ] 2. Multifactor Authentication (MFA): Enable app-based (TOTP) or hardware-token MFA on email, banking, GitHub, and cloud accounts.',
        '[ ] 3. Patching & Disk Encryption: Enable automatic OS/browser updates and turn on full-disk encryption (BitLocker / FileVault / LUKS).',
        '[ ] 4. 3-2-1 Backups: Maintain an encrypted, offline backup of critical personal and study files.',
        '[ ] 5. Lab Isolation: Keep testing virtual machines isolated on separate virtual subnets without shared host clipboard or credentials.',
      ],
      observation: 'Security habits practiced personally translate into intuitive risk awareness professionally.',
      takeaway: 'Practice operational security in your own daily digital life.',
    },
    keyTakeaways: [
      'Personal hygiene is the foundation of professional credibility.',
      'SMS-based authentication is vulnerable to SIM-swap attacks; use app or hardware tokens.',
      'Always isolate lab credentials from personal and work accounts.',
    ],
    discussionQuestions: [
      'Which of the five baseline points in Exercise 6 is currently missing from your setup?',
    ],
  },

  // PART VII
  {
    number: 20,
    partNumber: 7,
    title: 'What Does a Certification Actually Prove?',
    slug: 'what-does-a-certification-actually-prove',
    subtitle: 'Standardized Signals, Hiring Realities, and Practical Limits',
    readTimeMinutes: 8,
    keyPrinciple: 'A certification is a standardized signal that you passed a specific exam or curriculum—it does not prove you can perform every real-world task. Your capability still has to survive the conversation.',
    summary: 'Instead of asking only "Which certification should I buy?", ask what the credential assesses and what it does not. Real hiring combines credentials with practical evidence and troubleshooting ability.',
    content: [
      'A certification is a standardized signal that you passed a specific exam or curriculum—it does not prove you can perform every real-world task. Instead of asking only "Which certification should I buy?", ask: "What does this certification actually assess, and what does it not prove?"',
      'Certifications focus on governance, risk, administration, defensive operations, offensive testing, cloud architecture, or vendor tools.',
      'ISC2 Workforce Research Reality (ISC2, 2025): Hiring managers evaluate prior IT experience, practical skills assessments, problem-solving, and certifications together rather than relying on any single credential.',
      'A certificate can open a conversation. Your capability still has to survive the conversation.',
    ],
    keyTakeaways: [
      'Certifications validate knowledge under specific test conditions, not total job readiness.',
      'Stacking multiple certifications without hands-on lab evidence raises hiring skepticism.',
      'Choose credentials that align with your targeted domain (defensive, offensive, GRC).',
    ],
    discussionQuestions: [
      'Why do you think some hiring managers prefer seeing a well-documented GitHub lab project over a paper certificate?',
    ],
  },
  {
    number: 21,
    partNumber: 7,
    title: 'Learning Is Not the Same as Getting Hired',
    slug: 'learning-is-not-the-same-as-getting-hired',
    subtitle: 'The Four-Stage Employability Pipeline',
    readTimeMinutes: 8,
    keyPrinciple: 'Never build your expectations around the linear myth of "Learn cybersecurity → immediately get hired." You can know security concepts yet lack verifiable evidence.',
    summary: 'Understand the four distinct stages: 01 Learning (theory) → 02 Competence (reliable tasks) → 03 Employability (documented evidence & communication) → 04 Employment (market match).',
    content: [
      'Never build your expectations around the linear myth of "Learn cybersecurity → immediately get hired." You can know security concepts yet lack verifiable evidence; you can hold certificates yet struggle with hands-on troubleshooting.',
      'Understand the four distinct stages:',
      '01 // LEARNING: Building mental models, absorbing theory, reading books, and attending lectures.',
      '02 // COMPETENCE: Executing real tasks reliably in a lab without step-by-step tutorial hand-holding.',
      '03 // EMPLOYABILITY: Documented evidence of work, clear communication, teamwork, and professional presence.',
      '04 // EMPLOYMENT: Market demand, hiring budget, role availability, and successful interview alignment.',
      'Recognizing these distinct stages prevents you from blaming your learning when your gap is actually in portfolio documentation or professional communication.',
    ],
    keyTakeaways: [
      'Mastering theory is only stage one of four.',
      'Employability requires translating lab work into clear, communicable business value.',
      'Many learners stall between Competence and Employability due to lack of public documentation.',
    ],
    discussionQuestions: [
      'Which stage of the four-stage pipeline do you currently find yourself in?',
    ],
  },
  {
    number: 22,
    partNumber: 7,
    title: 'Build Evidence, Not Just a Portfolio',
    slug: 'build-evidence-not-just-a-portfolio',
    subtitle: 'The 8-Stage Project Workflow and Documenting Technical Failure',
    readTimeMinutes: 9,
    keyPrinciple: 'A strong project does not merely showcase final success; it documents what failed initially, how you diagnosed the gap, and how you verified the fix.',
    summary: 'Move beyond generic screenshots of tool outputs. Document the full workflow: Idea → Research → Knowledge Gaps → Setup → Initial Failure → Fix → Evidence → Lessons.',
    content: [
      'Anyone can follow a 10-step YouTube video and post screenshots of a tool running. Hiring teams see dozens of identical screenshot portfolios every week.',
      'Real evidence documents the investigative process. What problem did you set out to solve? What failed on your first attempt? How did you read the error logs to diagnose the issue? How did you verify that your fix worked?',
      'PORTFOLIO EVIDENCE WORKFLOW: Idea → Research → Learning Gaps → Implementation → Failure → Iteration → Documentation → Verifiable Result.',
    ],
    exercise: {
      number: 7,
      title: 'Evidence-Based Portfolio Project Planning Worksheet',
      objective: 'Draft a 1-page technical write-up for a home lab project following the 8-stage documentation standard.',
      steps: [
        'Select a small, concrete home-lab project (e.g., configuring host firewall rules or analyzing failed SSH authentication logs).',
        'Structure your write-up using these exact headings:',
        '(1) Problem Statement, (2) Background Research, (3) Initial Knowledge Gaps, (4) Lab Setup & Architecture,',
        '(5) What Failed First, (6) How I Diagnosed and Fixed It, (7) Verification Evidence, and (8) Lessons Learned.',
        'Publish the write-up on GitHub or your technical blog.',
      ],
      observation: 'Documenting the failure and fix proves genuine analytical capability to any technical reviewer.',
      takeaway: 'Evidence of troubleshooting judgment is ten times more persuasive than a list of tools.',
    },
    keyTakeaways: [
      'Hiring managers value troubleshooting narrative far more than polished screenshots.',
      'Documenting your thought process demonstrates intellectual honesty and rigor.',
      'Small, well-documented projects beat massive, half-finished repositories.',
    ],
    discussionQuestions: [
      'What was the last technical error that frustrated you, and what did you learn from resolving it?',
    ],
  },
  {
    number: 23,
    partNumber: 7,
    title: 'Depth Creates Capability. Breadth Creates Context.',
    slug: 'depth-creates-capability-breadth-creates-context',
    subtitle: 'The T-Shaped Security Professional Profile',
    readTimeMinutes: 7,
    keyPrinciple: 'Deep in one area; broad enough to understand adjacent areas. Depth creates capability; breadth creates context.',
    summary: 'The goal is neither to know an inch of everything nor to be locked into an isolated silo. Build a T-shaped profile with one deep functional specialization supported by broad literacy.',
    content: [
      'A purely broad generalist knows buzzwords about everything but cannot configure or fix anything reliably under pressure.',
      'A purely narrow specialist can tune one specific firewall but has no idea how their changes affect web applications, cloud routing, or business operations.',
      'The solution is the T-shaped profile: deep capability in one core vertical (e.g., SOC analysis, cloud identity, or secure coding) grounded on a broad horizontal bar of systems, networking, and risk fundamentals.',
    ],
    keyTakeaways: [
      'The horizontal bar gives you context; the vertical pillar gives you employment value.',
      'Do not try to build five vertical pillars simultaneously.',
      'Choose one core area to become truly proficient in first.',
    ],
    discussionQuestions: [
      'What domain do you want to build your initial vertical pillar around?',
    ],
  },

  // PART VIII
  {
    number: 24,
    partNumber: 8,
    title: 'Cybersecurity in the Age of AI',
    slug: 'cybersecurity-in-the-age-of-ai',
    subtitle: 'Distinguishing AI-Powered Cybersecurity from Securing AI Systems',
    readTimeMinutes: 9,
    keyPrinciple: 'Do not ask "Will AI replace cybersecurity?" Ask: Which tasks are being automated, augmented, transformed, or newly created?',
    summary: 'Carefully separate using AI as a defensive assistant (detection, triage, summarization) from the engineering discipline of securing AI models, prompts, data, and autonomous agents.',
    content: [
      'Do not ask "Will AI replace cybersecurity?" Ask: Which tasks are being automated, augmented, transformed, or newly created?',
      'Distinguish two distinct domains:',
      '1. AI-Powered Cybersecurity: Using machine learning and LLMs to assist telemetry detection, alert triage, log summarization, anomaly detection, threat intelligence correlation, and incident response drafting.',
      '2. AI Security (Securing AI): Protecting machine learning models, training data pipelines, prompt boundaries, autonomous agent permissions, model supply chains, privacy leakage, and model governance.',
      'As AI automates repetitive junior tasks, the demand increases for practitioners who understand the underlying system fundamentals well enough to verify whether AI-generated outputs are accurate or dangerously flawed.',
    ],
    keyTakeaways: [
      'AI augments analysis but cannot replace contextual systems judgment.',
      'Prompt injection, model inversion, and data poisoning are new classes of security problems.',
      'Never paste sensitive organization data or private logs into untrusted public AI tools.',
    ],
    discussionQuestions: [
      'How does the rise of autonomous AI agents change how we think about system access permissions?',
    ],
  },
  {
    number: 25,
    partNumber: 8,
    title: 'Cybersecurity Never Stops Moving',
    slug: 'cybersecurity-never-stops-moving',
    subtitle: 'The Shifting Attack Surface and Continuous Learning as a Baseline',
    readTimeMinutes: 7,
    keyPrinciple: 'Cloud changed infrastructure; mobile changed endpoints; IoT expanded devices; AI transforms software and identity. You must keep learning after you become good.',
    summary: 'The security landscape is never static. Technology evolution constantly redefines trust boundaries, requiring an enduring commitment to curiosity.',
    content: [
      'Mainframes evolved into desktop computers; on-premise servers moved to multi-cloud architectures; office workers shifted to remote endpoints; static code gave way to AI pipelines.',
      'Every major technological wave creates new conveniences, new dependencies, and new attack surfaces.',
      'The future of cybersecurity is not a fixed destination where you eventually stop learning. It is an enduring mindset: People + Evolving Technology + Emerging Security Problems.',
    ],
    keyTakeaways: [
      'Continuous learning is a permanent feature of the career, not a temporary study phase.',
      'Foundations remain steady while implementations transform.',
      'Embrace curiosity rather than feeling overwhelmed by constant change.',
    ],
    discussionQuestions: [
      'What emerging technology outside cybersecurity do you think will create major security challenges in the next five years?',
    ],
  },

  // PART IX
  {
    number: 26,
    partNumber: 9,
    title: 'What Kind of Work Might Fit You?',
    slug: 'what-kind-of-work-might-fit-you',
    subtitle: 'The Work-Style Compass: Aligning Instinct with Security Domains',
    readTimeMinutes: 9,
    keyPrinciple: 'Do not start with "Which job pays the most?" Start with: "What kind of problems do I want to spend my time solving?"',
    summary: 'Explore the 8 core work-style directions: Builder, Defender, Investigator, Analyst, Researcher, Strategist, Communicator, and Organizer.',
    content: [
      'Do not start with "Which job pays the most?" Start with: "What kind of problems do I want to spend my time solving?"',
      'Combine (1) your existing skills, (2) what makes you curious, and (3) your preferred daily workflow to select a starting direction (not a permanent label):',
      '1. Builder / Engineer: Focuses on creating and deploying secure architectures (Security Engineering, DevSecOps, Cloud Security).',
      '2. Defender / Blue Team: Focuses on monitoring, threat detection, and system hardening (SOC Analyst, Defensive Operations).',
      '3. Investigator / Forensics: Focuses on uncovering what happened and why (Digital Forensics & Incident Response - DFIR, Malware Analysis).',
      '4. Analyst / Problem Solver: Focuses on structured pattern recognition and telemetry correlation (Threat Intelligence, SIEM Analytics).',
      '5. Researcher / Offensive: Focuses on discovering unknown vulnerabilities and security edge cases (Vulnerability Research, Penetration Testing).',
      '6. Strategist / Architect: Focuses on long-term risk reduction, policy alignment, and threat modeling (Security Architecture, vCISO advisory).',
      '7. Communicator / Educator: Focuses on translating technical risk into human action (Security Awareness Training, Technical Writing).',
      '8. Organizer / GRC: Focuses on regulatory governance, compliance audits, and data protection policies (GRC Analyst, Privacy Officer, NDPA Compliance).',
    ],
    keyTakeaways: [
      'There is a place in cybersecurity for builders, investigators, organizers, and communicators alike.',
      'Work-style alignment prevents career dissatisfaction and burnout.',
      'Your initial focus is a starting runway, not a life sentence.',
    ],
    discussionQuestions: [
      'Which two work-style directions feel most natural to your daily thinking habits?',
    ],
  },
  {
    number: 27,
    partNumber: 9,
    title: 'Find Your Starting Point',
    slug: 'find-your-starting-point',
    subtitle: 'Selecting Your First Functional Focus and Avoiding Paralysis',
    readTimeMinutes: 7,
    keyPrinciple: 'Action creates clarity where contemplation creates hesitation. Pick one functional starting point and commit to it for 90 days.',
    summary: 'Synthesizing your skills inventory and work-style compass into a concrete starting decision. Avoid spreading yourself thin across five different sub-specialties.',
    content: [
      'Analysis paralysis is the most common reason aspiring security practitioners fail to launch. They spend six months researching which path is "best" without completing a single lab.',
      'The truth is that every starting point teaches foundational computing that transfers across the entire field. Learning defensive log analysis will make you a better penetration tester later; learning secure coding will make you a sharper security architect.',
      'Make a clear decision for your first 90 days. Commit to depth in that starting point before evaluating whether to pivot.',
    ],
    exercise: {
      number: 8,
      title: 'Career Direction Comparative Audit',
      objective: 'Compare two candidate security work roles against your personal inquiry inventory from Exercise 1.',
      steps: [
        'Select two candidate roles from Chapter 26 (e.g., SOC Analyst vs. Security Compliance / GRC Analyst).',
        'Research 3 real job postings for each role in your target market (e.g., Nigeria or international remote).',
        'Compare daily responsibilities against your answers to Exercise 1.',
        'Choose the role with the highest natural alignment as your primary 90-day learning focus.',
      ],
      observation: 'Concrete role requirements replace vague assumptions with verifiable learning objectives.',
      takeaway: 'Pick your starting path based on evidence of alignment, not marketing hype.',
    },
    keyTakeaways: [
      'Any well-chosen technical starting point builds transferable foundations.',
      '90 days of focused depth creates more capability than 12 months of scattered dabbling.',
      'You can always adjust your course once your fundamentals are solid.',
    ],
    discussionQuestions: [
      'What is holding you back from committing to one primary starting path today?',
    ],
  },
  {
    number: 28,
    partNumber: 9,
    title: 'Your First 30, 60 and 90 Days',
    slug: 'your-first-30-60-and-90-days',
    subtitle: 'The Realistic Foundational Milestone Framework',
    readTimeMinutes: 9,
    keyPrinciple: 'Do not promise mastery within 90 days. 90 days creates an informed starting point, verifiable lab deliverables, and clear momentum.',
    summary: 'A structured, deliverable-driven framework: Days 1–30 (Understand), Days 31–60 (Explore), Days 61–90 (Choose & Build Evidence).',
    content: [
      'Stop wondering what to study tomorrow morning. Execute a structured three-phase roadmap grounded on concrete deliverables:',
      '01 // DAYS 1–30: UNDERSTAND (Systems, Hardware, Networking & Habits)',
      'Focus: Yourself, computer hardware, OS internals, networking protocols, core vocabulary, and safe lab habits.',
      'Deliverables: Completed Exercise 1 Inventory, Exercise 2 RAM Plan, and a verified 1-page diagram of your home network.',
      '02 // DAYS 31–60: EXPLORE (Exposure Across Systems, Telemetry & Defense)',
      'Focus: Hands-on exposure across networking sockets, defensive log interpretation, web application architecture, cloud basics, and threat modeling.',
      'Deliverables: Two documented mini-labs (Exercises 3–5) and a written comparison of two career paths (Exercise 8).',
      '03 // DAYS 61–90: CHOOSE & BUILD (Specialized Focus & Verifiable Project Evidence)',
      'Focus: Select one starting direction based on what held your sustained attention. Build a verifiable portfolio project.',
      'Deliverables: One published Chapter 22 portfolio report (Exercise 7) documenting background research, lab setup, what failed, how you resolved it, and next-quarter goals.',
    ],
    exercise: {
      number: 9,
      title: 'The 90-Day Deliverable Tracker',
      objective: 'Track your tangible milestones across the 30-day, 60-day, and 90-day boundaries.',
      steps: [
        'Set calendar milestones for Day 30, Day 60, and Day 90.',
        'Commit to evaluating your progress solely by completed deliverables, never by hours spent watching videos.',
        'Review your progress with a peer or mentor at the conclusion of each 30-day block.',
      ],
      observation: 'Tangible deliverables create momentum and permanent intellectual artifacts.',
      takeaway: 'Focus on what you build and verify, not what you passively consume.',
    },
    keyTakeaways: [
      'Measure progress by completed deliverables, not video watch hours.',
      'Days 1–30 build foundations; Days 31–60 build context; Days 61–90 build proof of capability.',
      '90 days establishes the runway for lifelong technical growth.',
    ],
    discussionQuestions: [
      'Which milestone deliverable will you complete by the end of your first 30 days?',
    ],
  },

  // PART X
  {
    number: 29,
    partNumber: 10,
    title: 'Cybersecurity as a Way of Seeing',
    slug: 'cybersecurity-as-a-way-of-seeing',
    subtitle: 'The Five Questions of the Security Mindset & You Are Not Late',
    readTimeMinutes: 8,
    keyPrinciple: 'Entering cybersecurity is like visiting a new country: you learn its language, rules, geography, risks, and people. You are not late. You are at the beginning.',
    summary: 'Cybersecurity changes how you perceive systems, assumptions, dependencies, and risk. Master the five fundamental questions of the security mindset.',
    content: [
      'Entering cybersecurity is like visiting a new country: you learn its language, rules, geography, risks, and people.',
      'You begin noticing assumptions, trust boundaries, economic incentives, vulnerabilities, anomalies, and hidden dependencies.',
      'You develop the permanent cognitive habit of asking five questions whenever you interact with any digital system:',
      '1. What is happening here? (Understanding the baseline architecture and telemetry).',
      '2. What does this system assume? (Identifying unverified trust assumptions).',
      '3. What could go wrong? (Anticipating failure modes, misconfigurations, and threats).',
      '4. What evidence would tell me? (Identifying the necessary logs and audit trails).',
      '5. What should happen next? (Constructing an effective, authorized response).',
      'CONCLUSION: YOU ARE NOT LATE',
      'You do not need to know everything before you begin—you need to know what you are beginning.',
      'Know yourself. Understand your computer. Learn the fundamentals. Respect authorization. Build evidence. Do not measure your Day 1 against someone else\'s Year 10, or confuse a certificate with mastery, learning with employment, or tools with understanding.',
      'Ask: (1) What do I understand today that I did not understand before? (2) What should I understand next?',
      'You are not late. You are at the beginning.',
    ],
    keyTakeaways: [
      'The security mindset is a habit of structured inquiry applied to all systems.',
      'Do not compare your beginning with an experienced practitioner\'s middle.',
      'Understanding what you are starting is the greatest competitive advantage you can hold.',
    ],
    discussionQuestions: [
      'Looking back across this entire guide, what is the single most important mindset shift you have experienced?',
    ],
  },
];

export const REFERENCES_AND_SOURCES = [
  {
    author: 'Federal Republic of Nigeria',
    year: 2015,
    title: 'Cybercrimes (Prohibition, Prevention, etc.) Act, 2015',
    publication: 'Official Gazette of the Federal Republic of Nigeria',
    notes: 'Primary statutory framework criminalizing unauthorized access, cyberstalking, and critical infrastructure attacks.',
  },
  {
    author: 'Federal Republic of Nigeria',
    year: 2023,
    title: 'Nigeria Data Protection Act, 2023',
    publication: 'Nigeria Data Protection Commission (NDPC)',
    url: 'https://ndpc.gov.ng/',
    notes: 'Governs processing, transfer, security, and rights regarding personal data in Nigeria.',
  },
  {
    author: 'Federal Republic of Nigeria',
    year: 2024,
    title: 'Cybercrimes (Prohibition, Prevention, etc.) (Amendment) Act, 2024',
    publication: 'Official Gazette of the Federal Republic of Nigeria',
    notes: 'Updated provisions for cybercrime reporting, penalty updates, and critical national information infrastructure.',
  },
  {
    author: 'ISC2',
    year: 2025,
    title: 'ISC2 Cybersecurity Workforce Study: Hiring, Skills & Artificial Intelligence',
    publication: 'International Information System Security Certification Consortium',
    url: 'https://www.isc2.org/research',
    notes: 'Global research analyzing skills gaps, hiring manager preferences, and AI adoption in security operations.',
  },
  {
    author: 'National Institute of Standards and Technology (NIST)',
    year: 2020,
    title: 'Workforce Framework for Cybersecurity (NICE Framework)',
    publication: 'NIST Special Publication 800-181, Rev. 1',
    url: 'https://doi.org/10.6028/NIST.SP.800-181r1',
    notes: 'Standardized reference taxonomy for cybersecurity work roles, tasks, knowledge, and skills.',
  },
  {
    author: 'National Institute of Standards and Technology (NIST)',
    year: 2024,
    title: 'The NIST Cybersecurity Framework (CSF) 2.0',
    publication: 'NIST CSWP 29, U.S. Department of Commerce',
    url: 'https://doi.org/10.6028/NIST.CSWP.29',
    notes: 'Cross-functional security management guidance organized across Govern, Identify, Protect, Detect, Respond, and Recover.',
  },
  {
    author: 'Open Worldwide Application Security Project (OWASP)',
    year: 2024,
    title: 'OWASP Vulnerability & Application Security Documentation',
    publication: 'OWASP Foundation',
    url: 'https://owasp.org/',
    notes: 'Authoritative standards for web application security vulnerabilities, secure development, and LLM risks.',
  },
];
