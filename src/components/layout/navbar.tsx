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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-neutral-200/60 shadow-sm"
            : "bg-transparent border-transparent py-2"
        )}
      >
        <nav className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Modern & Minimal */}
            <Link href="/" className="relative z-10 flex items-center gap-2 group">
              <div className="h-8 w-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-neutral-500/20 group-hover:shadow-neutral-500/40 transition-shadow duration-300">
                R
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-black transition-colors">
                ReMember<span className="text-secondary">X</span>
              </span>
            </Link>

            {/* Desktop Navigation - Enterprise Pill Style */}
            <div className="hidden items-center gap-1 lg:flex bg-neutral-100/50 p-1 rounded-full border border-neutral-200/50 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-5 py-2 text-[14px] font-medium transition-all duration-300 rounded-full",
                      isActive
                        ? "text-neutral-900 bg-white shadow-sm font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden items-center gap-4 lg:flex">
              {session ? (
                <>
                  {/* Dashboard Link */}
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Dashboard
                  </Link>

                  {/* Profile Dropdown - Refined */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200 hover:border-neutral-300 transition-colors overflow-hidden"
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
                        <span className="text-sm font-semibold text-neutral-700">
                          {getInitials(session.user?.name || "U")}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setProfileOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl shadow-neutral-900/5"
                          >
                            <div className="px-3 py-2 mb-1">
                              <p className="text-sm font-semibold text-neutral-900 truncate">
                                {session.user?.name}
                              </p>
                              <p className="text-xs text-neutral-500 truncate">
                                {session.user?.email}
                              </p>
                            </div>
                            <div className="h-px bg-neutral-100 my-1 mx-2" />
                            <Link
                              href={dashboardHref}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-600 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              Dashboard
                            </Link>
                            <button
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
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
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-[14px] font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-neutral-900/20 hover:bg-black hover:shadow-xl hover:shadow-neutral-900/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Sign up
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}
            </div>


            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors lg:hidden"
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
              className="fixed top-0 right-0 z-40 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.08)]"
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
                        className="flex items-center rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="my-5 h-px bg-neutral-100" />

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
                          className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
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
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-error"
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
                          className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
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
                          className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-[16px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
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
