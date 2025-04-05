export function Footer() {
  const otherStuff = [
    {
      name: "Writeroo",
      icon: "/products/writeroo-logo.webp",
      link: "https://writeroo.net",
    },
    {
      name: "Type",
      icon: "/products/type-logo.png",
      link: "https://type.shivank.dev",
    },
  ];

  return (
    <footer className="md:fixed bottom-0 inset-x-0 p-4 flex flex-col md:flex-row md:items-center justify-between">
      <div className="text-xs text-slate-600">
        This website is not affiliated with Invincible or Amazon Prime Video.
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center text-xs text-slate-600">
          Some other stuff I have made
        </div>
        <div className="flex items-center gap-2">
          {otherStuff.map((product) => (
            <a
              href={product.link}
              key={product.name}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:-translate-y-1 transition-all block grayscale hover:grayscale-0"
            >
              <img
                src={product.icon}
                alt={product.name}
                className="h-8 w-8 inline-block rounded-lg"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
