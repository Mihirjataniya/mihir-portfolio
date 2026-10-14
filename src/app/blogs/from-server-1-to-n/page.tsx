import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { formatPostDate, getPost } from "@/data/blogs";
import { SITE, absUrl } from "@/data/site";
import styles from "../post.module.css";

// Reading fonts are scoped to this page, so the rest of the site keeps its press type.
const reading = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-reading",
  display: "swap",
});

const ui = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ui",
  display: "swap",
});

const PATH = "/blogs/from-server-1-to-n";
const post = getPost("from-server-1-to-n");
const TITLE = post.title;
const DEK = post.dek;
const PUBLISHED = post.published;

export const metadata: Metadata = {
  title: TITLE,
  description: DEK,
  alternates: { canonical: PATH },
  openGraph: {
    title: `${TITLE} · ${SITE.author}`,
    description: DEK,
    url: PATH,
    type: "article",
    publishedTime: PUBLISHED,
    authors: [SITE.author],
  },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": absUrl(`${PATH}#article`),
  headline: TITLE,
  description: DEK,
  datePublished: PUBLISHED,
  inLanguage: "en",
  keywords:
    "horizontal scaling, load balancer, sessions, Redis, rate limiting, WebSockets, cron, distributed locks, graceful shutdown",
  mainEntityOfPage: { "@type": "WebPage", "@id": absUrl(PATH) },
  author: { "@id": absUrl("/#person") },
  publisher: { "@id": absUrl("/#person") },
};

function Code({ children }: { children: string }) {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
}

function Question() {
  return (
    <blockquote>
      <p>
        <strong>Does any variable in this process outlive a single request?</strong>
      </p>
    </blockquote>
  );
}

export default function FromServer1ToN() {
  return (
    <div className={`${styles.page} ${reading.variable} ${ui.variable}`}>
      <JsonLd data={articleLd} />

      <nav className={styles.top}>
        <Link href="/blogs">&larr; All posts</Link>
      </nav>

      <article className={styles.article}>
        <header>
          <h1 className={styles.title}>{TITLE}</h1>
          <p className={styles.dek}>{DEK}</p>
          <div className={styles.byline}>
            {SITE.author} &middot; {formatPostDate(PUBLISHED)} &middot; {post.readMinutes} min read
          </div>
        </header>

        <div className={styles.body}>
          <p>
            You are at a startup. Small team, no senior engineer above you, and you own more of
            the system than your job title suggests. You wrote the auth, you wrote the upload
            endpoint, you set up the cron job. It all works.
          </p>
          <p>
            Then the product gets picked up somewhere, and traffic does the thing traffic does.
          </p>
          <p>
            Yesterday your single box sat at 30–40% CPU and you never thought about it. Today p99
            latency has gone from 80 ms to four seconds, the event loop is saturated, and requests
            are queueing somewhere you cannot see. Nobody is going to rewrite anything this week.
            So the team makes the obvious call, the correct call, the one any engineer would make:
          </p>
          <p>
            <strong>add a second server and put a load balancer in front of it.</strong>
          </p>
          <p>
            You spin up an identical instance, point an nginx upstream at both with round-robin,
            and deploy. Capacity doubles. CPU drops. Latency comes back down.
          </p>
          <p>And then the weird stuff starts.</p>
          <p>
            Users report being randomly logged out. Someone’s avatar upload works, then 404s, then
            works again. A customer emails to ask why they received the same digest email five
            times. Your rate limiter, configured for 100 requests a minute, is letting someone
            through at 300. None of it appears in Sentry. None of it appears in your logs. Every
            health check is green.
          </p>
          <p>
            Nothing is broken. Everything is working exactly as written. The code just made an
            assumption that stopped being true the moment there were two servers.
          </p>
          <p>Here is the one question that finds all of it:</p>

          <Question />

          <p>
            A variable created inside a handler and thrown away when the response is sent is
            fine. That is just work. A variable at module scope, or attached to the app, or
            captured in a closure, that still holds something after the response has gone out is{" "}
            <strong>state living on one specific machine</strong>, and it is about to become a
            bug.
          </p>
          <p>Nine places it hides.</p>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>1. Sessions in memory</h2>

          <p>
            The default session store in most frameworks is memory. <code>express-session</code>{" "}
            without a <code>store</code> option will even warn you about it in the console, and
            everybody ignores the warning because it works.
          </p>

          <Code>{`app.use(session({ secret: process.env.SECRET }))   // MemoryStore`}</Code>

          <p>
            Server A creates the session. The next request lands on Server B, which has never
            heard of that session ID, so the user is anonymous again.
          </p>
          <p>
            How often depends on how your balancer distributes work. With round-robin it is
            roughly every other <strong>connection</strong>. Browsers reuse a connection for many
            requests via keep-alive, so it does not alternate cleanly request by request. It shows
            up as the session working fine for a while and then vanishing when a new connection is
            opened. From the user’s side that is worse than a clean 50/50, because it looks random
            and they cannot describe it to you.
          </p>
          <p>
            <strong>Fix:</strong> move sessions to a store every server can reach. Redis, with the
            session ID still in an <code>httpOnly; Secure; SameSite=Lax</code> cookie and the
            session data in Redis under that key. Three lines of config.
          </p>
          <p>
            <strong>And do not reach for sticky sessions instead.</strong> Pinning each user to
            one server makes the symptom go away and keeps the actual problem. Now that server
            holds state nobody else has, so you cannot restart it without logging those users out.
            Which means you cannot deploy without logging those users out. You have traded a bug
            for a permanent constraint on how you ship code.
          </p>

          {/* ------------------------------------------------------------ */}
          <h2>2. In-memory caches</h2>

          <Code>{`const cache = new Map()

app.get('/products/:id', async (req, res) => {
  if (cache.has(req.params.id)) return res.json(cache.get(req.params.id))
  const p = await db.products.findById(req.params.id)
  cache.set(req.params.id, p)
  res.json(p)
})`}</Code>

          <p>
            Two servers, two caches, each filled by whichever requests happened to land there.
            They will disagree. Marketing changes a price and for a while Server A serves the new
            one and Server B serves the old one.
          </p>
          <p>
            <strong>This one is usually fine, and that is the point of including it.</strong>{" "}
            Sixty seconds of a stale price is annoying, rarely fatal. Coordinating caches across
            servers costs far more than the inconsistency does, so the right move is to accept the
            divergence and put a bound on it:
          </p>

          <Code>{`const cache = new Map()   // value: { data, expiresAt }
const TTL = 60_000        // 60s of worst-case disagreement, by design`}</Code>

          <p>
            A TTL converts “inconsistent, unknown duration” into “inconsistent, at most 60
            seconds.” That is a design decision you can defend in a review.
          </p>
          <p>
            <strong>It stops being fine when the cache is authoritative:</strong> the only copy,
            or one where being wrong has consequences. A cached permission check returning{" "}
            <em>yes</em> after access was revoked is not an inconsistency. It is a security hole.
            If the cache is the only source of truth, it is not a cache. It is your database, and
            it is in RAM on one machine.
          </p>

          {/* ------------------------------------------------------------ */}
          <h2>3. Rate limiters and counters</h2>

          <p>
            My favourite, because the arithmetic is a single line and most people have this bug
            right now.
          </p>

          <Code>{`const hits = new Map()   // userId -> count

function limit(req, res, next) {
  const n = (hits.get(req.user.id) || 0) + 1
  hits.set(req.user.id, n)
  if (n > 100) return res.status(429).send('Too many requests')
  next()
}`}</Code>

          <p>One server: 100 requests a minute. Correct.</p>
          <p>
            Three servers behind round-robin: each sees a third of the traffic and each
            independently allows 100 before it starts rejecting.
          </p>

          <Code>{`3 servers × 100 each = 300 requests per minute`}</Code>

          <p>
            <strong>Your limit is now 300.</strong> You did not loosen it. You tripled it,
            silently, by deploying. Generalised:{" "}
            <strong>an in-memory limit of L on N servers is really N × L.</strong> It gets worse
            under autoscaling, because N changes through the day. The effective limit at 3 a.m. is
            not the one at peak.
          </p>
          <p>
            And nothing errors. Nothing logs. The feature simply stops doing its job, and you find
            out when somebody abuses it.
          </p>
          <p>
            <strong>Fix:</strong> one shared counter with an atomic increment.
          </p>

          <Code>{`const n = await redis.incr(key)
if (n === 1) await redis.expire(key, 60)
if (n > 100) return res.status(429).send('Too many requests')`}</Code>

          <p>
            <code>INCR</code> is atomic because Redis executes commands one at a time, so two
            servers incrementing the same key cannot interleave and lose a count. One counter, all
            servers, correct limit.
          </p>

          {/* ------------------------------------------------------------ */}
          <h2>4. Files on local disk</h2>

          <Code>{`app.post('/avatar', upload.single('file'), (req, res) => {
  // multer just wrote this to ./uploads/ on THIS machine
  res.json({ url: \`/uploads/\${req.file.filename}\` })
})`}</Code>

          <p>
            The upload succeeds. The user reloads, the request lands on the other server, and the
            image 404s <strong>about half the time, at random</strong>, which is the hardest kind
            of bug to get a reproduction for.
          </p>
          <p>
            Then it gets worse. On the next deploy the container is replaced, and container
            filesystems do not survive that. The file is not misplaced. It is gone.
          </p>
          <p>
            <strong>Fix:</strong> object storage, S3 or equivalent. Your servers upload to it and
            store the returned key in your database. Nothing durable ever lives on a machine you
            are willing to terminate.
          </p>

          {/* ------------------------------------------------------------ */}
          <h2>5. WebSocket and SSE connections</h2>

          <p>
            A WebSocket is a long-lived TCP connection to <strong>one specific process</strong>.
          </p>

          <Code>{`user A ── ws ──► Server 1      Server 2 ◄── ws ── user B
                    │               ▲
                    └───── ? ───────┘
                      no path exists`}</Code>

          <p>
            User A is connected to Server 1, user B to Server 2. A sends B a message. Server 1 does
            not hold B’s socket and has no way to reach it.
          </p>
          <p>
            <strong>This is the one item you cannot fix by moving data</strong>, because the
            connection <em>is</em> the state and a TCP connection cannot be shared between
            processes.
          </p>
          <p>
            <strong>Fix:</strong> keep the connection local and move the <em>messaging</em>.
            Server 1 publishes the message to a Redis pub/sub channel, every server subscribes,
            Server 2 receives it and writes to B’s socket. Socket.IO’s Redis adapter is exactly
            this and is about five lines to wire up.
          </p>

          {/* ------------------------------------------------------------ */}
          <h2>6. Scheduled jobs</h2>

          <Code>{`cron.schedule('0 0 * * *', sendDailyDigest)   // midnight`}</Code>

          <p>
            One server: sent once. Five servers: <strong>every server runs it</strong>, and every
            customer gets five identical emails at midnight.
          </p>
          <p>
            This is the most dangerous item on the list, for a reason that has nothing to do with
            the code. It passes every test you have, because you test on one machine and on one
            machine it is perfect. It fails the first night after you scale, at midnight, to your
            entire customer base at once, while you are asleep. And the damage is reputational
            rather than technical, so no alert fires.
          </p>
          <p>
            <strong>Fix, in order of preference:</strong>
          </p>
          <ol>
            <li>
              Take the scheduler out of the application. A single-instance worker, or your
              platform’s scheduler hitting one endpoint.
            </li>
            <li>
              If it must live in the app, make the instances race for a lock and let the losers
              skip:
            </li>
          </ol>

          <Code>{`const won = await redis.set('job:digest', instanceId, 'NX', 'EX', 300)
if (!won) return                  // another instance is doing it
await sendDailyDigest()`}</Code>

          <p>
            <code>NX</code> means “only set if absent”, so exactly one instance wins.{" "}
            <code>EX</code> matters too. Without an expiry, one crash leaves the lock held forever
            and the job never runs again.
          </p>
          <p>
            <strong>Be honest about what this is.</strong> It is good enough to stop five
            instances sending five emails, which is the problem we have. It is{" "}
            <strong>not</strong> a correct mutual-exclusion lock. If the winning instance pauses
            for longer than the TTL, say a long GC pause or a hung network call, the key expires,
            another instance acquires it, and both run. For a digest email that is an acceptable
            risk you have chosen. For anything where double execution is genuinely unacceptable,
            you need either a fencing token or, better, to make the operation idempotent so
            running it twice does not matter.
          </p>

          {/* ------------------------------------------------------------ */}
          <h2>7. In-process locks</h2>

          <Code>{`let processing = false

async function handle() {
  if (processing) return
  processing = true
  try { await doTheThing() } finally { processing = false }
}`}</Code>

          <p>
            This genuinely prevents concurrent execution <strong>inside one process</strong>. Five
            servers means five independent flags and up to five concurrent executions.
          </p>
          <p>
            The lock does not fail loudly. It just stops being a lock, and whatever race you wrote
            it to prevent comes back, now in production, now intermittent.
          </p>
          <p>
            <strong>Fix:</strong> a distributed lock in Redis. But better, where you can: make the
            operation safe to run concurrently so it needs no lock at all. A conditional update
            does this for free, because the database decides the winner atomically:
          </p>

          <Code>{`UPDATE orders SET status = 'processing'
WHERE id = $1 AND status = 'pending'`}</Code>

          <p>
            If two servers run that simultaneously, one of them updates a row and the other
            updates zero rows. Check the affected-row count and the loser simply stops. No lock,
            no coordination, no lock expiry to get wrong.
          </p>

          {/* ------------------------------------------------------------ */}
          <h2>
            8. <code>setInterval</code> and in-memory queues
          </h2>

          <Code>{`const pending = []
setInterval(() => flush(pending), 5000)   // batch writes every 5s`}</Code>

          <p>
            First, why anyone writes this, because the pattern is not stupid. Every database round
            trip costs half a millisecond to a millisecond. A thousand <code>INSERT</code>s is a
            thousand round trips; batched, it is one. Buffering and flushing every five seconds is
            a real optimisation and it works.
          </p>
          <p>
            Then the process dies with items still in the array. They are gone. No error, no log,
            no trace. The user’s action was accepted with a <code>200</code> and silently
            discarded.
          </p>
          <p>Put a number on it:</p>

          <Code>{`200 events/s × 5 s buffer      =  1,000 items at risk per instance
3 instances, rolling restart   =  3,000 items lost per deploy
deploying 10 times a week      =  30,000 items a week, silently`}</Code>

          <p>
            On one server you restarted weekly and never noticed. Now rolling restarts feel safe so
            you ship far more often, and the buffer is per process, so N instances means N lossy
            buffers and nothing that knows what was dropped.
          </p>
          <p>The obvious fix is to flush on shutdown. It has two sharp edges.</p>
          <p>
            <strong>You have to wait for it.</strong> This is what people write:
          </p>

          <Code>{`process.on('SIGTERM', () => {
  flush(pending)        // returns a promise that nobody awaits
  process.exit(0)       // process is gone before the write lands
})`}</Code>

          <p>
            <code>process.exit()</code> does not wait for pending work. You wrote a flush handler,
            watched it run, and still lost the data. The working version:
          </p>

          <Code>{`process.on('SIGTERM', async () => {
  try { await flush(pending) } finally { process.exit(0) }
})`}</Code>

          <p>
            <strong>
              And you only get <code>SIGTERM</code> sometimes.
            </strong>{" "}
            Not from the OOM killer, <code>docker kill</code>, Kubernetes escalating to{" "}
            <code>SIGKILL</code> after the grace period, a reclaimed spot instance, or a crash.{" "}
            <code>SIGKILL</code> cannot be caught. The handler reduces losses; it does not remove
            them.
          </p>
          <p>
            Learn the shape, because it wears several costumes: an in-memory job array with a
            worker loop, a debounced save, a <code>setTimeout</code> retrying a webhook in thirty
            seconds, an outbox of unshipped events.{" "}
            <strong>
              If the only record of the work lives in a variable, the work dies with the process.
            </strong>
          </p>
          <p>
            <strong>Fixes, in the order I would try them:</strong>
          </p>
          <ol>
            <li>
              <strong>Write through immediately and batch at the database.</strong> Multi-row{" "}
              <code>INSERT</code>, <code>COPY</code>, or group commit. Costs a little throughput
              and the problem disappears instead of shrinking.
            </li>
            <li>
              <strong>Use a durable queue.</strong> SQS, Redis Streams, BullMQ. The item is
              persisted on arrival, so a dead process loses nothing. Redis is only as durable as
              its persistence config, so check it.
            </li>
            <li>
              <strong>If the buffer stays, bound the loss deliberately.</strong> Cap its size,
              flush on count as well as timer, <code>await</code> on <code>SIGTERM</code>, and
              write down what you accept losing.
            </li>
          </ol>
          <p>
            Be honest about which case you are in. Losing five seconds of analytics pageviews is
            fine and worth saying out loud instead of engineering around. Losing five seconds of
            “your order has been placed” is not, and no buffer size makes it so.
          </p>

          {/* ------------------------------------------------------------ */}
          <h2>9. Self-incremented metrics</h2>

          <Code>{`let requestCount = 0
app.use((req, res, next) => { requestCount++; next() })`}</Code>

          <p>
            Five servers each report their own count, so unless something sums across instances
            your dashboard shows a fifth of the truth.
          </p>
          <p>
            Usually a monitoring bug rather than a user-facing one, which sounds harmless until you
            notice what it means:{" "}
            <strong>your numbers are wrong at exactly the moment you need them to be right.</strong>{" "}
            You scale out because of a traffic spike, and the act of scaling out breaks the graph
            you are using to decide whether scaling out worked.
          </p>
          <p>
            <strong>Fix:</strong> export per-instance counters and aggregate in your metrics
            backend. Prometheus and friends are built for this. Never add up application-level
            counters by hand.
          </p>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>The pattern</h2>

          <p>Read the nine together and they are all the same bug.</p>
          <p>
            Your code assumed <strong>one process, one memory space, forever</strong>. That
            assumption is free on one server and silently false on two. Nothing throws, because
            from the code’s point of view nothing went wrong. The variable really was set, the file
            really was written, the flag really was flipped. It just happened on a machine that
            this request did not land on.
          </p>
          <p>
            Which is why your error tracker is quiet. There is no error. There is a wrong answer.
          </p>
          <p>So before you add that second server, grep for the question:</p>

          <Question />

          <p>
            Every hit is either something to move, or something to consciously decide to leave
            alone. Both are fine. What is not fine is not having looked.
          </p>

          {/* ------------------------------------------------------------ */}
          <h2>The bare minimum before you scale out</h2>

          <p>
            The nine above are the state audit. These are the four things to have alongside them,
            because having two servers is only half the job. The other half is being able to lose
            one.
          </p>
          <p>
            <strong>Health checks, and two of them.</strong> <code>/live</code> answers “is this
            process alive” and touches nothing. <code>/ready</code> answers “can this instance
            serve traffic right now” and may check things that are true of <em>this</em> instance:
            its connection pool, its shutdown flag. It must <strong>not</strong> check shared
            dependencies like your database or Redis. If <code>/ready</code> pings Redis, a
            two-second Redis blip fails every server’s health check inside one interval, your load
            balancer has zero healthy backends, and a degraded feature becomes a total outage.
          </p>
          <p>
            <strong>Graceful shutdown, in the right order.</strong> On <code>SIGTERM</code>: fail{" "}
            <code>/ready</code>, then <strong>keep serving normally</strong> for however long your
            load balancer takes to notice (interval × unhealthy threshold, often 10–30 seconds),{" "}
            <em>then</em> stop accepting connections, <em>then</em> drain in-flight requests,{" "}
            <em>then</em> exit. Skip the waiting step and the balancer routes live traffic at a
            closed socket for the length of its detection window.
          </p>
          <p>
            <strong>Sticky sessions off, deliberately.</strong> Once sessions are in Redis you do
            not need them, and leaving them on quietly reintroduces item 1.
          </p>
          <p>
            <strong>Trust your proxy by hop count, not by <code>true</code>.</strong> Behind a
            load balancer every request appears to come from the balancer’s IP, so your rate
            limiter sees one client. The fix is <code>X-Forwarded-For</code>, but that header is
            client-settable, and <code>app.set(&apos;trust proxy&apos;, true)</code> means “trust
            every hop”, which makes Express read the leftmost entry, the one the attacker
            controls. Set it to the number of proxies you actually own:
          </p>

          <Code>{`app.set('trust proxy', 1)   // one proxy in front of us`}</Code>

          <p>
            Now it counts one hop in from the right and takes the address your balancer actually
            observed. Trust exactly as many hops as you control, counted from the right, and never
            one more.
          </p>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>One last thing</h2>

          <p>
            Going from one server to two is not a deployment change. It is the point where you
            find out what you actually built, because every assumption about shared memory gets
            tested at once by real users.
          </p>
          <p>
            The good news is that it is a finite list. You are not rearchitecting anything. You are
            moving a handful of variables to places more than one process can see, and writing
            down the one case where you have decided not to.
          </p>
          <p>
            And once you have done it, the next ninety servers are boring. That is the whole
            return on the work.
          </p>
        </div>
      </article>

      <footer className={styles.end}>
        <span>Thanks for reading.</span>
        <Link href="/">Back to {SITE.author}&rsquo;s front page &rarr;</Link>
      </footer>
    </div>
  );
}
