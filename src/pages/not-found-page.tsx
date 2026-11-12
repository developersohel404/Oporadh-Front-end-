export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <p className="text-slate-500 mt-2">পেজ খুঁজে পাওয়া যায়নি</p>
        <a href="/" className="inline-block mt-4 text-blue-600 underline">
          হোমে ফিরে যান
        </a>
      </div>
    </div>
  );
}
