/**
 * Everything that changes between issues lives here.
 * Components stay dumb; the newsroom edits this file.
 */

export const masthead = {
  name: "STDOUT",
  tagline: "a personal engineering newspaper",
  author: "Mihir Jataniya",
  date: "May 24, 2025",
  city: "Ahmedabad",
  issue: "Issue No. 07",
  cadence: "Published irregularly",
  resumeHref: "/resume.pdf",
  /** Filename the browser saves it as, not the path it is served from. */
  resumeFile: "Mihir-Jataniya-Resume.pdf",
} as const;

/** Right-hand side of the byline strip under the nameplate. */
export const mastheadLinks = [
  { label: "Projects", href: "#print" },
  { label: "Blogs", href: "#notes" },
] as const;

export const nav = [
  { label: "Desk", href: "#desk" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#print" },
  { label: "Stack", href: "#stack" },
  { label: "Notes", href: "#notes" },
  { label: "Letters", href: "#letters" },
] as const;

export const contents = [
  { no: "01", title: "From the Desk", href: "#desk", blurb: "Why I build the plumbing." },
  {
    no: "02",
    title: "Experience",
    href: "#experience",
    blurb: "What I shipped and learned.",
  },
  { no: "03", title: "Projects in Print", href: "#print", blurb: "Things I'm building." },
  { no: "04", title: "Tech Stack", href: "#stack", blurb: "The tools I use." },
  { no: "05", title: "Education", href: "#education", blurb: "Where the boring started." },
  { no: "06", title: "Field Notes", href: "#notes", blurb: "Small things. Recently." },
  { no: "07", title: "Classifieds", href: "#classifieds", blurb: "For sale, wanted, etc." },
  { no: "08", title: "Letters", href: "#letters", blurb: "How to reach me." },
  { no: "09", title: "Colophon", href: "#colophon", blurb: "The fine print." },
] as const;

export const experience = {
  role: "MERN Stack Developer, GlitchOver",
  period: "Feb 2025 – Present",
  location: "Ahmedabad, India",
  bullets: [
    "Built a scalable **payment** microservice with full ACID transaction guarantees (MongoDB transactions) handling core money-movement logic for a platform serving 5,000+ daily active users.",
    "Secured the payment-gateway **webhook ingestion** pipeline across 3 providers with **HMAC-SHA256** timing-safe signature verification and idempotent order-status checks, eliminating replay attacks and duplicate wallet credits during gateway retry storms.",
    "Built a customer-support chatbot on a **RAG + LLM** pipeline with automatic escalation to human agents, deflecting 70% of routine queries while routing complex ones.",
    "Engineered **real-time** systems over WebSockets for a gig-based platform, including live queue management and presence, keeping state synchronized across **1,000+ concurrent** users with sub-second updates.",
    "Cut API **p95** latency by **40%** and reduced database load by caching slow-changing data in Redis and replacing raw MongoDB queries with **aggregation pipelines**.",
    "Redesigned the slot-booking **UI/UX** around a clearer availability and confirmation flow, reducing booking-confusion failures by **90%**.",
    "Moved social-profile **scraping** and third-party integrations onto a **queue + message-broker architecture (AWS SQS)**, making high-volume asynchronous processing reliable and retryable.",
    "Built a scalable **notification service** fanning out email, push, in-app, and Discord alerts from a single event contract, with templating, per-user preferences, idempotent delivery, and retry with dead-letter handling — sustaining **50,000+ notifications/day** at **99.9%** delivery.",
    "Shipped internal creator **tooling** that surfaces real-time platform events: a **Discord event-reporting bot** and **OBS-integrated live streaming overlays.**",
    "Designed a **role-based access control** (RBAC) admin panel used across Finance, Partnerships, Marketing, Operations, and Engineering, enabling secure permission management and internal workflows.",
  ],
} as const;

export type Project = {
  no: string;
  title: string;
  imageId: string;
  imageSrc?: string;
  imageAlt: string;
  summary: string;
  decision: string;
  implementation: string;
  live: string;
  source: string;
  /** Only for projects that ship a package. */
  npm?: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    no: "01",
    title: "MeetNote AI",
    imageId: "stdout-proj-1",
    imageSrc: "/projects/meetnote.webp",
    imageAlt: "MeetNote AI landing page",
    summary:
      "A MediaSoup SFU-powered video conferencing platform featuring an event-driven AI processing pipeline for meeting recordings converted into structured PDFs.",
    decision: "SFU architecture chosen for efficient media routing and horizontal scalability.",
    implementation:
      "Recording, transcription, and summarization run independently through distributed workers.",
    live: "https://meet-note-ai.vercel.app/",
    source: "https://github.com/Mihirjataniya/MeetNote-AI",
    tags: ["MediaSoup", "SQS", "WebRTC", "AWS", "AI", "TypeScript"],
  },
  {
    no: "02",
    title: "HelioKit",
    imageId: "stdout-proj-2",
    imageSrc: "/projects/heliokit.webp",
    imageAlt: "HelioKit landing page",
    summary:
      "An open-source React component library, motion-driven UI components with CLI that automatically detects project frameworks, and installs components directly into existing codebases.",
    decision: "A CLI-first workflow prioritizes code ownership over package abstraction.",
    implementation:
      "Framework-aware installation resolves dependencies and generates ready-to-use components.",
    live: "https://heliokit.vercel.app/",
    source: "https://github.com/Mihirjataniya/Heliokit",
    npm: "https://www.npmjs.com/package/heliokit",
    tags: ["React", "Framer Motion", "CLI", "npm", "TypeScript"],
  },
];

export const stack = [
  { label: "Languages", value: "TypeScript, JavaScript, Python, SQL" },
  {
    label: "Frontend",
    value: "React, Next.js, Tailwind CSS, Redux, Zustand, TanStack Query",
  },
  { label: "Backend", value: "Node.js, Express, REST APIs, WebSocket" },
  { label: "Databases", value: "MongoDB, PostgreSQL, Redis, Vector Databases" },
  {
    label: "Infrastructure",
    value: "Docker, Amplify, Cloudflare, EC2, CI/CD, Storage Buckets, Logging & APMs, DNS Management",
  },
  { label: "AI", value: "RAG, LLM Integrations, Transformers, Tokenization, Prompt Design" },
  {
    label: "Architecture",
    value:
      "Microservices, RBAC, MVC, Event-Driven Architecture, Payment Infrastructure, Factory Pattern",
  },
] as const;

export const fieldNotes = [
  {
    icon: "book",
    label: "Reading:",
    text: "Anything that explores distributed systems, system design, or how software scales.",
  },
  { icon: "screen", label: "Last Watch:", text: "The Odyssey. Still thinking about it." },
  {
    icon: "code",
    label: "Learning:",
    text: "AI. Evals, Models, agents, RAG, Attention Mechanisms, and everything in between.",
  },
  {
    icon: "headphones",
    label: "Listening:",
    text: "DHH",
  },
  {
    icon: "mug",
    label: "Away from the Keyboard:",
    text: "Gym sessions, trying new recipes, or simply sitting for hours doing nothing.",
  },
  { icon: "pen", label: "Note to self:", text: "Ship the 70% version. Perfect is a delay." },
] as const;

export const education = {
  school: "Mangalore Institute of Technology & Engineering",
  place: "Mangalore, India",
  degree: "B.E. in Computer Science",
  years: "2021 – 2025",
} as const;

export const quickLinks = [
  { label: "Latest Blog: Building around failure instead of uptime", href: "#print" },
  { label: "MediaSoup Notes", href: "#print" },
  { label: "Why I stopped using X", href: "#print" },
  { label: "How MeetNote evolved", href: "#print" },
  { label: "Resume (PDF)", href: masthead.resumeHref },
  { label: "GitHub", href: "#letters" },
  { label: "LinkedIn", href: "#letters" },
] as const;

/**
 * The back-page sudoku. Both strings are 81 chars, read left-to-right and
 * top-to-bottom; "." is a blank the reader fills in. Swap in a new pair each
 * issue — the component derives everything else from these two lines.
 */
export const sudoku = {
  no: "№ 07",
  difficulty: "Moderate",
  givens:
    "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79",
  solution:
    "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
} as const;

export const classifieds = [
  {
    head: "FOR HIRE:",
    body: "thoughtful engineering, ambitious products, and impossible deadlines.",
  },
  { head: "SEEKING:", body: "curious people building things that matter." },
  {
    head: "CURRENTLY:",
    body: "experimenting with distributed systems, AI, and developer tools.",
  },
  { head: "ALWAYS:", body: "learning, shipping, and improving." },
] as const;

export const contact = {
  email: "mihirjataniya1612@gmail.com",
  github: { label: "github.com/Mihirjataniya", href: "https://github.com/Mihirjataniya" },
  linkedin: {
    label: "linkedin.com/in/mihir-jataniya",
    href: "https://linkedin.com/in/mihir-jataniya",
  },
  x : { label: "@devwithdelulu", href: "https://x.com/devwithdelulu" },
} as const;

export const colophon = [
  "STDOUT is a personal newspaper published irregularly on the internet.",
  "Built with Next.js, TypeScript and Tailwind CSS. Typeset in Playfair Display and IBM Plex Mono.",
  "Hosted on Vercel. Printed in Ahmedabad.",
  "Written, edited, designed and maintained by Mihir Jataniya.",
] as const;
