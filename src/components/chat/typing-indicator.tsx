export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 text-sm text-slate-500">
      <span>লিখছে</span>
      <span className="flex gap-0.5">
        <span
          className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </span>
    </div>
  );
}
