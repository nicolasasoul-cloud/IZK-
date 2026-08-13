import type { Metadata } from "next";
import Whale from "@/components/Whale";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "About | IZK",
  description: "The story behind IZK — a rare, wise whale moving through the world.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <p className="text-sm uppercase tracking-[0.3em] text-glow-soft">About</p>
      <h1 className="font-display mt-3 text-4xl text-foam sm:text-5xl">
        IZK
      </h1>

      <div className="mt-10 flex justify-center">
        <Whale tone="gold" className="w-full max-w-sm" />
      </div>

      <div className="mt-10 space-y-6 text-lg leading-relaxed text-foam/80">
        <p>
          The world is a giant ocean, and IZK moves through it the way a
          whale does — old, intelligent, family-oriented, and a little
          mysterious underneath the calm.
        </p>
        <p>
          Art has been around for as long as anyone can remember, in the
          same way whales have been singing to each other for longer than
          most species have existed. Both are trying to say something that
          doesn&apos;t translate cleanly into ordinary language — and both
          keep trying anyway.
        </p>
        <p>
          There&apos;s a fact about whales that stuck with IZK: when one
          dies, it sinks and becomes the foundation of an entire ecosystem
          on the ocean floor. What looks like an ending becomes the ground
          everything else grows from. That idea — that what sinks feeds
          what rises — sits underneath most of the work here.
        </p>
        <p>
          [Full bio, background, and history to be added.]
        </p>
      </div>

      <div className="mt-20 border-t border-foam/10 pt-16">
        <h2 className="font-display text-2xl text-foam">Get in touch</h2>
        <p className="mt-3 max-w-lg text-foam/70">
          Commissions, press, or just to say hello — send a message and
          IZK will get back to you.
        </p>
        <div className="mt-8 max-w-xl">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
