export default function Loading() {
  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center gap-3">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-charcoal-700 border-t-sand-400 animate-spin" />
        <span className="text-lg">🏹</span>
      </div>
      <p className="text-xs uppercase tracking-widest text-sand-300/40 font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  );
}
