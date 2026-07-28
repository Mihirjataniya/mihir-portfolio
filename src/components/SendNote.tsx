"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/data/issue";

/** Composes a mailto: from the form — no backend, no trackers. */
export default function SendNote() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const subject = (data.get("subject") || "A letter to STDOUT").toString();
    const body = [
      (data.get("message") || "").toString(),
      "",
      "— " + (data.get("name") || "").toString(),
      (data.get("email") || "").toString(),
    ].join("\n");

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSent(false), 4000);
  };

  return (
    <>
      <div className="kicker kicker-sm">Send a note</div>

      <form ref={formRef} onSubmit={onSubmit} className="mt-[11px] grid gap-[7px]">
        <div className="grid grid-cols-2 gap-[7px]">
          <input name="name" type="text" placeholder="Name" aria-label="Name" className="field" />
          <input
            name="email"
            type="email"
            placeholder="Email"
            aria-label="Email"
            className="field"
          />
        </div>
        <input
          name="subject"
          type="text"
          placeholder="Subject"
          aria-label="Subject"
          className="field"
        />
        <textarea
          name="message"
          rows={4}
          placeholder="Message"
          aria-label="Message"
          className="field resize-y leading-[1.5]"
        />
        <button
          type="submit"
          className="min-w-[150px] cursor-pointer justify-self-start border border-ink bg-ink px-4 py-[9px] font-mono text-[11.5px] font-medium tracking-[0.14em] text-paper uppercase transition-colors hover:border-accent hover:bg-accent"
        >
          Send
        </button>
      </form>

      {sent ? (
        <div
          role="status"
          className="mt-[9px] font-mono text-[11px] text-accent"
        >
          Opening your mail client&hellip;
        </div>
      ) : null}

      <div className="mt-[9px] font-mono text-[11px] text-ink-mute">
        No spam. No trackers. Just a person.
      </div>
    </>
  );
}
