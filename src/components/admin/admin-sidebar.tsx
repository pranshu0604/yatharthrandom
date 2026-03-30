"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  FolderOpen,
  MessageSquare,
  Settings,
  Menu,
  X,
  Shield,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/listings", label: "Listings", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-neutral-950 border-r border-neutral-800/60">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-neutral-800/60">
        <div className="flex h-8 w-8 items-center justify-center bg-white/8 border border-white/10">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-tight text-white">ReMemberX</p>
          <p className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-white/8 text-white border-l-2 border-accent pl-2.5"
                  : "text-neutral-500 hover:text-neutral-200 hover:bg-white/4 border-l-2 border-transparent pl-2.5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-accent" : "text-neutral-600 group-hover:text-neutral-400")} />
                {item.label}
              </div>
              {active && <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />}
            </Link>
          );
        })}
      </nav>

      {/* Divider + links */}
      <div className="border-t border-neutral-800/60 px-2 py-3 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-600 hover:text-neutral-300 transition-colors pl-2.5"
        >
          <ExternalLink className="h-4 w-4" />
          View site
        </Link>
      </div>

      {/* User */}
      {session?.user && (
        <div className="border-t border-neutral-800/60 px-4 py-3 flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-serif text-white">
            {getInitials(session.user.name || "A")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-neutral-300 truncate">{session.user.name}</p>
            <p className="text-[10px] text-neutral-600 truncate">{session.user.email}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-60 md:z-40">
        {sidebar}
      </aside>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-neutral-950 border border-neutral-800 p-2 text-neutral-300 shadow-none cursor-pointer"
        aria-label="Open admin menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-60 h-full">
            {sidebar}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-400 cursor-pointer"
              aria-label="Close admin menu"
            >
              <X className="h-5 w-5" />
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
