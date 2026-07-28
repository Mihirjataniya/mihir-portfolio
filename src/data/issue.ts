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
} as const;

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
    title: "Experience at GlitchOver",
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
    "Built a customer-support chatbot on a **RAG + LLM** pipeline with automatic escalation to human agents, deflecting 70% of routine queries while routing complex ones.",
    "Engineered **real-time** systems over WebSockets for a gig-based platform, including live queue management and presence, keeping state synchronized across 1,000+ concurrent users with sub-second updates.",
    "Cut API p95 latency by **40%** and database load via Redis caching for slow-changing data and by replacing raw MongoDB queries with aggregation pipelines; redesigned the slot-booking UI/UX, reducing booking-confusion failures by **90%**.",
    "Built social-profile **scraping** and third-party integrations on a queue + message-broker architecture (AWS SQS) for reliable asynchronous processing at scale, plus internal creator tooling: a Discord event-reporting bot and OBS-integrated live streaming overlays surfacing real-time platform events.",
    "Designed a role-based access control (RBAC) admin panel used across Finance, Partnerships, Marketing, Operations, and Engineering, enabling secure permission management and internal workflows.",
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
  trouble: string;
  live: string;
  source: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    no: "01",
    title: "MeetNote AI",
    imageId: "stdout-proj-1",
    imageAlt: "MeetNote screenshot",
    summary:
      "Video conferencing with an AI notes pipeline. Built on MediaSoup SFU. Async recording → transcription → notes via SQS. LLM fallback chain when providers fail.",
    decision: "MediaSoup SFU over mesh—came late, but was the right call.",
    trouble: "Transcription used to block the call. Decoupled with SQS. Never going back.",
    live: "#print",
    source: "#print",
    tags: ["MediaSoup", "SQS", "WebRTC", "AWS", "AI", "TypeScript"],
  },
  {
    no: "02",
    title: "HelioKit",
    imageId: "stdout-proj-2",
    imageAlt: "HelioKit screenshot",
    summary:
      "Open-source React component library with motion. CLI that detects your project and drops components in.",
    decision: "Build a CLI instead of copy-paste docs. Saved my future self hours.",
    trouble: "Supporting every setup edge case. Tsup + tests helped.",
    live: "#print",
    source: "#print",
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
    value: "Docker, AWS, Cloudflare, EC2, CI/CD, Storage Buckets, Logging & Monitoring",
  },
  { label: "AI", value: "RAG, LLM Integrations, Transformers, Tokenization, Prompt Design" },
] as const;

export const fieldNotes = [
  {
    icon: "book",
    label: "Reading:",
    text: "Designing Data-Intensive Applications. Again. Still relevant.",
  },
  { icon: "screen", label: "Watching:", text: "Severance (again). The hallway is cinema." },
  { icon: "code", label: "Learning:", text: "MediaSoup internals. Simulcast, SVC, and pain." },
  { icon: "headphones", label: "Listening:", text: "Tycho, Bonobo, Nujabes. On repeat." },
  { icon: "pen", label: "Building:", text: "HelioKit CLI. Small tool, surprisingly useful." },
  { icon: "mug", label: "Note to self:", text: "Ship the 70% version. Perfect is a delay." },
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
  { label: "Resume (PDF)", href: "#colophon" },
  { label: "GitHub", href: "#letters" },
  { label: "LinkedIn", href: "#letters" },
] as const;

export const classifieds = [
  {
    head: "FOR SALE:",
    body: "one abandoned side project, half-migrated to Postgres. Runs if you don't look at it.",
  },
  { head: "WANTED:", body: "problems worth solving. Boring is fine." },
  { head: "FREE:", body: "opinions, mostly unhelpful." },
  { head: "TRADE:", body: "your weekend for my deployment scripts." },
] as const;

export const contact = {
  email: "mihirjataniya1612@gmail.com",
  github: { label: "github.com/Mihirjataniya", href: "https://github.com/Mihirjataniya" },
  linkedin: {
    label: "linkedin.com/in/mihir-jataniya",
    href: "https://linkedin.com/in/mihir-jataniya",
  },
} as const;

export const colophon = [
  "STDOUT is a personal newspaper published irregularly on the internet.",
  "Built with Next.js, TypeScript and Tailwind CSS. Typeset in Playfair Display and IBM Plex Mono.",
  "Hosted on Vercel. Printed in Ahmedabad.",
  "Written, edited, designed and maintained by Mihir Jataniya.",
] as const;
