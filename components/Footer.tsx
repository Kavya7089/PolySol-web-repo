export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-slate-400 md:text-left">
          Built for the Web3 Developer Community. Open Source.
        </p>
        <p className="text-center text-sm text-slate-400 md:text-right">
             &copy; {new Date().getFullYear()} PolySol
        </p>
      </div>
    </footer>
  );
}
