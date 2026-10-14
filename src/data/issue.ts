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

/**
 * Right-hand side of the byline strip under the nameplate.
 *
 * These and `nav` below are printed on every page, including /projects, so the
 * section anchors are root-relative. A bare "#notes" would resolve against
 * whatever page the reader is on and point at nothing.
 */
export const mastheadLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
] as const;

export const nav = [
  { label: "Desk", href: "/#desk" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/projects" },
  { label: "Stack", href: "/#stack" },
  { label: "Notes", href: "/#notes" },
  { label: "Letters", href: "/#letters" },
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
  role: "Full Stack Developer, Glitch Over",
  period: "Feb 2025 – Present",
  location: "Ahmedabad, India",
  bullets: [
    "Contributed to building a platform that takes **streamer and fan interaction** to the next level through highly animated, **real-time UIs**, serving **5,000+ daily active users**.",
    "Built a **multi-provider payment** system on **Razorpay and Cashfree** that auto-routes each transaction to the provider with the higher live success rate, with full **ACID** transaction guarantees (MongoDB transactions) on all money movement.",
    "Secured the payment-gateway **webhook ingestion** pipeline across 3 providers with **HMAC-SHA256** timing-safe signature verification and idempotent order-status checks, eliminating replay attacks and duplicate wallet credits during gateway retry storms.",
    "Built a customer-support bot on **RAG** with multi-source internal search (**vector + keyword**, MongoDB Atlas Vector Search) that auto-escalates to a human executive on failure, deflecting **70%** of routine queries.",
    "Made the backend **stateless** and **horizontally scalable**, using a **Redis adapter (pub/sub)** to fan out Socket.IO events across servers, keeping live queue management and presence in sync for **1,000+ concurrent** users with sub-second updates.",
    "Improved perceived speed based on user feedback on lag by **reducing network round trips**: Redis caching, batched API calls, optimistic UI updates and CDN edge caching, cutting API **p95** latency by **40%**.",
    "Designed scalable **NoSQL schemas** on MongoDB (embedding vs. referencing, indexes on hot paths), with **aggregation pipelines** powering fast queries across all read paths.",
    "Redesigned the slot-booking **UI/UX** around a clearer availability and confirmation flow, reducing booking-confusion failures by **90%**.",
    "Designed **UI/UX** that makes the platform a richer entertainment medium for streamers and viewers, including **OBS overlays** that render fan-triggered animated actions and alerts live on stream, and a **Discord event-reporting bot**.",
    "Built separate social-profile and gaming-profile **factories**, each platform an **adapter** handling auth, fetching and normalisation, so a new platform is one adapter and zero core changes.",
    "Moved social-profile **scraping** and third-party integrations onto a **queue + message-broker architecture (AWS SQS)**, making high-volume asynchronous processing reliable and retryable.",
    "Built a scalable **notification service** fanning out email, push, in-app, and Discord alerts from a single event contract, with templating, per-user preferences, idempotent delivery, and retry with dead-letter handling — sustaining **50,000+ notifications/day** at **99.9%** delivery.",
    "Designed a **role-based access control** (RBAC) admin panel used across Finance, Partnerships, Marketing, Operations, and Engineering, enabling secure permission management and internal workflows.",
  ],
} as const;

/* Projects moved to `@/data/projects` — they carry long-form article copy now,
   and none of it belongs in the file the front page reads. */

export const stack = [
  { label: "Languages", value: "TypeScript, JavaScript, Python, Java, SQL" },
  {
    label: "Frontend",
    value: "React, Next.js, Tailwind CSS, Redux, Zustand, TanStack Query",
  },
  { label: "Backend", value: "Node.js, Express, REST APIs, WebSockets, Socket.IO" },
  { label: "Databases", value: "MongoDB, PostgreSQL, Redis, pgvector, Vector Databases" },
  {
    label: "Infrastructure",
    value:
      "Docker, AWS EC2, SQS, IAM, Amplify, Cloudflare, CI/CD, Storage Buckets, Logging & APMs, DNS Management",
  },
  {
    label: "AI / LLM",
    value:
      "LLM APIs, Tool Calling, Structured Output, RAG, Embeddings, Vector Search, Prompt Engineering, LLM Fallback, LangChain, LangGraph, Transformers, Tokenization",
  },
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

/**
 * Sidebar shortcuts. Every entry has to resolve to something that exists —
 * a real route, a real file, or a real profile. Declared after `contact` so it
 * can borrow those URLs instead of restating them.
 */
export const quickLinks = [
  { label: "All projects", href: "/projects" },
  { label: "MeetNote AI", href: "/projects/meetnote-ai" },
  { label: "HelioKit", href: "/projects/heliokit" },
  { label: "Puff PDF", href: "/projects/puff-pdf" },
  { label: "All blogs", href: "/blogs" },
  { label: "Blog: From Prompt to Bill", href: "/blogs/from-prompt-to-bill" },
  { label: "Blog: From Server 1 to N", href: "/blogs/from-server-1-to-n" },
  { label: "Resume (PDF)", href: masthead.resumeHref },
  { label: "GitHub", href: contact.github.href },
  { label: "LinkedIn", href: contact.linkedin.href },
  { label: "X", href: contact.x.href },
] as const;

export const colophon = [
  "STDOUT is a personal newspaper published irregularly on the internet.",
  "Built with Next.js, TypeScript and Tailwind CSS. Typeset in Playfair Display and IBM Plex Mono.",
  "Hosted on Vercel. Printed in Ahmedabad.",
  "Written, edited, designed and maintained by Mihir Jataniya.",
] as const;
