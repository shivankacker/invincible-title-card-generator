export default function Header() {
  return (
    <header className=" md:fixed top-0 z-50 inset-x-0 bg-slate-950 grid grid-cols-3">
      <div></div>
      <div className="flex flex-col items-center justify-center p-4">
        <img src="/logo.png" alt="Logo" className="w-full md:w-auto md:h-14" />
        <div className="leading-4 text-center woodblock tracking-widest text-xs md:text-base">
          Title Card Generator
        </div>
      </div>
      <div className="flex items-center justify-end py-4 px-12">
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
