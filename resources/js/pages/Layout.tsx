import { useState, type ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";
import {ToastMessage} from "./components/ToastMessage";

type NavItem = {
  label: string;
  href: string;
};

type SideNavLayoutProps = {
  title?: string;
  children: ReactNode;
};

// Edit these to match your app's pages
const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard"},
  { label: "Users", href: "/users" },
  { label: "Customers", href: "/customers"},
  { label: "Categories", href: "/categories"},
  { label: "Products", href: "/products"},
  { label: "Invoices", href: "/invoices"},
];

export default function SideNavLayout({ title = "", children }: SideNavLayoutProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { url } = usePage();

  const isActive = (href: string): boolean =>
    url === href || url.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 py-6 transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 pb-6 text-lg font-semibold text-white">
          Your App
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Main">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-700/80 px-3 pt-4">
          <Link
            href="/logout"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-sm font-medium text-slate-200 shadow-sm transition-colors hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 15l3-3m0 0-3-3m3 3H9.75"
              />
            </svg>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main area, offset by sidebar width on large screens */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-stone-200 bg-stone-100/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md p-2 text-stone-700 hover:bg-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 lg:hidden"
            aria-label="Open navigation"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
            <ToastMessage />
            {children}
        </main>
      </div>
    </div>
  );
}
