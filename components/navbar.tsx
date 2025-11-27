"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, profile } from "@/data/content";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b-2 border-border-heavy bg-bg-beige">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="#top"
            className="font-mono text-lg font-semibold uppercase tracking-widest"
            onClick={close}
          >
            {profile.name}
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-accent-orange"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="mailto:me@seanchow.com"
              className={cn(
                "border-2 border-border-heavy bg-accent-orange px-4 py-2 text-sm font-semibold uppercase",
                "shadow-posthog transition-all hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              )}
            >
              Hire Me
            </Link>
          </nav>
          <button
            className="md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            type="button"
            onClick={toggle}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-bg-beige/95 md:hidden"
            id="mobile-menu"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="flex h-full flex-col justify-between border-2 border-border-heavy bg-bg-beige px-6 pb-10 pt-8 shadow-posthog"
            >
              <div className="flex items-center justify-between font-mono text-sm uppercase tracking-[0.3em] text-text-secondary">
                <span>{profile.role}</span>
                <button aria-label="Close menu" type="button" onClick={close}>
                  <X />
                </button>
              </div>
              <div className="space-y-6 text-3xl font-semibold">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={close} className="block">
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link
                href="mailto:me@seanchow.com"
                className="inline-flex border-2 border-border-heavy bg-accent-orange px-6 py-3 text-base font-semibold uppercase shadow-posthog"
                onClick={close}
              >
                Hire Me
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
