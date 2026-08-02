/**
 * The projects desk.
 *
 * Two audiences read this file. The front page prints only the short fields —
 * `dek`, `summary`, `decision`, `implementation` — in its "Currently in print"
 * cards, so those stay tight. Everything from `brief` downward is long-form and
 * renders only on /projects/[slug], where a story can take the room it needs
 * without costing the home page a single byte of layout.
 *
 * Array order is print order: it drives the archive listing, the `no` on each
 * card, and the previous/next links at the foot of an article.
 */

export type ProjectStatus = "Live" | "In development" | "Archived";

/** A titled run of paragraphs. Used for the brief, the build and the hurdles. */
export type ProjectSection = {
  heading: string;
  body: string[];
};

/** One fork in the road, and the argument for the branch that was taken. */
export type ProjectDecision = {
  heading: string;
  /** What was picked. */
  choice: string;
  /** Why it beat the alternative — the half that is actually worth reading. */
  rationale: string;
};

export type ProjectFeature = {
  heading: string;
  body: string;
};

/** A label/value row in the article's spec sheet. */
export type ProjectFact = {
  label: string;
  value: string;
};

/**
 * A row in the article's tech stack table. Grouped by job rather than by
 * vendor, the same way the front page groups the overall stack — a reader
 * wants to know what moves the media, not an alphabetised list of packages.
 */
export type ProjectStackRow = {
  label: string;
  value: string;
};

export type Project = {
  /** URL segment. Lowercase, hyphenated, and permanent once published. */
  slug: string;
  no: string;
  title: string;
  /** Standfirst: one sentence, printed under the headline everywhere. */
  dek: string;
  status: ProjectStatus;
  /** The years the project was actively worked on. */
  period: string;

  imageId: string;
  imageSrc?: string;
  imageAlt: string;
  /** Printed under the plate on the article page, in the caption voice. */
  imageCaption?: string;

  summary: string;
  decision: string;
  implementation: string;

  tags: string[];
  live?: string;
  source?: string;
  /** Only for projects that ship a package. */
  npm?: string;

  /* ---- Long-form. Article page only. ------------------------------- */

  /** What the project was for, before any code existed. */
  brief: ProjectSection;
  stack: ProjectStackRow[];
  /** How it is put together. Numbered 01, 02, … in print. */
  build: ProjectSection[];
  decisions: ProjectDecision[];
  features: ProjectFeature[];
  /** The parts that fought back. */
  hurdles: ProjectSection[];
  facts: ProjectFact[];
  /** Set large between rules, halfway down the article. */
  pullQuote: string;
};

export const projects: Project[] = [
  {
    slug: "meetnote-ai",
    no: "01",
    title: "MeetNote AI",
    dek: "Video calls that file their own paperwork — an SFU carries the media, a queue handles everything that happens after everyone hangs up.",
    status: "Live",
    period: "2025",

    imageId: "stdout-proj-1",
    imageSrc: "/projects/meetnote.webp",
    imageAlt: "MeetNote AI landing page",
    imageCaption: "The room screen. Media goes up once and comes back as many streams.",

    summary:
      "A MediaSoup SFU-powered video conferencing platform featuring an event-driven AI processing pipeline for meeting recordings converted into structured PDFs.",
    decision: "SFU architecture chosen for efficient media routing and horizontal scalability.",
    implementation:
      "Recording, transcription, and summarization run independently through distributed workers.",

    tags: ["MediaSoup", "SQS", "WebRTC", "AWS", "AI", "TypeScript"],
    live: "https://meet-note-ai.vercel.app/",
    source: "https://github.com/Mihirjataniya/MeetNote-AI",

    brief: {
      heading: "The assignment",
      body: [
        "A meeting produces two things worth keeping: the conversation itself, and the handful of decisions buried somewhere inside it. Most tools are good at the first and quietly leave the second to whoever remembered to take notes.",
        "MeetNote AI was built to do both in one place. Carry the call, then turn the recording into a structured document someone can skim three months later without replaying an hour of video to find the one thing they needed.",
        "That splits the problem cleanly in two, and the two halves have almost nothing in common. The call is real-time, latency-bound and stateful. Everything after it is batch work, minutes long, and allowed to fail and try again. Building them with the same tools would have made both worse.",
      ],
    },

    stack: [
      { label: "Language", value: "TypeScript" },
      { label: "Client", value: "React" },
      { label: "Media", value: "WebRTC, MediaSoup SFU" },
      { label: "Server", value: "Node.js" },
      { label: "Messaging", value: "AWS SQS, dead-letter queues" },
      { label: "AI", value: "Speech-to-text, LLM summarization" },
      { label: "Storage", value: "Object storage" },
      { label: "Cloud", value: "AWS" },
      { label: "Output", value: "Server-side PDF rendering" },
    ],

    build: [
      {
        heading: "Routing the media",
        body: [
          "There are three ways to move video between participants. A mesh has everyone send their stream directly to everyone else, which is elegant at two people and unusable at six — each participant uploads N-1 copies of themselves. An MCU mixes all the streams server-side into one composite, which is cheap on the client and brutally expensive on the server, because every room costs a live transcode.",
          "MeetNote uses the third: a Selective Forwarding Unit, built on MediaSoup. Each participant sends one stream up; the server forwards it to everyone who wants it. Nothing is decoded, mixed or re-encoded on the way through — the SFU is doing routing, not video processing, so a room costs bandwidth rather than CPU.",
          "That property is what makes the scaling story simple. MediaSoup splits work across workers and routers, so capacity grows by adding processes and then machines, instead of by finding a bigger one.",
        ],
      },
      {
        heading: "Recording without touching the call",
        body: [
          "Recording is taken from the streams the SFU is already forwarding, not from the browsers. Nothing about the live path changes when a recording starts: no extra upload from a participant, no client that quietly drops frames because it is now also encoding to disk.",
          "When the call ends, the recording is written to object storage and a single event is published. That event is the entire handoff — the real-time side is finished and forgets the meeting exists.",
        ],
      },
      {
        heading: "The pipeline after hang-up",
        body: [
          "Post-processing is three jobs with wildly different runtimes: transcription takes minutes, summarization takes seconds, rendering the document takes almost no time at all. Chaining them inside one process means the slowest stage owns the whole request, and one failure at the end throws away all the work before it.",
          "So each stage is its own worker behind its own SQS queue. A stage reads a message, does one thing, and publishes the next event. Retries are per-stage, back-pressure is per-stage, and a summarization outage cannot stop transcription from draining its backlog.",
          "Messages that keep failing land in a dead-letter queue instead of spinning forever, which turns a bad recording into an inbox item rather than an incident.",
        ],
      },
      {
        heading: "Turning a transcript into a document",
        body: [
          "A raw transcript is not notes — it is the meeting again, in a worse format. The summarization stage produces a fixed set of sections instead of free prose: what was discussed, what was decided, and what someone now has to do.",
          "Because the shape is fixed, the output is skimmable and comparable across meetings, and the renderer downstream can lay it out as a real document. The last worker turns that structure into a PDF.",
        ],
      },
    ],

    decisions: [
      {
        heading: "SFU over mesh or MCU",
        choice: "MediaSoup, forwarding only.",
        rationale:
          "Mesh grows uploads quadratically and falls over past a handful of participants. An MCU pays a server-side transcode for every room. Forwarding keeps server cost close to linear in participants and lets rooms scale by adding routers.",
      },
      {
        heading: "A queue between every stage",
        choice: "SQS, one queue per job type.",
        rationale:
          "Transcription is minutes and summarization is seconds. In one process the slow stage sets the pace and a late failure discards everything upstream of it. Separate queues give each stage its own retry policy, its own failure blast radius, and its own scaling knob.",
      },
      {
        heading: "Structured output over a free-form summary",
        choice: "A fixed section schema the model fills in.",
        rationale:
          "Open-ended summaries drift in length and shape, which makes them unreadable at a glance and impossible to render consistently. Fixed sections are skimmable, comparable between meetings, and safe to typeset.",
      },
      {
        heading: "TypeScript across signalling, workers and app",
        choice: "One language and one set of shared types.",
        rationale:
          "Room, track and job payloads cross process boundaries constantly. Sharing the type definitions turns a contract change into a build error instead of a message that silently fails to parse in a worker at 2am.",
      },
    ],

    features: [
      {
        heading: "Multi-party rooms",
        body: "Join by link. Camera, microphone and screen share travel over WebRTC through the SFU.",
      },
      {
        heading: "Server-side recording",
        body: "Captured from the forwarded streams, so no participant pays for it in dropped frames.",
      },
      {
        heading: "Automatic transcription",
        body: "Runs on its own worker once the recording lands, with no one waiting on the result.",
      },
      {
        heading: "Structured summary",
        body: "Discussion, decisions and action items, in the same order every time.",
      },
      {
        heading: "PDF export",
        body: "The finished notes are rendered as a document meant to be read, not a chat log.",
      },
      {
        heading: "Retry and dead-lettering",
        body: "A failed stage is requeued. A permanently failing one is parked, not lost.",
      },
    ],

    hurdles: [
      {
        heading: "Real-time media is not request and response",
        body: [
          "Almost every habit from HTTP work is wrong here. Connections renegotiate mid-call, transports fail without closing, and a participant who walked into a lift is not the same as a participant who left. Every one of those has to be a state the room knows how to be in, because the alternative is a call that looks fine and carries no video.",
        ],
      },
      {
        heading: "Long jobs against short timeouts",
        body: [
          "Queues assume work finishes quickly, and transcription does not. A message whose visibility timeout expires mid-job comes back and gets processed a second time, so handlers have to be safe to run twice — the same recording arriving again must produce the same document, not a duplicate.",
        ],
      },
    ],

    facts: [
      { label: "Status", value: "Live" },
      { label: "Type", value: "Real-time web application" },
      { label: "Transport", value: "WebRTC via a MediaSoup SFU" },
      { label: "Pipeline", value: "Event-driven workers on AWS SQS" },
      { label: "Language", value: "TypeScript, end to end" },
      { label: "Source", value: "Open" },
    ],

    pullQuote: "An SFU forwards; it never re-encodes. That single property is the entire scaling argument.",
  },
  {
    slug: "heliokit",
    no: "02",
    title: "HelioKit",
    dek: "A component library that refuses to be a dependency — the CLI reads your project, then writes the component into it.",
    status: "Live",
    period: "2025",

    imageId: "stdout-proj-2",
    imageSrc: "/projects/heliokit.webp",
    imageAlt: "HelioKit landing page",
    imageCaption: "The documentation site. Every component on it ships as source, not as an import.",

    summary:
      "An open-source React component library, motion-driven UI components with CLI that automatically detects project frameworks, and installs components directly into existing codebases.",
    decision: "A CLI-first workflow prioritizes code ownership over package abstraction.",
    implementation:
      "Framework-aware installation resolves dependencies and generates ready-to-use components.",

    tags: ["React", "Framer Motion", "CLI", "npm", "TypeScript"],
    live: "https://heliokit.vercel.app/",
    source: "https://github.com/Mihirjataniya/Heliokit",
    npm: "https://www.npmjs.com/package/heliokit",

    brief: {
      heading: "The assignment",
      body: [
        "Component libraries ask for a trade. You get polished, tested components, and in exchange the markup belongs to the package. Changing a detail means finding whichever theming escape hatch the author decided to ship, and a minor version bump can move something nobody on your team touched.",
        "HelioKit takes the other side of that trade. Components are installed as source files into the repository that asked for them, so from the first render the code is the project's own — editable, greppable, and reviewable in the same pull request as everything else.",
        "That reframes the whole product. The library is not the thing being distributed; the installer is.",
      ],
    },

    stack: [
      { label: "Language", value: "TypeScript" },
      { label: "Components", value: "React" },
      { label: "Motion", value: "Framer Motion" },
      { label: "Tooling", value: "Node.js CLI" },
      { label: "Distribution", value: "npm" },
      { label: "Output", value: "Generated source files" },
    ],

    build: [
      {
        heading: "The CLI is the product",
        body: [
          "Everything a consumer does goes through one command: name a component, and the CLI resolves it, works out where it belongs, and writes it to disk along with anything it depends on.",
          "There is no runtime package to import from and no version of HelioKit sitting in the dependency tree afterwards. What ships is files.",
        ],
      },
      {
        heading: "Reading the project before writing to it",
        body: [
          "Writing files into someone else's repository only works if you know its shape first. Before anything is generated, the CLI inspects the project: which React framework it is, whether it is TypeScript or JavaScript, how styling is set up, where components already live, and what import aliases are configured.",
          "Guessing wrong is not a cosmetic failure — it puts files in the wrong directory with imports that do not resolve. So detection runs to completion, and its conclusions are shown, before a single file is created.",
        ],
      },
      {
        heading: "Resolving what a component needs",
        body: [
          "Components are not islands. They share motion primitives and small utilities, and some are built out of others. The installer walks those local dependencies and brings them along, rather than emitting one file that immediately fails to compile.",
          "It also notices what is already present. Re-running the command on a component the project has since edited should not silently overwrite that work.",
        ],
      },
      {
        heading: "Motion as a default, not a decoration",
        body: [
          "Every component is authored with its transitions rather than having them bolted on afterwards, using Framer Motion for entrance, exit and layout animation.",
          "Hand-rolled CSS transitions are fine until something interrupts them mid-flight, or until an element has to animate between two layouts it does not control. Those two cases are most of the interesting ones.",
        ],
      },
    ],

    decisions: [
      {
        heading: "Copy source in, do not import from a package",
        choice: "Generated files in the consumer's repo.",
        rationale:
          "Ownership. Any line can be changed without a wrapper component or a theme override, and diffs show up in normal code review. The cost is losing automatic upgrades — accepted, because an unrequested change to a component's markup is usually the problem, not the fix.",
      },
      {
        heading: "Detection over configuration",
        choice: "Inspect the project instead of asking it to describe itself.",
        rationale:
          "A config file is one more thing to get wrong on the very first run, which is exactly when a new user has the least patience. The answers are already in the repository; reading them is faster than asking.",
      },
      {
        heading: "Framer Motion over CSS transitions",
        choice: "A motion library, in the components themselves.",
        rationale:
          "Interruptible and layout-aware animation is where hand-written keyframes stop being cheap. Making motion part of the component definition also stops it being the thing everyone skips.",
      },
      {
        heading: "TypeScript first",
        choice: "Components authored and shipped as typed source.",
        rationale:
          "For a library that hands over its source, the prop types are the documentation the consumer will actually read — they are in the file they just opened.",
      },
    ],

    features: [
      {
        heading: "Install by command",
        body: "One CLI call adds a component and its local dependencies to the project.",
      },
      {
        heading: "Framework detection",
        body: "Works out the framework, language and layout of the repo before writing anything.",
      },
      {
        heading: "Motion-driven components",
        body: "Transitions are authored with the component, not retrofitted around it.",
      },
      {
        heading: "You own the source",
        body: "No runtime dependency is left behind. The files are ordinary project files.",
      },
      {
        heading: "Typed props",
        body: "TypeScript throughout, so the component documents itself where it is used.",
      },
      {
        heading: "Published on npm",
        body: "The CLI is installable the ordinary way, and the components are open source.",
      },
    ],

    hurdles: [
      {
        heading: "Every repository is shaped differently",
        body: [
          "There is no single correct answer to where a component belongs. Projects disagree about directory names, path aliases, whether an app directory exists, and how deep the nesting goes. Detection covers the common shapes and, where the signal is genuinely ambiguous, the CLI asks rather than picking confidently and being wrong.",
        ],
      },
      {
        heading: "Writing into code you did not author",
        body: [
          "An installer that overwrites edited files loses trust permanently, and it only has to happen once. Running the same command twice has to be safe, existing files have to be recognised as existing, and anything destructive has to be confirmed first.",
        ],
      },
    ],

    facts: [
      { label: "Status", value: "Live on npm" },
      { label: "Type", value: "Component library and CLI" },
      { label: "Install", value: "Source files, not a runtime dependency" },
      { label: "Motion", value: "Framer Motion" },
      { label: "Language", value: "TypeScript" },
      { label: "Source", value: "Open" },
    ],

    pullQuote: "The best abstraction for a button is a file you can open.",
  },
];

const bySlug = new Map(projects.map((project) => [project.slug, project]));

export function getProject(slug: string): Project | undefined {
  return bySlug.get(slug);
}

/**
 * Neighbours in print order, for the "continued elsewhere" strip at the foot of
 * an article. Deliberately does not wrap around: the first entry has nothing
 * before it, and pretending otherwise sends readers in circles.
 */
export function projectNeighbours(slug: string): {
  previous?: Project;
  next?: Project;
} {
  const i = projects.findIndex((project) => project.slug === slug);
  if (i === -1) return {};
  return { previous: projects[i - 1], next: projects[i + 1] };
}

/** Every outbound link on a project, in the order they are printed. */
export function projectLinks(project: Project): { label: string; href: string }[] {
  return [
    { label: "live", href: project.live },
    { label: "source", href: project.source },
    { label: "npm", href: project.npm },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));
}
