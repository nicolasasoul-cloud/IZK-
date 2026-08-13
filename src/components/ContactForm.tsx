"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage(null);

    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again shortly.");
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
