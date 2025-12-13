"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, BookOpen, GraduationCap, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Playground", href: "/", icon: Terminal },
  { name: "Rules", href: "/rules", icon: BookOpen },
  { name: "Guide", href: "/guide", icon: GraduationCap },
  { name: "About", href: "/about", icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-slate-100">
              PolySol
            </span>
          </Link>
          <div className="flex gap-6 md:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-slate-100",
                  pathname === item.href
                    ? "text-slate-100"
                    : "text-slate-400"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
             {/* Placeholder for future auth or github link */}
        </div>
      </div>
    </nav>
  );
}
