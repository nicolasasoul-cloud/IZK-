"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL } from "@/config/site";

type Status = "idle" | "sending" | "sent" | "error";

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as {
      name: string;
      email: string;
      message: string;
    };

    if (!FORMSPREE_ENDPOINT) {
      const body = `${data.message}\n\n— ${data.name} (${data.email})`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        `Message from ${data.name}`,
      )}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    setMessage(null);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: form as unknown as FormData,
      });
      if (!res.ok) {
        setStatus("error");
        setMessage("Something went wrong. Try again shortly.");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again shortly.");
    }
  }

  if (status === "sent") {
    return (
      <p className="rounded-lg border border-glow/40 bg-glow/10 px-4 py-3 text-sm text-glow">
        Message sent. IZK will get back to you.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {message && (
        <p className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
          {message}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          name="name"
          placeholder="Name"
          className="rounded-lg border border-foam/20 bg-deep/40 px-4 py-3 text-foam placeholder:text-foam/40 focus:border-glow focus:outline-none"
        />
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          className="rounded-lg border border-foam/20 bg-deep/40 px-4 py-3 text-foam placeholder:text-foam/40 focus:border-glow focus:outline-none"
        />
      </div>
      <textarea
        required
        name="message"
        rows={5}
        placeholder="Commission ideas, questions, anything."
        className="rounded-lg border border-foam/20 bg-deep/40 px-4 py-3 text-foam placeholder:text-foam/40 focus:border-glow focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start rounded-full bg-glow px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-glow-soft disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
