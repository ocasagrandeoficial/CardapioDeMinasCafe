import { Coffee, Facebook, Instagram, Twitter } from "lucide-react";

const socials = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "Twitter", href: "#", Icon: Twitter },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="container flex flex-col items-center gap-6 py-10 text-center">
        <div className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-coffee-600" />
          <span className="font-serif text-lg font-semibold text-stone-800">
            Dê Minas Café
          </span>
        </div>

        <p className="text-sm text-stone-500">
          Cafeteria e Empório — sabores de Minas em cada detalhe.
        </p>

        <div className="flex items-center gap-4">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition-colors hover:border-coffee-300 hover:bg-coffee-50 hover:text-coffee-700"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <p className="text-xs text-stone-400">
          © {new Date().getFullYear()} Dê Minas Café. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
