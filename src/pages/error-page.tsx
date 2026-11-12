export function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">Error</h1>
        <p className="text-slate-500 mt-2">কিছু ভুল হয়েছে</p>
        <a href="/" className="inline-block mt-4 text-blue-600 underline">
          হোমে ফিরে যান
        </a>
      </div>
    </div>
  );
}
