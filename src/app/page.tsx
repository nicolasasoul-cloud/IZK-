import Link from "next/link";
import SwimmingWhale from "@/components/SwimmingWhale";
import Bubbles from "@/components/Bubbles";

const STORY = [
  {
    title: "The world is an ocean",
    body: "Everything IZK makes starts from one idea: the world is a giant ocean, and he moves through it the way a whale does — deliberate, unhurried, and rarely seen in full. IZK is the rare, wise whale at the center of it.",
  },
  {
    title: "An old way of speaking",
    body: "Art has existed for as long as people have needed to say something words couldn't hold. Whales are the same — their calls travel for miles in a language built long before ours, strange and unmistakably their own. IZK's work is trying to speak that way.",
  },
  {
    title: "What sinks feeds what rises",
    body: "When a whale dies, it falls to the ocean floor and becomes the foundation for everything that grows there next — a whole ecosystem, fed by what came before. Nothing made in earnest is ever really lost; it just becomes ground for the next thing.",
  },
  {
    title: "Old, intelligent, and still playful",
    body: "Whales are among the oldest living creatures on earth — highly intelligent, deeply family-oriented, and, despite all that depth, still playful and a little mysterious. IZK sees himself the same way.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-abyss via-deep to-mid">
        <Bubbles />
        <SwimmingWhale />
        <div className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-center px-6 py-32">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-glow-soft">
            Original art from the depths
          </p>
          <h1 className="font-display max-w-2xl text-5xl leading-tight text-foam sm:text-7xl">
            I am IZK —<br />
            <span className="italic text-gold">a rare, wise whale</span>
            <br />
            moving through the world.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-foam/70">
            The world is a giant ocean. This is art made from what it means
            to be old, intelligent, family-bound, playful, and a little
            mysterious — moving through it slowly.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/gallery"
              className="rounded-full bg-glow px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-glow-soft"
            >
              View the Gallery
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-foam/30 px-7 py-3 text-sm font-medium text-foam transition-colors hover:border-glow hover:text-glow"
            >
              Visit the Shop
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-abyss px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl text-foam sm:text-4xl">
            Why a whale
          </h2>
          <div className="mt-14 grid gap-14 sm:grid-cols-2">
            {STORY.map((item) => (
              <div key={item.title} className="border-l-2 border-glow/40 pl-6">
                <h3 className="font-display text-xl text-gold">
                  {item.title}
                </h3>
                <p className="mt-3 text-foam/70 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-mid to-deep px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl text-foam sm:text-4xl">
            Come down to the ocean floor
          </h2>
          <p className="mt-4 text-foam/70">
            New work, prints, and originals — surfacing regularly.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium text-ink transition-colors hover:brightness-110"
          >
            Shop the collection
          </Link>
        </div>
      </section>
    </div>
  );
}
