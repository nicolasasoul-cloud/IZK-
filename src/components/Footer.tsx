export default function Footer() {
  return (
    <footer className="border-t border-foam/10 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-foam/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg text-foam/80">IZK</p>
          <p>What sinks feeds what rises.</p>
          <p>&copy; {new Date().getFullYear()} IZK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
