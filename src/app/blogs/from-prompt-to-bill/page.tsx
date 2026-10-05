import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE, absUrl } from "@/data/site";
import styles from "./post.module.css";

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

const PATH = "/blogs/from-prompt-to-bill";
const TITLE = "From Prompt to Bill: The Life of One LLM Call";
const DEK =
  "One line of code, half a second of waiting, and a bill at the end of the month. What actually happens in between, from tokens to tail latency.";
const PUBLISHED = "2026-10-05";

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
  keywords: "LLM, tokenization, attention, KV cache, sampling, structured output, latency, cost",
  mainEntityOfPage: { "@type": "WebPage", "@id": absUrl(PATH) },
  author: { "@id": absUrl("/#person") },
  publisher: { "@id": absUrl("/#person") },
};

function Note({ children }: { children: React.ReactNode }) {
  return <aside className={styles.note}>{children}</aside>;
}

function Code({ children }: { children: string }) {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
}

export default function FromPromptToBill() {
  return (
    <div className={`${styles.page} ${reading.variable} ${ui.variable}`}>
      <JsonLd data={articleLd} />

      <nav className={styles.top}>
        <Link href="/">&larr; {SITE.author}</Link>
      </nav>

      <article className={styles.article}>
        <header>
          <h1 className={styles.title}>{TITLE}</h1>
          <p className={styles.dek}>{DEK}</p>
          <div className={styles.byline}>
            {SITE.author} &middot; October 5, 2026 &middot; 14 min read
          </div>
        </header>

        <div className={styles.body}>
          <p>A developer writes one line of code.</p>

          <Code>{`client.chat.completions.create(
    model="...",
    messages=[{"role": "user", "content": "..."}],
)`}</Code>

          <p>
            Half a second later, words start appearing. A few seconds later, the answer is
            complete. At the end of the month, a bill arrives.
          </p>
          <p>
            Between that line and that bill, the request is taken apart, read, written, gambled
            on, forced into shape, timed and priced. Every behaviour that looks strange from the
            outside happens somewhere along that path: models that can’t count letters, a first
            word that’s slow to arrive, a <code>temperature=0</code> that still changes its
            answer, a “1-second model” inside a feature that takes five.
          </p>
          <p>This is the story of that one request.</p>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>The model can’t read</h2>

          <p>The model never sees text. It sees numbers.</p>

          <Code>{`"Hello world"  →  [13225, 2375]`}</Code>

          <p>
            Two integers. The model has never seen the letter H. It has seen the number 13225 a
            few billion times.
          </p>
          <p>
            Each of those numbers is a <strong>token</strong>: one entry in a fixed list called
            the <strong>vocabulary</strong>. Modern vocabularies hold around 200,000 entries. The{" "}
            <strong>tokenizer</strong> chops incoming text into pieces from that list and replaces
            each piece with its ID. Only the IDs go to the model.
          </p>
          <p>
            So where did the list come from? Nobody wrote it. An algorithm called{" "}
            <strong>byte-pair encoding (BPE)</strong> built it from a huge pile of text. It starts
            with single bytes. It finds the pair of neighbours that appears most often, merges
            them into a new entry, and repeats. <code>t</code> + <code>h</code> becomes{" "}
            <code>th</code>. <code>th</code> + <code>e</code> becomes <code>the</code>. A space
            plus <code>the</code> becomes <code> the</code>. After 200,000 merges, the vocabulary
            is done.
          </p>
          <p>Common words end up as one token. Rare words stay in pieces.</p>

          <Code>{`"strawberry"  →  ["st", "raw", "berry"]`}</Code>

          <p>
            That one line explains a famous failure. Asked “how many r’s are in strawberry?”, the
            model gets three numbers and no letters. It has to remember the spelling of token{" "}
            <code>berry</code>. It isn’t looking. It’s recalling.
          </p>

          <Note>
            The same sentence costs a different number of tokens in different languages, and the
            gap depends on the tokenizer, not the language. Measure; never assume.
          </Note>

          <p>Now the request is a list of numbers. Time to read it.</p>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>Reading everything at once</h2>

          <p>
            The model takes the full list of token IDs and processes all of them together. This
            first phase is called <strong>prefill</strong>.
          </p>
          <p>Its main job is one problem. Consider:</p>

          <Code>{`the animal did not cross the street because it was too tired
the animal did not cross the street because it was too wide`}</Code>

          <p>
            In the first sentence, “it” is the animal. In the second, it’s the street. Same word,
            same position. The only difference is a word several positions later.
          </p>
          <p>
            So each token needs a way to pull in information from the other tokens around it.
            That mechanism is <strong>attention</strong>.
          </p>
          <p>
            Run the first sentence through a real model and look at where <code>it</code> puts
            its focus:
          </p>

          <Code>{`tired    0.090  ##########
animal   0.078  #########
because  0.076  #########
street   0.049  #####`}</Code>

          <p>
            Every token gets a weight, and the weights sum to 1. The model builds a new version of{" "}
            <code>it</code> by mixing the other tokens in those proportions. That’s attention:{" "}
            <strong>
              a weighted average over every other token, where the model learned how to choose
              the weights.
            </strong>
          </p>

          <h3>Query, key and value</h3>

          <p>
            How does <code>it</code> decide that <code>animal</code> deserves more weight than{" "}
            <code>street</code>? Every token produces three vectors, and each one answers a
            different question.
          </p>
          <p>
            The <strong>query</strong> answers <em>“what am I looking for?”</em> For{" "}
            <code>it</code>, the query roughly says:{" "}
            <em>I’m a pronoun. I need the noun I refer to, something that can be tired.</em>
          </p>
          <p>
            The <strong>key</strong> answers <em>“what do I offer?”</em> Every other token puts
            one up.
          </p>

          <Code>{`animal  →  "I'm a noun. A living thing."
street  →  "I'm a noun. A place."
tired   →  "I'm a state a living thing can be in."`}</Code>

          <p>
            The model compares the query of <code>it</code> against every key. A close match
            gives a high score, so <code>animal</code> scores higher than <code>street</code>.
            Those scores become the weights you saw above.
          </p>
          <p>
            The <strong>value</strong> answers <em>“if you pick me, what do I hand over?”</em> For{" "}
            <code>animal</code>, that’s its meaning: a creature, the subject of the sentence. The
            weights decide <strong>how much</strong> of each value flows into <code>it</code>.
            After the mix, <code>it</code> carries information about the animal.
          </p>

          <Code>{`query of "it"  ·  key of each token
      →  scores
      →  weights
      →  weighted mix of values`}</Code>

          <p>
            Query and key decide <em>how much</em>. Value decides <em>what</em>.
          </p>
          <p>
            The sentences in quotes are human translations. In the model, each query, key and
            value is a list of learned numbers, not words. A model also runs many of these
            comparisons side by side, called <strong>attention heads</strong>, each learning to
            look for something different: one for pronouns, one for verbs, one for position.
          </p>

          <Note>
            The original paper is Vaswani et al.,{" "}
            <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">
              <em>Attention Is All You Need</em>
            </a>{" "}
            (2017). For a visual walkthrough first, Jay Alammar’s{" "}
            <a
              href="https://jalammar.github.io/illustrated-transformer/"
              target="_blank"
              rel="noreferrer"
            >
              <em>The Illustrated Transformer</em>
            </a>{" "}
            is the standard companion.
          </Note>

          <h3>The catch</h3>

          <p>
            Every token compares itself with every other token. So the work grows with the{" "}
            <strong>square</strong> of the prompt length.
          </p>

          <Code>{`   100 tokens  →         10,000 pairs
 1,000 tokens  →      1,000,000 pairs
10,000 tokens  →    100,000,000 pairs`}</Code>

          <p>
            Double the prompt, quadruple the attention work. This one fact is why context windows
            stayed small for years, and why retrieval (RAG) exists at all.
          </p>
          <p>
            Prefill is <strong>compute-bound</strong>. Thousands of tokens are processed in
            parallel, and the GPU’s maths units are the limit. All of it has to finish before the
            first output word can exist. So prefill decides how long a user waits before anything
            appears. That wait is called <strong>time to first token (TTFT)</strong>, and it comes
            back later when we talk about latency.
          </p>

          <Note>
            The compute grows quadratically, but the bill does not. Providers charge a flat price
            per token.
          </Note>

          <p>The prompt has been read. Now the model has to say something.</p>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>One word at a time</h2>

          <p>
            Once prefill is done, the model moves to its second phase: <strong>decode</strong>.
            This is where the answer gets written.
          </p>
          <p>
            It produces the first token, adds it to the input, then runs again to produce the
            next token. This continues until the response is complete. Writing one token at a
            time, each one fed back in as input, is called{" "}
            <strong>autoregressive generation</strong>.
          </p>
          <p>
            Running the full attention calculation again for every earlier token, each time, would
            be wasteful. The earlier tokens haven’t changed, so their keys and values are still
            the same. The model keeps those keys and values in memory, in what’s called the{" "}
            <strong>KV cache</strong>. When a new token arrives, the model only calculates the new
            token’s attention against the cached keys and values. Nothing is recalculated from
            scratch.
          </p>
          <p>This makes decode cheap in maths. It also makes it slow in a different way.</p>
          <p>
            To produce a single token, the GPU has to read every weight of the model from memory.
            For a 27-billion-parameter model at 16-bit precision, that’s roughly 54 GB of reading
            for one token’s worth of maths. The maths finishes almost instantly. The reading is
            the bottleneck. Decode is <strong>memory-bandwidth-bound</strong>.
          </p>
          <p>
            And because tokens come out one by one, decode time grows with how much the model
            writes.
          </p>


          <p>That leaves every request with two separate waits.</p>
          <p>
            The first is the wait for the <strong>first word</strong>. That’s prefill, so it grows
            with the length of the prompt.
          </p>
          <p>
            The second is the wait for the <strong>last word</strong>. That’s decode, so it grows
            with the length of the answer.
          </p>
          <p>
            So if the first word is slow to appear, shorten the prompt. If the answer takes too
            long to finish, shorten the output. Same request, two different problems, two
            different fixes.
          </p>

          <Note>
            Some models, called <strong>reasoning models</strong>, write a hidden chain of
            reasoning before the actual answer. Those extra tokens are{" "}
            <strong>thinking tokens</strong>. Every token gets the same fixed amount of compute,
            so more tokens means more compute spent on the problem. The reasoning also stays in
            the context, so attention can look back at it while writing the answer, like a
            scratchpad. The catch: thinking tokens are produced during decode. They add time, and
            they’re billed as output.
          </Note>

          <p>But “produce one token” hides a decision. Which token?</p>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>A roll of the dice</h2>

          <p>Decode produces one token at a time. But the model never writes a token directly.</p>
          <p>
            Remember the vocabulary, the list of ~200,000 tokens? At every step, the model gives{" "}
            <strong>every one of them</strong> a score. Those raw scores are called{" "}
            <strong>logits</strong>.
          </p>

          <Code>{`sunny     4.2
nice      3.9
cold      3.1
purple   -1.2
...and ~200,000 more`}</Code>

          <p>
            Logits aren’t probabilities. They can be negative, and they don’t add up to anything.
            A function called <strong>softmax</strong> turns them into probabilities that add up
            to exactly 1:
          </p>

          <Code>{`sunny  41.2%
nice   30.5%
cold   13.7%`}</Code>

          <p>
            Then one token is picked from that distribution.{" "}
            <strong>
              This whole process of picking one token out of the entire vocabulary is called
              sampling.
            </strong>
          </p>

          <h3>What temperature really does</h3>

          <p>
            People often describe <strong>temperature</strong> as a “creativity” setting. It
            isn’t. The model has no creativity dial. Temperature changes how the probabilities are
            spread out before the pick, and the whole mechanism is one division:
          </p>

          <Code>{`probs = softmax(logits / temperature)`}</Code>

          <Code>{`temperature 0.1   →  sunny 95.3%   nice  4.7%
temperature 1.0   →  sunny 41.2%   nice 30.5%
temperature 2.0   →  sunny 28.7%   nice 24.7%`}</Code>

          <p>
            With a low temperature, the token sitting at the top with the highest probability
            almost always gets picked. With a high temperature, everything flattens toward equal,
            and more options get a fair chance of being picked.
          </p>
          <p>
            So “creativity” isn’t something the model has. It comes from how much randomness we
            allow when choosing the next token.
          </p>

          <h3>Cutting the list: top-k and top-p</h3>

          <p>
            Even after temperature, the distribution still covers all ~200,000 tokens. Most have
            tiny probabilities, but tiny isn’t zero. Generate enough tokens and one of those junk
            tokens eventually gets picked. So before the pick, the candidate list is usually
            trimmed.
          </p>
          <p>
            <strong>top-k</strong> keeps only the k most likely tokens and throws away the rest.
            With <code>top_k = 3</code>:
          </p>

          <Code>{`sunny 48.2%   nice 35.7%   cold 16.1%

← the 3 survivors, rescaled to add up to 100%`}</Code>

          <p>
            <strong>top-p</strong>, also called <strong>nucleus sampling</strong>, keeps the
            smallest group of tokens whose probabilities add up to p. With{" "}
            <code>top_p = 0.9</code>:
          </p>

          <Code>{`sunny 41.2%   running total  41.2%
nice  30.5%                  71.7%
cold  13.7%                  85.4%
warm  10.1%                  95.5%   ← crossed 90%

stop here: 4 tokens kept`}</Code>

          <p>
            The difference shows up when the model’s confidence changes. When the model is 99%
            sure, top-p keeps one token, but top-k still lets in k. When the model is torn between
            many options, top-p keeps many, but top-k still caps at k.{" "}
            <strong>top-p adapts to the model’s confidence; top-k can’t.</strong> That’s why top-p
            is the more common choice.
          </p>

          <h3>Temperature 0 isn’t deterministic</h3>

          <p>
            At <code>temperature=0</code>, providers skip sampling entirely and take the single
            highest logit. This is <strong>greedy decoding</strong>. No randomness is involved.
          </p>
          <p>And yet the same prompt still returns different answers. Here’s why:</p>

          <Code>{`sunny  4.20013
nice   4.20011     → greedy picks "sunny"

sunny  4.20009     ← nudged by 0.00004 of floating-point noise
nice   4.20011     → greedy picks "nice"`}</Code>

          <p>
            Sampling didn’t change. <strong>The inputs to the pick wobbled.</strong> GPUs add
            numbers in different orders depending on how a request is batched with other users’
            requests. Floating-point addition isn’t associative, so the order changes the last
            digits. Mixture-of-experts routing and silent model updates add more. Because
            generation is autoregressive, one flipped token changes everything after it.
          </p>

          <p>Every token is a probability draw. So how does anyone get reliable output from this?</p>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>Getting the response according to our requirements</h2>

          <p>
            Imagine your code can only accept JSON. Not prose, not “Sure! Here’s your JSON:”, just
            a JSON object that parses every time. How do you make a probability machine produce
            that?
          </p>
          <p>There are four ways, from weakest to strongest.</p>
          <p>
            <strong>1. Ask nicely.</strong> Put “respond in JSON” in the prompt. The model usually
            complies, and that’s the problem: usually.
          </p>


          <p>
            <strong>2. JSON mode.</strong> Providers now offer a JSON mode you switch on in the
            request. It guarantees the response is valid JSON. It does <strong>not</strong>{" "}
            guarantee it’s the JSON you wanted. Keys can be missing, renamed, or the wrong type.
          </p>
          <p>
            <strong>3. Structured output.</strong> This one guarantees the exact shape. You give
            the provider a <strong>JSON Schema</strong>, a description of exactly which keys you
            want and what type each one is. In Python it’s usually generated from a Pydantic
            class:
          </p>

          <Code>{`class Invoice(BaseModel):
    vendor: str
    amount: float

response_format = {
    "type": "json_schema",
    "json_schema": {
        "name": "invoice",
        "schema": Invoice.model_json_schema(),
        "strict": True,
    },
}`}</Code>

          <p>
            This is where the dice come back. The provider turns the schema into rules about
            what’s allowed to come next at every position. Then, during decode, right before each
            pick, it checks every candidate token against those rules. Any token that would break
            the schema has its probability set to <strong>exactly zero</strong>.
          </p>

          <Code>{`output so far:   {"vendor": "Acme", "amount":

candidate     allowed?
 " 42"          yes    a number can start here
 " \\""          no     amount must be a number, not a string
 " hello"       no     not a number
 "}"            no     amount needs a value first`}</Code>

          <p>
            The model can’t produce invalid output, because invalid tokens are never on the menu.
            This is called <strong>constrained decoding</strong>.
          </p>
          <p>
            <strong>4. Tool calling as extraction.</strong> Define a “tool” whose arguments are
            the fields you want. The model returns a tool call, which is a <em>request</em>, not
            an execution. Nothing runs. The arguments are your data.
          </p>
          <p>
            Even a perfect schema can’t check business rules: totals that must add up, dates that
            must be in the past. Those need a validator in code, and a retry that sends back both
            the invalid output and the error message.
          </p>

          <Note>
            A required field is an instruction to produce a value. Given an invoice with no PO
            number and a schema demanding <code>po_number: str</code>, a model invented{" "}
            <code>PO-2026-0417-001</code>. It was plausible, matched the invoice’s own format,
            passed validation, and didn’t exist. Making the field optional returned{" "}
            <code>None</code>. <strong>Optional fields prevent hallucinated values.</strong>
          </Note>

          <p>
            The output is now shaped and correct. But a user was waiting the whole time. How long
            did it take?
          </p>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>The clock</h2>

          <h3>The numbers teams actually watch</h3>

          <p>In production, LLM latency is measured with two numbers.</p>
          <p>
            <strong>Time to first token (TTFT)</strong> is how long the user waits before the
            first word appears. That’s prefill, plus any waiting in line before it.
          </p>
          <p>
            <strong>Total time</strong>, also called <strong>end-to-end latency</strong>, is how
            long until the last word arrives. That’s TTFT plus all of decode.
          </p>
          <p>
            For a chat feature, TTFT is what users feel. That’s why the single biggest latency
            lever doesn’t make anything faster. <strong>Streaming</strong> shows tokens as they
            arrive. A 10-second answer that starts in half a second feels fast. The same answer
            shown all at once feels broken.
          </p>
          <p>
            For a background job, nobody is watching. Latency barely matters there. What matters
            is <strong>throughput</strong>, how many jobs finish per hour, and cost.
          </p>

          <h3>Latency is a distribution, not a number</h3>

          <p>
            Send the same request 20 times and you get 20 different times. Here’s an example run,
            sorted from fastest to slowest:
          </p>

          <Code>{` #1   0.61s     #6   0.68s    #11   0.75s    #16   0.88s
 #2   0.63s     #7   0.70s    #12   0.77s    #17   0.93s
 #3   0.64s     #8   0.71s    #13   0.79s    #18   1.02s
 #4   0.66s     #9   0.72s    #14   0.81s    #19   1.40s
 #5   0.67s    #10   0.74s    #15   0.84s    #20   3.10s`}</Code>

          <p>
            A <strong>percentile</strong> is read straight off this sorted list. For the p-th
            percentile, take p% of the number of samples and read the value at that position.
          </p>

          <Code>{`p50  →  50% of 20 = position 10                    →  0.74s
p95  →  95% of 20 = position 19                    →  1.40s
p99  →  99% of 20 = 19.8, round up to position 20  →  3.10s`}</Code>

          <p>
            <strong>p50</strong> is the median. Half the requests were faster than 0.74s.{" "}
            <strong>p95</strong> means 95% were faster than 1.40s, and one in twenty was slower.
            The slow end of the list is called <strong>tail latency</strong>, and it’s what users
            remember.
          </p>
          <p>
            Now the average: all 20 added up is 18.05s, divided by 20 is <strong>0.90s</strong>.
            Sixteen of the twenty requests were faster than that. The average describes almost
            nobody. One slow request at 3.10s dragged it up, and it still hides how bad that one
            was.
          </p>

          <Note>
            Look at how p99 was found: it’s the slowest value in the list. With 20 samples, p99 is
            just “the worst one you happened to see”. A trustworthy p99 needs hundreds of samples.
          </Note>

          <h3>Fan-out: why the tail takes over</h3>

          <p>
            Real features almost always make more than one call. A RAG answer might embed,
            retrieve, rerank and generate. An agent might call the model twenty times to finish
            one task.
          </p>
          <p>
            If each individual call has only a 5% (1-in-20) chance of being slow, that sounds
            rare. But when one page or task makes many calls, the chance that{" "}
            <strong>at least one</strong> is slow becomes much higher.
          </p>
          <p>
            The chance that one call is fast is 0.95. The chance that all n calls are fast is 0.95
            multiplied by itself n times. Everything else is “at least one was slow”.
          </p>
          <p>With 5 calls:</p>
          <p className={styles.formula}>1 − 0.95⁵ ≈ 22.6%</p>
          <p>So roughly 1 in 4 pages hits at least one slow call.</p>
          <p>With an agent making 20 calls:</p>
          <p className={styles.formula}>1 − 0.95²⁰ ≈ 64%</p>
          <p>So most agent tasks, about 64%, hit at least one slow call.</p>
          <p>
            That’s <strong>fan-out</strong>: one user action depends on many downstream calls, so
            even rare slowdowns compound. It’s why the median can mislead. Your typical call might
            be fast, while the slowest calls, the p95 and p99 tail latency, decide how slow the
            whole experience feels. That’s why teams put p95 and p99 on their dashboards, not the
            median.
          </p>

          <h3>The critical path</h3>

          <p>
            When a feature makes several calls, some depend on each other and some don’t. Calls
            that don’t depend on each other shouldn’t wait on each other.
          </p>

          <Code>{`three calls, one after another          1.90s
call 1, then calls 2 and 3 together     1.16s   (39% faster)`}</Code>

          <p>
            The <strong>critical path</strong> is the longest chain of steps that has to happen in
            order. Only shortening that chain makes the whole thing faster. Speeding up anything
            off that chain changes nothing the user can feel.
          </p>

          <h3>The latency budget</h3>

          <p>
            A feature isn’t one call. It’s a chain of steps, and the LLM is only one of them. So
            when someone says “the feature is slow”, the first question is: which step?
          </p>
          <p>
            A <strong>latency budget</strong> answers that before it becomes a problem. The team
            first decides the total wait users will accept. Then they split that total across
            every step, and hold each step to its share. For a chat reply that should start within
            two seconds:
          </p>

          <Code>{`embed the question           150 ms
vector search                100 ms
rerank                       250 ms
LLM time to first token    1,200 ms
network + app                300 ms
-----------------------------------
                           2,000 ms`}</Code>

          <p>
            When the feature gets slow, the budget shows which step went over. When someone wants
            to add a step, the budget shows what it has to take time from.
          </p>
          <p>
            The LLM is one line in that table. In a real system, DNS lookups, TLS handshakes, cold
            starts, database queries and queueing behind other requests all claim their share
            too.
          </p>

          <Note>
            <strong>Retries and queueing hide inside latency numbers.</strong> When a provider
            rate-limits a call, the SDK often waits and retries silently, and all of that waiting
            gets counted as “time to first token”. Log retries next to every timing.
          </Note>

          <p>
            The response arrived, and now we know how long it took. One question is left: what did
            it cost?
          </p>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>The bill</h2>

          <p>Latency is what users feel. Cost is what the company feels.</p>
          <p>
            LLM providers charge per token, with separate prices for input tokens (what you send)
            and output tokens (what the model writes). Prices are quoted per million tokens, and
            output is usually several times more expensive than input.
          </p>
          <p>
            Before building a feature, teams estimate what it will cost to run each month. The
            estimate is built from five things: how many requests the feature gets, how many LLM
            calls each request makes, how often calls fail and get retried, how many tokens go in
            and out per call, and the price of those tokens.
          </p>

          <Code>{`monthly LLM cost of a feature
  = requests per day
  × LLM calls per request
  × (1 + retry rate)
  × 30 days
  × (input tokens × input price + output tokens × output price)`}</Code>

          <p>
            Two inputs get forgotten most: <strong>calls per request</strong> (it’s rarely one)
            and the <strong>retry rate</strong> (every retry is paid for again).
          </p>
          <p>
            An example: a support-reply feature. It gets 20,000 requests a day, makes two calls
            each, sends 2,500 input tokens, gets 400 output tokens, retries 5% of calls, and uses a
            model priced at $2 per million input tokens and $10 per million output tokens.
          </p>

          <Code>{`calls per month    20,000 × 2 × 1.05 × 30          = 1,260,000
cost per call      2,500 × $2/1M + 400 × $10/1M    = $0.009
monthly cost       1,260,000 × $0.009              = $11,340`}</Code>

          <p>
            Most of those 2,500 input tokens are the same in every request: the system prompt, the
            instructions, the examples. <strong>Prompt caching</strong> stores the prefill work for
            that fixed beginning of the prompt, and cached input is billed at about a tenth of the
            price. If 80% of the input is cacheable, the bill drops to <strong>$6,804</strong>,
            which is 40% less.
          </p>
          <p>
            That’s the rare lever that helps both the clock and the bill. Skipping prefill makes
            the first token arrive sooner, and paying a tenth makes the bill smaller. It costs
            nothing in quality.
          </p>

          <Note>
            The <strong>batch API</strong> is half price with zero quality loss, but results
            arrive within 24 hours. It’s perfect for nightly jobs and useless for chat.
          </Note>
          <Note>
            Price per token is the wrong final metric.{" "}
            <strong>Cost per successful outcome</strong> is the right one. A model at half the
            price that fails 40% of the time, where each failure costs a $0.50 human review, ends
            up about three times more expensive per resolved ticket.
          </Note>

          <hr />

          {/* ------------------------------------------------------------ */}
          <h2>The whole journey</h2>

          <Code>{`tokenizer   text → token IDs
prefill     attention over the whole prompt     sets TTFT
decode      one token at a time, KV cache       sets total time
sampling    logits → softmax → temperature → top-p → pick
constraint  schema zeroes out invalid tokens
the bill    tokens × price × calls × retries, felt at p95`}</Code>

          <p>
            Every strange behaviour on the outside has a home somewhere on the inside. The model
            can’t count letters because it never saw letters, only numbers. Long prompts are slow
            to start because every token had to look at every other token first. Long answers are
            slow to finish because the words come out one at a time. <code>temperature=0</code>{" "}
            wobbles because the dice were never the only source of chance. A schema can’t stop a
            made-up PO number, but an optional field can, because a required field is an order to
            produce something. And a fast model makes a slow feature because users don’t live at
            the median.
          </p>
          <p>
            Knowing where along the path a problem lives is most of the work of fixing it.
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
