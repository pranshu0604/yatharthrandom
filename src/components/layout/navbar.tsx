"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LogOut, LayoutDashboard, User } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "How It Works", href: "/#how-it-works" },
];

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getScrollSnapshot() {
  return window.scrollY > 10;
}

function getServerScrollSnapshot() {
  return false;
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrollSnapshot, getServerScrollSnapshot);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const dashboardHref = session?.user?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[0.22,1,0.36,1]",
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-4"
            : "bg-transparent border-transparent py-6"
        )}
      >
        <nav className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo - Minimal & Bold */}
            <Link href="/" className="relative z-10 flex items-center gap-3 group">
              <span className="text-2xl font-serif font-bold tracking-tight text-white group-hover:text-neutral-300 transition-colors">
                ReMember<span className="text-secondary italic">X</span>
              </span>
            </Link>

            {/* Desktop Navigation - Minimal Text Links */}
            <div className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm tracking-wide transition-all duration-300 relative group",
                      isActive
                        ? "text-white font-medium"
                        : "text-neutral-400 hover:text-white"
                    )}
                  >
                    {link.label}
                    <span className={cn(
                        "absolute -bottom-1 left-0 w-full h-px bg-secondary transform origin-left transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}/>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden items-center gap-6 lg:flex">
              {session ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 border border-white/10 hover:border-white/30 transition-colors overflow-hidden"
                    >
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user?.name || "Profile"}
                          fill
                          className="rounded-full object-cover"
                          sizes="40px"
                          unoptimized
                        />
                      ) : (
                        <span className="text-sm font-serif text-white">
                          {getInitials(session.user?.name || "U")}
                        </span>
                      )}
                    </button>
                    {/* ... keeping existing dropdown logic but styled dark ... */}
                     <AnimatePresence>
                      {profileOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setProfileOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-14 z-50 w-64 rounded-xl glass-panel p-2 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                          >
                            <div className="px-3 py-3 border-b border-white/10 mb-1">
                              <p className="text-sm font-medium text-white truncate">
                                {session.user?.name}
                              </p>
                              <p className="text-xs text-neutral-500 truncate">
                                {session.user?.email}
                              </p>
                            </div>
                            <Link
                              href={dashboardHref}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              Dashboard
                            </Link>
                            <button
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign Out
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-6">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="relative px-6 py-2.5 bg-white text-neutral-900 text-sm font-semibold tracking-wide hover:bg-neutral-200 transition-colors duration-300"
                  >
                    Get Access
                  </Link>
                </div>
              )}
            </div>



            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors lg:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-40 flex h-full w-[85%] max-w-sm flex-col bg-neutral-900 shadow-[-8px_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="h-16 shrink-0" />

              <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-8">
                <div className="space-y-1 pt-2">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-300 transition-colors hover:bg-neutral-950 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="my-5 h-px bg-neutral-800" />

                <div className="space-y-1">
                  {session ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          href={dashboardHref}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-300 transition-colors hover:bg-neutral-950 hover:text-white"
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-300 transition-colors hover:bg-neutral-950 hover:text-error"
                        >
                          <LogOut className="h-5 w-5" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-300 transition-colors hover:bg-neutral-950 hover:text-white"
                        >
                          <User className="h-5 w-5" />
                          Login
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <Link
                          href="/register"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-300 transition-colors hover:bg-neutral-950 hover:text-white"
                        >
                          <User className="h-5 w-5" />
                          Sign Up
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>

                <div className="mt-auto pt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/dashboard/seller/listings/new"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-neutral-800"
                    >
                      List Your Membership
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
