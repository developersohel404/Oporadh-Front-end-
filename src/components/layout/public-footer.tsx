export function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">© {new Date().getFullYear()} OPORADH — Community Safety Platform</p>
      </div>
    </footer>
  );
}
