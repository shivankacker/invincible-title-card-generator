export default function Header() {
  return (
    <header className=" bg-slate-950 flex w-full items-center justify-between px-4 md:px-10 py-4 shrink-0">
      <div className="flex gap-4 items-center">
        <img src="/logo.png" alt="Logo" className="h-10 md:h-14 " />
        <div className="leading-5 text-center tracking-widest">
          Title Card
          <br />
          Generator
        </div>
      </div>
      <div className="flex items-center justify-end">
        <a
          href="https://github.com/shivankacker/invincible-title-card-generator"
          className="hover:text-white transition-all text-3xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github " />
        </a>
      </div>
    </header>
  );
}
