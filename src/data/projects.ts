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

/** A titled run of paragraphs. Used for the brief and the build sections. */
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
  features: ProjectFeature[];
  /** Printed last: the forks only mean something once the build is understood. */
  decisions: ProjectDecision[];
};

export const projects: Project[] = [
  {
    slug: "meetnote-ai",
    no: "01",
    title: "MeetNote AI",
    dek: "A MediaSoup SFU carries the call; a three-stage queue turns what was said into a formatted PDF once everyone has left.",
    status: "Live",
    period: "2025",

    imageId: "stdout-proj-1",
    imageSrc: "/projects/meetnote.webp",
    imageAlt: "MeetNote AI landing page",
    imageCaption: "Media goes up once and comes back as many streams. The paperwork happens later, somewhere else.",

    summary:
      "A MediaSoup SFU video conferencing platform with an event-driven pipeline that transcribes each meeting while it is still running and turns the result into structured, downloadable notes.",
    decision: "An SFU forwards media instead of mixing it, so a room costs bandwidth rather than CPU.",
    implementation:
      "Transcription, finalization and note generation are three independent SQS workers, each with its own retry policy and dead-letter queue.",

    tags: ["MediaSoup", "WebRTC", "SQS", "AWS", "AI", "TypeScript"],
    live: "https://meet-note-ai.vercel.app/",
    source: "https://github.com/Mihirjataniya/MeetNote-AI",

    brief: {
      heading: "What it is",
      body: [
        "MeetNote is a browser-based meeting tool. People join a room by link, talk over video and audio, and when the last person leaves they are handed a written document: a summary, the topics that came up, the decisions that were made, and a checklist of who agreed to do what. It can be read on the site or downloaded as a PDF.",
        "There are really two products stitched together here, and they have almost nothing in common. The call is real-time, latency-bound and entirely stateful: a participant who reloads the page is a problem to be handled in milliseconds. Everything after the call is batch work that runs for minutes, is allowed to fail, and is expected to be retried. Building both with the same tools would have made both worse, so they are separated by a queue and never speak directly.",
        "The repository is a monorepo with two independent packages and no root manifest: a Node and Express server that owns the media, the sockets and the database, and a React client built with Vite. The server can additionally be started as a second, headless process that runs nothing but the queue consumers.",
      ],
    },

    stack: [
      { label: "Language", value: "TypeScript, both packages" },
      { label: "Client", value: "React 19, Vite, Tailwind CSS" },
      { label: "Client state", value: "Zustand, TanStack Query" },
      { label: "Routing", value: "React Router" },
      { label: "Realtime", value: "Socket.IO, mediasoup-client" },
      { label: "Server", value: "Node.js, Express 5, ESM" },
      { label: "Media", value: "mediasoup SFU over WebRTC" },
      { label: "Database", value: "MongoDB Atlas, Mongoose" },
      { label: "Queue", value: "AWS SQS, one DLQ per queue" },
      { label: "Capture", value: "MediaRecorder, Opus in WebM" },
      { label: "Audio", value: "FFmpeg (amix, 16 kHz mono WAV)" },
      { label: "Transcription", value: "Deepgram Nova-2" },
      { label: "Notes", value: "Gemini, with Groq as fallback" },
      { label: "Storage", value: "Cloudinary" },
      { label: "Documents", value: "marked, @react-pdf/renderer" },
      { label: "Auth", value: "JWT, bcrypt, Google OAuth" },
      { label: "Notifications", value: "Socket.IO, Web Push (VAPID)" },
      { label: "Offline", value: "Installable PWA, Workbox" },
      { label: "Hosting", value: "EC2 behind nginx, pm2; client on Vercel" },
      { label: "CI/CD", value: "GitHub Actions, OIDC into SSM" },
    ],

    build: [
      {
        heading: "Two systems, one repository",
        body: [
          "The web process boots in a fixed order: connect to MongoDB, start the mediasoup worker, create every SQS queue, start the consumers, then attach Socket.IO and listen. Queue creation always runs, even when the consumers are switched off, because this process still needs to publish jobs.",
          "There is a second entry point that skips the HTTP server, the sockets and mediasoup entirely and starts only the consumer loops. Run it alongside a web process with workers disabled and the transcription load scales independently of the media server; run neither and the single process does both. Which shape is in use is one environment variable.",
        ],
      },
      {
        heading: "Routing the media",
        body: [
          "There are three ways to move video between participants. A mesh has everyone send their stream to everyone else, which is fine at two people and unusable at six, because each participant uploads one copy of themselves per peer. An MCU mixes all the streams server-side into a single composite, which is cheap for clients and expensive for the server, since every room costs a live transcode.",
          "MeetNote uses the third option. A mediasoup worker is created at boot and each room lazily gets its own router; participants create a send transport and a receive transport, publish their tracks to the router, and subscribe to everyone else's. Nothing is decoded or re-encoded on the way through, so a room costs bandwidth, not CPU.",
          "Media does not travel over the same connection as the application traffic. Signalling runs over Socket.IO on the ordinary HTTPS port through the reverse proxy, while RTP goes straight to the host on a dedicated UDP port range, with TCP available as a fallback for networks that block it.",
          "When a participant leaves, their consumers, producers and both transports are closed explicitly, and once the last one is gone the router itself is closed. Media objects are not garbage collected on their own.",
        ],
      },
      {
        heading: "Getting into a room",
        body: [
          "Socket.IO authentication happens in middleware before any handler runs: the client supplies its JWT in the handshake, and a connection without a valid token is rejected outright rather than being allowed to connect and then filtered per event.",
          "The first person to create a room becomes its host. Anyone else knocks: they land in a waiting set and the host receives their request live, approving or denying it. Approval is tracked per socket and per user, so someone who was let in and then reloaded is readmitted without having to knock a second time.",
        ],
      },
      {
        heading: "Capturing the audio",
        body: [
          "Recording happens in the browser, per participant, using MediaRecorder on an audio-only clone of the local stream. Each participant produces their own Opus-in-WebM file rather than the server mixing everyone into one, because separate tracks survive one person having a bad microphone.",
          "The interesting part is how the stream is cut. To ship audio while the meeting is still running, the recorder is stopped, its accumulated blob is sealed, and a brand new recorder is started on the same stream. Slicing a running WebM stream produces fragments with no header that no decoder will open; restarting the recorder means every chunk is a complete, independently decodable file. Each chunk carries its offset from the start of the recording, which is what makes the transcript timeline reassemble correctly later.",
        ],
      },
      {
        heading: "Batching while the meeting is still running",
        body: [
          "Uploaded chunks are not transcribed one at a time. A per-room accumulator collects them and seals a batch when either it holds a chunk from every currently active participant, or fifteen seconds pass, whichever comes first. The participant count is read from the meeting document each time, so someone joining or leaving mid-call changes the seal condition immediately.",
          "A sealed batch gets a monotonic index, a start offset taken from the earliest chunk in it, and a flag marking the final batch. Then it goes onto a queue and the live process forgets about it. This accumulator is the one piece that cannot move to a worker: it depends on per-room timers and the live participant count, both of which only exist in the process holding the sockets.",
          "When the meeting ends, whatever has accumulated is sealed as the final batch. If nothing is left over but batches were already sent, the total is recorded directly instead, because otherwise a browser tab closed mid-sentence would leave the pipeline waiting for a final batch that is never coming.",
        ],
      },
      {
        heading: "Transcribing a batch",
        body: [
          "The transcription worker takes one batch, mixes its per-participant WebM files into a single 16 kHz mono WAV with FFmpeg, and sends that to Deepgram, asking for utterances rather than a flat string.",
          "FFmpeg's mixer averages its inputs by default, which quietly halves everyone's volume in a two-person call and does worse with more. In a meeting where most tracks are silence, that attenuates the one person actually talking until the transcriber returns nothing at all. The mix is configured to sum instead of average.",
          "Each returned utterance is stored with its timing shifted by the batch's start offset, so segments carry absolute positions in the meeting rather than positions within their own batch. The full text is rebuilt by sorting on that absolute time, which means batches can finish out of order without scrambling the transcript.",
          "Every batch index is recorded in a set on the transcript document, and a batch already in that set is skipped. Queues deliver at least once, so a handler that is not safe to run twice will eventually corrupt something.",
        ],
      },
      {
        heading: "Finalizing, and waiting for work you do not own",
        body: [
          "When the last participant leaves, the live process seals the final batch and publishes one finalize job. Everything expensive happens from there on in a worker.",
          "That worker has a problem a queue cannot express: it must not finish until every transcription batch has landed, and there is no primitive for waiting on other jobs. So it checks how many batches have been processed against how many were expected, and if the answer is not yet, it re-publishes itself with a delivery delay and returns. Roughly twenty of those deferred passes later it gives up waiting and proceeds on a best-effort basis rather than blocking a meeting forever.",
          "Once drained, it re-scans the room directory on disk rather than trusting the file list in the message, because late uploads are real. The audio is uploaded to Cloudinary, the recording is marked ready with its duration, and note generation is published to its own queue. If no incremental transcript exists at all, it falls back to mixing the whole meeting into one file and transcribing that in a single pass.",
          "The failure paths are as deliberate as the happy one. A meeting with no captured audio is marked skipped, not failed, so the dashboard shows a neutral state instead of an alarming one. A hard failure records that status before rethrowing, so the job can retry without leaving the interface stuck on a blank pending card.",
        ],
      },
      {
        heading: "Notes, and the document that comes out",
        body: [
          "Note generation is its own queue and its own worker. It builds a prompt around the transcript that also carries the meeting title, agenda, participants, date and duration, and demands a fixed markdown structure: a two-to-three sentence summary, discussion points grouped under sub-headings, numbered decisions, and action items as a checklist naming a person.",
          "Two rules in that prompt do most of the work. Sections with no real content must be omitted entirely rather than filled with the model's best guess, and nothing may be inferred that the transcript does not state. A summary that invents an action item is worse than no summary.",
          "There are two providers behind an interface, tried in order. Gemini runs first because its notes are better; Groq exists as a backstop for outages and rate limits. Only when every configured provider has failed does the job throw, which lets the queue retry it and eventually park it.",
          "The markdown is stored as-is. The PDF is rendered in the browser on demand: the markdown is parsed to tokens and mapped onto a styled document, so headings, checklists, tables and code blocks all keep their meaning on the page rather than being flattened into text.",
        ],
      },
      {
        heading: "Everything around the meeting",
        body: [
          "A meeting is a document with a lifecycle, not just a room ID. Meetings can be scheduled ahead, repeat on a recurrence that is expanded into individual occurrences up to a cap, and be invited to by user. Their status is partly derived rather than stored: a scheduled meeting becomes ready inside a window before its start time and missed once a grace period has passed, so nothing has to run a cron job to move it along. Invitations are exported as calendar files.",
          "Notifications go out over two channels from one call: into the live socket for anyone with the app open, and over Web Push for anyone who does not. Push subscriptions that come back gone or not-found are deleted on the spot instead of being retried forever. The client is an installable PWA that precaches only the static shell, with the API, the socket endpoint and room URLs explicitly excluded so a service worker can never serve a stale answer to real-time traffic.",
        ],
      },
      {
        heading: "Shipping it",
        body: [
          "The client is on Vercel. The server runs on a single small EC2 instance under pm2, behind nginx which terminates TLS and upgrades the WebSocket, with the application port never exposed. RTP is the exception and reaches the host directly on its own port range.",
          "Deployment is a GitHub Actions workflow that assumes an AWS role through OIDC, so there are no long-lived keys in secrets, and drives the box over SSM rather than SSH, which stays closed entirely. It fires only for changes under the server directory, since the client deploys itself, and it refuses to run two deploys at once. The pull on the box is fast-forward-only so a drifted instance fails loudly instead of quietly creating a merge commit.",
          "One more thing runs on boot: any recording still marked in-progress is republished as a finalize job. There are no live rooms immediately after a start, so anything in that state was orphaned by a crash, and re-enqueuing it is what stops a meeting hanging in a non-terminal state forever.",
        ],
      },
    ],

    features: [
      {
        heading: "Multi-party rooms",
        body: "Join by link, with camera, microphone and screen share carried over WebRTC through the SFU.",
      },
      {
        heading: "Host controls",
        body: "The room creator holds the door, and participants knock to be admitted or denied live.",
      },
      {
        heading: "In-meeting chat",
        body: "Messages persist with the meeting rather than disappearing when the tab closes.",
      },
      {
        heading: "Live transcription",
        body: "Audio is transcribed in batches while the meeting is still running, not in one pass afterwards.",
      },
      {
        heading: "AI meeting notes",
        body: "Summary, discussion topics, decisions and assigned action items in a fixed structure.",
      },
      {
        heading: "PDF export",
        body: "Notes render to a typeset document in the browser, with headings, checklists and tables intact.",
      },
      {
        heading: "Scheduling and recurrence",
        body: "Meetings can be booked ahead, repeated on a schedule, and exported to a calendar file.",
      },
      {
        heading: "Notifications",
        body: "In-app over the live socket, and Web Push for anyone who does not have the tab open.",
      },
      {
        heading: "Installable PWA",
        body: "The static shell is precached; the API, socket and room routes are deliberately never cached.",
      },
      {
        heading: "Meeting history",
        body: "Past meetings keep their recording, transcript, notes and participant list.",
      },
      {
        heading: "Google sign-in",
        body: "Alongside email and password, with accounts that have no password steered to the right button.",
      },
    ],

    decisions: [
      {
        heading: "An SFU, not a mesh or an MCU",
        choice: "mediasoup, forwarding only, one router per room.",
        rationale:
          "Mesh uploads grow with the square of the participant count and collapse past a handful of people. An MCU pays a server-side transcode for every room. Forwarding keeps cost close to linear and lets rooms scale by adding routers instead of finding a bigger machine.",
      },
      {
        heading: "Transcribe during the call, not after it",
        choice: "Batches sealed live and queued as the meeting runs.",
        rationale:
          "Waiting for the meeting to end means the entire transcription runtime lands after the last person leaves, which is exactly when they are waiting for output. Sealing batches on a participant-count trigger with a fifteen second ceiling means most of the work is already finished by the time the room empties.",
      },
      {
        heading: "Restart the recorder for every chunk",
        choice: "Stop, seal, and start a fresh MediaRecorder.",
        rationale:
          "Slicing a live WebM stream yields fragments with no header that no decoder will accept. Restarting costs a recorder instance and gives back chunks that are complete, standalone files, which is what lets them be transcoded and transcribed independently and out of order.",
      },
      {
        heading: "A queue per stage, each with a dead-letter queue",
        choice: "Three SQS queues: transcribe, finalize, generate notes.",
        rationale:
          "The stages have wildly different runtimes and failure modes. In one process the slowest sets the pace and a late failure discards everything upstream. Separate queues give each stage its own visibility timeout, its own retry budget, and a blast radius that stops at its own boundary.",
      },
      {
        heading: "Model the drain wait as a delayed re-enqueue",
        choice: "Finalize republishes itself with a delivery delay until batches land.",
        rationale:
          "SQS has no primitive for waiting on other jobs, and holding the message open would burn a consumer slot and eventually exceed the visibility timeout anyway. Re-enqueuing with a delay is a poll that costs nothing while it waits, with an attempt ceiling so a lost batch cannot stall a meeting forever.",
      },
      {
        heading: "Sum the audio tracks instead of averaging them",
        choice: "FFmpeg mixing with normalisation switched off.",
        rationale:
          "The default averages inputs, so mixing one speaker with several silent participant tracks divides the speech down until the transcriber returns nothing. The failure looked like a transcription bug and was an audio one.",
      },
      {
        heading: "Every handler safe to run twice",
        choice: "Processed batch indices recorded; terminal states checked before work.",
        rationale:
          "Queues deliver at least once, and a handler that runs for minutes will be redelivered eventually. Idempotency is not a refinement here: without it a duplicate delivery silently appends the same speech to the transcript a second time.",
      },
      {
        heading: "Two LLM providers behind one interface",
        choice: "Gemini first, Groq as fallback, chosen at call time.",
        rationale:
          "Note quality decided the order; availability decided that there is a second one at all. A rate limit on one provider should degrade the output slightly, not lose the meeting.",
      },
      {
        heading: "Render the PDF on the client",
        choice: "Markdown stored server-side, document generated in the browser.",
        rationale:
          "Keeps a headless renderer off a one-vCPU box, and keeps the notes as text that can be re-rendered or re-styled later. The stored artifact is the content, not one particular printing of it.",
      },
      {
        heading: "Deploy over SSM with OIDC, not SSH",
        choice: "GitHub Actions assumes an AWS role and sends a command to the instance.",
        rationale:
          "There is no long-lived key to leak from CI and no inbound SSH port to defend. The deploy pulls fast-forward-only so an instance that has drifted from the remote fails loudly instead of quietly merging.",
      },
    ],

  },
  {
    slug: "heliokit",
    no: "02",
    title: "HelioKit",
    dek: "A component library that refuses to be a dependency: the CLI copies the source into your repository and then gets out of the way.",
    status: "Live",
    period: "2025",

    imageId: "stdout-proj-2",
    imageSrc: "/projects/heliokit.webp",
    imageAlt: "HelioKit landing page",
    imageCaption: "The documentation site. Every component on it ships as source, never as an import.",

    summary:
      "An open-source library of animated React components distributed by CLI rather than as a package. One command copies a component's source into the project, so the code belongs to the codebase that asked for it.",
    decision: "Components are installed as files, not imported from a dependency, so every line stays editable.",
    implementation:
      "One repository builds two artifacts: a Node CLI bundled with tsup and published to npm, and a prerendered documentation site built with Vite.",

    tags: ["React", "Tailwind CSS", "framer-motion", "CLI", "npm", "TypeScript"],
    live: "https://heliokit.vercel.app/",
    source: "https://github.com/Mihirjataniya/Heliokit",
    npm: "https://www.npmjs.com/package/heliokit",

    brief: {
      heading: "What it is",
      body: [
        "HelioKit is a set of animated React components and the command-line tool that installs them. Running one command copies a component's source files into the project that asked for it. Nothing is imported from a package afterwards, and no HelioKit dependency is left in the tree.",
        "Component libraries normally ask for a trade. You get polished components, and in exchange the markup belongs to the package: changing a detail means finding whichever theming escape hatch the author decided to ship, and a version bump can move something nobody on your team touched. HelioKit takes the other side of that trade. From the first render the code is ordinary project code, editable and greppable and reviewable in the same pull request as everything else. What you give up is automatic upgrades.",
        "That reframes what is actually being distributed. The library is not the product; the installer is. The published npm package is a CLI whose job is to copy files out of itself, and the components ride along inside it.",
        "One repository holds both halves plus a documentation site that renders every component live. It builds to two separate outputs that never touch each other.",
      ],
    },

    stack: [
      { label: "Language", value: "TypeScript" },
      { label: "Components", value: "React 19" },
      { label: "Styling", value: "Tailwind CSS v4, theme tokens" },
      { label: "Motion", value: "framer-motion, canvas and rAF" },
      { label: "Icons", value: "lucide-react" },
      { label: "CLI", value: "Commander, Inquirer, fs-extra, Chalk" },
      { label: "CLI build", value: "tsup, ESM bundle" },
      { label: "Docs site", value: "Vite, vite-react-ssg" },
      { label: "Docs routing", value: "React Router, lazy routes" },
      { label: "Docs state", value: "Redux Toolkit" },
      { label: "Code display", value: "react-syntax-highlighter" },
      { label: "Distribution", value: "npm, MIT licensed" },
      { label: "Hosting", value: "Vercel" },
    ],

    build: [
      {
        heading: "One repository, two artifacts",
        body: [
          "The same repository produces a published CLI and a documentation website, and the two builds are kept apart on purpose. The CLI is bundled by tsup into an ESM file that the package manifest points its binary at. The site is built by Vite into a separate directory so it can never collide with the CLI bundle sitting next to it.",
          "This arrangement is what makes the copy-in model work at all. The components live in the repository as ordinary source files, the site imports them directly to render live previews, and the published package carries those same files so the CLI has something to copy. There is no build step that turns a component into a distributable, because a component never becomes one.",
        ],
      },
      {
        heading: "What the CLI does",
        body: [
          "Five commands, built on Commander. Two of them list what is available, one sets a project up, one adds components, and one adds a full page template.",
          "Adding a component is deliberately unclever: work out the destination directory, then copy the component's folder there. Components are self-contained, so there is no dependency graph to walk and nothing to rewrite on the way in. A slug that does not exist prints an error and the run continues with the rest rather than aborting the batch.",
        ],
      },
      {
        heading: "Deciding where files go, once",
        body: [
          "The tool does not try to infer the whole shape of an unfamiliar repository. It asks: Vite, Next.js, or a custom path. Guessing wrong here is not cosmetic, since it means files land in a directory the project does not use, with imports that never resolve, so the question is asked outright rather than answered by heuristics.",
          "There is exactly one inference. On Next.js it checks whether a source directory exists and picks the nested or root component path accordingly, printing a warning when it falls back to the root.",
          "The answer is then offered up for saving into a small config file at the project root. Every later command reads that file and skips the prompt entirely, so the interrogation happens once per project rather than once per component.",
        ],
      },
      {
        heading: "The setup command",
        body: [
          "Components assume Tailwind v4, framer-motion and lucide-react. Rather than documenting that and hoping, there is a command that installs them, with the Tailwind integration package chosen by framework: the Vite plugin for Vite, the PostCSS plugin plus PostCSS itself for Next.",
          "It then wires the build. On Vite it reads the config, prepends the plugin import and injects the call into the plugins array, but only when the plugin is not already referenced, so re-running it does not stack duplicates. On Next it writes a PostCSS config when one is missing.",
          "Finally it makes sure the Tailwind import is present in the stylesheet entry, creating that file if it does not exist, appending the line if the file exists without it, and saying so and doing nothing if it is already there. Each of the three outcomes prints a different message, because a setup step that is silent about what it changed in someone else's repository is worse than one that does nothing.",
        ],
      },
      {
        heading: "Templates, and the one place dependencies are tracked",
        body: [
          "Beyond single components there are full page templates. A manifest maps each template name to its source file and to the list of component slugs that page imports.",
          "Copying a template therefore copies the page and then the components it needs, so the result compiles without a second command and without the user having to read the imports to find out what is missing. This manifest is the only place in the project where one thing declares that it depends on another, and it exists precisely because a template is the only thing here that is not self-contained.",
        ],
      },
      {
        heading: "Components that stay portable",
        body: [
          "Two dozen components live in the repository, each in its own folder with a demo file beside it that the documentation preview renders.",
          "Portability is a constraint, not an aspiration. Beyond React the only imports permitted are framer-motion and lucide-react, and colours come from theme tokens rather than literals, which is what allows a component to be dropped into a repository nobody planned for and still look correct. The heavier visual pieces skip the motion library entirely and drive a canvas from a requestAnimationFrame loop with typed, documented props for the things worth tuning.",
        ],
      },
      {
        heading: "Two themes from three variables",
        body: [
          "The whole design system is three colour tokens and a handful of font tokens declared in the Tailwind v4 theme block. Light mode is a single class that redefines those three colours. There is no dark variant anywhere in any component, because a component that reads a background token is already correct in both themes and one that hardcodes a colour cannot be fixed by adding variants to it.",
          "The background colour is also painted on the document itself rather than only on component wrappers. Anything the application has not painted yet, an overscroll bounce or a gap while a lazy route loads, shows the browser canvas underneath, and that canvas is white unless the document says otherwise.",
        ],
      },
      {
        heading: "The documentation site",
        body: [
          "Every component has a data module holding its live preview, its source, its installation steps and its props table. A slug map turns those into dynamic imports, so opening one component's page loads that component's payload and nothing else. A small Redux slice holds whichever component is currently being viewed and backs the preview, the code panel and the props table from one place.",
          "The manual install snippet is not a copy of the component pasted into a string. It imports the component file raw, so the code shown on the page is the file on disk. Documentation that is a transcription of the source drifts from it the first time the source changes; documentation that is the source cannot.",
        ],
      },
      {
        heading: "Prerendering, and what is deliberately not prerendered",
        body: [
          "The site is prerendered to static HTML, and the routes are lazily loaded per page so the initial download does not carry the syntax highlighter, the motion library and every canvas component along with the landing page.",
          "Only the static routes are emitted as HTML. The parameterised ones, individual component pages and template previews, stay client-rendered, because those are the pages a crawler does not need and a reader reaches by navigating rather than by landing.",
          "Head tags come from one component fed by a single site config, so canonical URLs, social cards and structured data are all derived from one origin string and are baked into the prerendered HTML rather than applied after hydration. Full page template previews get their own route outside the site layout, with no navigation bar, so a template can be framed in the docs or opened standalone and fill the viewport as its own page.",
        ],
      },
    ],

    features: [
      {
        heading: "One-command install",
        body: "Name a component and its source files are copied into the project, with no package left behind.",
      },
      {
        heading: "Project setup",
        body: "A single command installs Tailwind v4, framer-motion and lucide-react, then wires the build config.",
      },
      {
        heading: "Two dozen components",
        body: "Accordions, calendars, pricing tables, card stacks, canvas backgrounds and text effects.",
      },
      {
        heading: "Full page templates",
        body: "Landing pages, a dashboard and a board, which pull in the components they import automatically.",
      },
      {
        heading: "Remembered destination",
        body: "The install path is asked once and stored at the project root, so later commands run without prompting.",
      },
      {
        heading: "Two themes, three variables",
        body: "Light and dark come from redefining three colour tokens, with no dark variants in any component.",
      },
      {
        heading: "Live documentation",
        body: "Every component has a rendered preview, its real source, install steps and a props table.",
      },
      {
        heading: "Prerendered site",
        body: "Static routes ship as HTML with canonical, social and structured data already in the head.",
      },
      {
        heading: "Published and open",
        body: "On npm under the MIT licence, with the components readable in the repository.",
      },
    ],

    decisions: [
      {
        heading: "Copy the source in, do not ship a runtime package",
        choice: "Files written into the consumer's repository.",
        rationale:
          "Any line can be changed without a wrapper component or a theme override, and the change shows up in normal code review. The cost is losing automatic upgrades, which is accepted, because an unrequested change to a component's markup is usually the problem rather than the fix.",
      },
      {
        heading: "Ask which framework it is",
        choice: "A prompt on first run, saved to a config file.",
        rationale:
          "Detection that is right most of the time is worse than a question here, because the failure mode is files in a directory the project does not use with imports that never resolve. Asking once and remembering the answer costs one prompt per project, not one per command.",
      },
      {
        heading: "Keep components self-contained",
        choice: "React, framer-motion and lucide-react, nothing else.",
        rationale:
          "The installer copies a folder and stops. That only stays true while a component cannot reach outside its own directory, so the constraint on imports is what keeps the install step from needing a dependency resolver.",
      },
      {
        heading: "One repository, two build outputs",
        choice: "tsup for the CLI, Vite for the site, separate directories.",
        rationale:
          "The documentation site and the published package need the same component sources, and keeping them in one place is the only way the previews are guaranteed to be what gets installed. Separate output directories stop the two builds from overwriting each other.",
      },
      {
        heading: "Import the component source for its own documentation",
        choice: "Raw file imports instead of pasted code strings.",
        rationale:
          "A snippet copied into a template literal is correct exactly until the component changes. Importing the file means the page cannot disagree with the code it is documenting.",
      },
      {
        heading: "Theme tokens instead of dark variants",
        choice: "Three colour variables, overridden by one class.",
        rationale:
          "A component that reads a token is already correct in both themes. One that hardcodes a colour cannot be rescued by adding variants, and every variant added is a second place to forget.",
      },
      {
        heading: "Prerender the pages a crawler lands on, and only those",
        choice: "Static routes to HTML, parameterised routes left client-rendered.",
        rationale:
          "The marketing and index pages are what search results point at and what a first-time visitor sees. Individual component pages are reached by navigating, so prerendering all of them would multiply build output for pages nobody arrives at cold.",
      },
      {
        heading: "Paint the background on the document",
        choice: "The background colour set on the root elements, not just on wrappers.",
        rationale:
          "Anything the application has not painted yet shows the browser canvas, which is white. Overscroll on iOS and the gap while a lazy route loads both hit that, and a component wrapper is too far down the tree to cover either.",
      },
    ],
  },
  {
    slug: "puff-pdf",
    no: "03",
    title: "Puff PDF",
    dek: "The browser will not let you draw on its PDF viewer, so this replaces the viewer. What you draw exports back into a real PDF that opens anywhere.",
    status: "Live",
    period: "2026",

    imageId: "stdout-proj-3",
    imageSrc: "/projects/puff-pdf.webp",
    imageAlt: "Puff PDF landing page",
    imageCaption: "The landing page, which is itself a sheet of paper you can scribble on.",

    summary:
      "A browser extension that intercepts PDF navigations and swaps the built-in reader for an annotator: pen and shapes, highlights that snap to words, sticky notes, OCR for scans and read-aloud, all running locally with nothing uploaded.",
    decision: "The built-in viewer is a closed plugin, so the extension replaces it rather than trying to draw on top of it.",
    implementation:
      "PDF.js renders each page beneath a transparent canvas and a text layer, and pdf-lib burns the markup into a flattened PDF on export.",

    tags: ["Extension", "Manifest V3", "PDF.js", "pdf-lib", "Canvas", "OCR"],
    live: "https://puff-pdf.netlify.app/",
    source: "https://github.com/Mihirjataniya/puff-pdf",

    brief: {
      heading: "What it is",
      body: [
        "Puff PDF is a browser extension that turns any PDF into something you can write on. Open a PDF link, or drag a file in, and it loads into a viewer with a pen, a brush, shapes and arrows, two kinds of highlighter, text boxes, images, sticky notes and an eraser. Markup is saved as you go and comes back the next time the same file is opened.",
        "Export writes a genuine PDF with the annotations baked into the page content. It opens correctly in Acrobat, in Preview, and anywhere else, including after the extension has been uninstalled. Nothing is a proprietary sidecar file and nothing depends on the extension still being installed to be readable.",
        "It runs from one codebase on Chromium browsers and on Firefox, and there is no build step at all. Every first-party file is plain, unminified JavaScript, and everything it does happens on the device: no servers, no accounts, no uploads.",
      ],
    },

    stack: [
      { label: "Language", value: "JavaScript, no build step" },
      { label: "Platform", value: "Manifest V3, Chromium and Firefox" },
      { label: "Rendering", value: "PDF.js, render and worker builds" },
      { label: "Drawing", value: "Canvas 2D, one layer per page" },
      { label: "Export", value: "pdf-lib" },
      { label: "OCR", value: "Tesseract.js, vendored offline" },
      { label: "Speech", value: "Web Speech API" },
      { label: "Storage", value: "Extension local storage" },
      { label: "Interception", value: "webNavigation, webRequest" },
      { label: "Split view", value: "Iframes and postMessage" },
      { label: "Packaging", value: "PowerShell zip script" },
      { label: "Landing page", value: "Static site on Netlify" },
    ],

    build: [
      {
        heading: "Replacing a viewer you are not allowed to draw on",
        body: [
          "Every browser ships a PDF viewer, and every one of them is a closed plugin with no surface to draw on. The only way in is to make sure it never opens. A background service worker watches navigations and sends anything that is a PDF to the extension's own viewer page instead.",
          "There are two triggers, because there are two ways to find a PDF. The first fires before the request goes out, on URLs whose path or query ends in the right extension, which means the browser never downloads the file twice. The second reads the response headers for a PDF content type, catching files served without a telling extension, and deliberately steps aside when the response asks to be downloaded rather than displayed.",
          "Both can fire for the same navigation, so redirects are recorded per tab with a timestamp and a second attempt within a few seconds is dropped. Without that the page bounces.",
        ],
      },
      {
        heading: "One coordinate space, chosen for the exit",
        body: [
          "Every annotation stores its geometry in the page at scale one, origin top left, measured downwards. That is not an arbitrary choice: at scale one a PDF.js unit is exactly a PDF point, so the coordinate the pen wrote is already the coordinate the exporter needs.",
          "Drawing on screen multiplies by the current zoom, and export flips the axis, because PDF user space measures upwards from the bottom left. Those are the only two conversions in the project. Storing screen pixels instead would have meant every saved file was tied to the zoom level and the display density it was drawn at.",
        ],
      },
      {
        heading: "A page is three stacked layers",
        body: [
          "Each page is a PDF.js canvas with a transparent drawing canvas over it and a selectable text layer over that. The rendered page never changes, the drawing layer is repainted from the annotation list whenever something moves, and the text layer exists so the browser's own text selection can be borrowed.",
          "A long document cannot paint every page. An intersection observer with a generous margin around the viewport decides what is live: all pages are sized immediately, which is cheap and keeps the scrollbar honest, but only the ones near the viewport hold rendered bitmaps. Scrolling away releases them.",
        ],
      },
      {
        heading: "Two kinds of highlight",
        body: [
          "Highlighting words uses the real text layer and the browser's native selection, so a drag snaps to words and sentences. The rectangles a selection range hands back are line boxes, which stretch to the container edge and bleed across the gaps between paragraphs, so the selection is instead clipped to each individual text span and measured there. The result hugs the glyphs actually selected.",
          "The freehand highlighter works on anything, including a scan with no text in it at all.",
          "Both are composited the same careful way. Translucent strokes drawn one after another stack their alpha, so a crossing looks darker than the two strokes that made it. Instead, every highlight of a given colour and opacity is drawn fully opaque into an offscreen canvas, and that whole layer is blitted once at the group's opacity. Overlaps come out as one flat shade, the way a real marker behaves. Rectangles that share a line are merged into single bars first.",
        ],
      },
      {
        heading: "Undo that survives the page order changing",
        body: [
          "History entries record what was added, what was removed and what was moved, so one step can cover a multi-page operation and undo knows exactly which pages need repainting. The stack is capped, and anything that mutates the document schedules a debounced save rather than writing on every stroke.",
          "After an undo the current selection may point at an annotation that no longer exists, so it is dropped rather than left dangling with resize handles floating over nothing.",
        ],
      },
      {
        heading: "Saving to the file, not to the address",
        body: [
          "Markup is keyed to a hash of the PDF's bytes. The same document reached through a different link, or downloaded and opened locally, restores the same annotations, and two different files that happen to share a URL never collide.",
          "The saved format stores the full page order alongside the annotations, with each page carrying a stable identifier rather than a position. Blank pages can be inserted mid-document, so a position-keyed save would silently shift everyone's markup down by one the next time the file opened. Saves written by the older, position-based format are still read, and are mapped by position, because that is what they meant when they were written.",
        ],
      },
      {
        heading: "Making a scan selectable",
        body: [
          "A scanned PDF is a picture of a document with no text in it. Detecting one by checking for a text layer is wrong in both directions, so the detection reads the page's operator list and looks for a page that is essentially one image with almost no drawing operations. A vector page has hundreds of path operations even when its text is outlined, and a scanned book that carries a hidden text layer still reads as a scan. The same pass records the intrinsic width of the largest image, which gives the scale at which the scan renders one to one and stops it being upscaled into mush.",
          "Recognition runs on demand, one page at a time, through a locally bundled OCR engine. Bundling is not a preference: the extension's content security policy blocks loading code from a CDN and blocks workers created from blobs, so the engine, its WebAssembly core and its language data all ship inside the extension and the worker is pointed at those paths explicitly.",
          "What comes back is a list of word boxes in image pixels. Those are mapped into the page's coordinate space and used to build a synthetic text layer positioned over the scan, at which point native selection, word-snapped highlighting and read-aloud all start working on that page. Results are cached per page against the same stable identifier, so reopening the file restores them.",
        ],
      },
      {
        heading: "Reading it out loud",
        body: [
          "Read-aloud does not speak the raw text content. It walks the rendered text spans, builds one continuous string while recording where each span landed on the page, then splits that string into sentences and collects the rectangles overlapping each one.",
          "That indirection is what lets the sentence being spoken be highlighted in place while the browser's speech synthesis reads it, and it moves on to the next page by itself when a page runs out.",
        ],
      },
      {
        heading: "Two documents side by side",
        body: [
          "Split view is a shell page that hosts the ordinary viewer twice, in iframes, each told to hide its own toolbar. One shared toolbar at the top drives them through messages.",
          "The routing is the interesting part. Style, meaning the tool, colour, width, opacity and font, is broadcast to every pane, so switching to the highlighter switches it everywhere and the toolbar never lies about one pane while you are working in another. Actions like undo, save, export, OCR and zoom go only to whichever pane has focus. Each pane reports its own document name, page readout and zoom back, and the toolbar mirrors whichever one is active. Commands sent before a pane has finished loading are queued rather than dropped.",
        ],
      },
      {
        heading: "Burning it into a real PDF",
        body: [
          "Export walks the final page order rather than the original one. Inserted blank pages are created first, at the indices they occupy on screen, so the original pages stay where they were and everything lands on the right sheet.",
          "Each annotation type is redrawn using the PDF's own drawing operators: strokes as line segments, the brush varying thickness per point from the pressure recorded while drawing, arrowheads computed from the segment angle, shapes as polygons from a unit-square definition, sticky notes as a filled rectangle with a darker folded corner and wrapped text measured against the embedded font. Images are embedded once each no matter how many times they appear.",
          "Rotation needed care. The library rotates an image about its placement anchor rather than its centre, and screen rotation runs the opposite way to PDF rotation, so the anchor is solved backwards from where the centre has to end up and the angle is negated. Pages with a non-zero rotation are still an honest known limitation, and the export says so in a toast rather than quietly producing a file with the markup in the wrong place.",
        ],
      },
      {
        heading: "Nothing to build, nothing to send",
        body: [
          "There is no bundler, no transpiler and no package manifest. The extension is loaded and run exactly as it is written, and the third-party libraries are unmodified upstream builds sitting in their own directory, which is also what makes it reviewable by a store without the reviewer having to trust a build pipeline.",
          "Packaging is a script that zips only the files the extension needs, writing archive entries with forward slashes so the result unpacks correctly regardless of the operating system it was built on. Rendering, drawing, recognition and export all happen on the device, and the permissions the extension asks for exist to spot a PDF navigation and redirect it, not to watch browsing.",
        ],
      },
    ],

    features: [
      {
        heading: "Opens PDFs automatically",
        body: "Navigate to any PDF link and it loads in the annotator, or drag a local file onto the window.",
      },
      {
        heading: "Drawing tools",
        body: "Pen, a brush that varies with speed, lines, arrows including elbow and curved, rectangles, ellipses and a set of polygon shapes.",
      },
      {
        heading: "Two highlighters",
        body: "One snaps to words through the text layer, one is freehand and works on scans and images.",
      },
      {
        heading: "Text, images and sticky notes",
        body: "Type on the page in three font families, drop in pictures that can be moved, resized and rotated, or leave a folded note.",
      },
      {
        heading: "OCR for scans",
        body: "Recognise a scanned page on demand and get a real selectable text layer over it, cached for next time.",
      },
      {
        heading: "Read aloud",
        body: "Speaks the page and highlights the sentence it is on, carrying on to the next page by itself.",
      },
      {
        heading: "Split view",
        body: "Two PDFs side by side, driven by one shared toolbar that follows whichever pane has focus.",
      },
      {
        heading: "Blank pages",
        body: "Insert an empty page anywhere in the document and draw on it like any other.",
      },
      {
        heading: "Autosave and restore",
        body: "Markup is keyed to the file itself, so it comes back whether the PDF is reopened from the same link or a local copy.",
      },
      {
        heading: "Flattened export",
        body: "Downloads a real PDF with the markup in the page content, readable anywhere and after uninstalling.",
      },
      {
        heading: "Keyboard driven",
        body: "One key per tool, with the usual shortcuts for undo, redo, save and export.",
      },
      {
        heading: "Entirely offline",
        body: "No servers, no accounts and no uploads. Recognition and export run on the device.",
      },
    ],

    decisions: [
      {
        heading: "Replace the viewer instead of drawing over it",
        choice: "Redirect PDF navigations into an extension page built on PDF.js.",
        rationale:
          "The built-in viewer is a closed plugin with no drawing surface and no way to read its layout, so an overlay could never align with the page underneath it. Owning the render is what makes coordinates, text selection and export all knowable.",
      },
      {
        heading: "Redirect before the request, not after",
        choice: "Intercept the navigation, with a header check only as the fallback.",
        rationale:
          "Catching it after the response has arrived means the file has already been downloaded once and is about to be downloaded again by the viewer. The header path still exists because PDFs served without a recognisable extension are common, and it skips anything marked as an attachment so ordinary downloads keep working.",
      },
      {
        heading: "Store geometry in PDF points",
        choice: "The page at scale one, origin top left.",
        rationale:
          "It makes export a single axis flip and nothing else. Storing screen pixels would tie every saved annotation to the zoom level and pixel density it happened to be drawn at, and re-deriving the original position later would be guesswork.",
      },
      {
        heading: "Key saved markup to the file's bytes",
        choice: "A hash of the document as its identifier.",
        rationale:
          "URLs are not identity. The same paper reached from a different link, or saved and reopened locally, is the same document and should carry the same notes, and two unrelated files behind one address should not inherit each other's.",
      },
      {
        heading: "Store the page order, not page numbers",
        choice: "Stable per-page identifiers plus an explicit order.",
        rationale:
          "Blank pages can be inserted mid-document. Anything keyed by position silently shifts every later page's markup down by one the next time the file opens, which is the kind of corruption a user notices long after it happened.",
      },
      {
        heading: "Flatten each highlight layer before compositing",
        choice: "Draw opaque offscreen per colour, then blit once at the group's opacity.",
        rationale:
          "Translucent strokes painted one after another multiply their alpha, so every crossing prints darker than the strokes that made it. A real highlighter does not do that, and neither should this one.",
      },
      {
        heading: "Detect scans from the drawing operations",
        choice: "Read the operator list rather than checking for a text layer.",
        rationale:
          "A text layer is the wrong signal in both directions: a scan with a hidden recognised layer would be missed, and a vector page with outlined text would be misread as a scan. Counting what the page actually draws separates the two cleanly.",
      },
      {
        heading: "Vendor the OCR engine",
        choice: "The engine, its WebAssembly core and its language data ship inside the extension.",
        rationale:
          "Not a preference. The extension's content security policy forbids loading code from a CDN and forbids workers created from blob URLs, so every path has to resolve inside the package. It also means recognition keeps working with no network at all.",
      },
      {
        heading: "Ship source with no build step",
        choice: "Plain unminified JavaScript, third-party libraries as unmodified upstream builds.",
        rationale:
          "An extension asks for broad permissions, so being readable is part of being trustworthy. A reviewer can check what runs without having to reproduce a build, and what ships is exactly what is in the repository.",
      },
      {
        heading: "Build split view out of the viewer itself",
        choice: "Two embedded instances of the same page, driven by messages from a shell.",
        rationale:
          "The alternative is a second rendering path that has to keep pace with the first one forever. Embedding the real viewer means a pane is never a reduced version of the app, and the only new code is the routing that decides whether a command belongs to every pane or just the focused one.",
      },
    ],
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
