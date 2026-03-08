"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ListOrdered,
  PlusCircle,
  Star,
  Settings,
  ShoppingBag,
  Heart,
  MessageSquare,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role: string;
    tier: string;
  };
}

/* ------------------------------------------------------------------ */
/* Link configs per role                                               */
/* ------------------------------------------------------------------ */
const sellerLinks: SidebarLink[] = [
  { label: "Overview", href: "/dashboard/seller", icon: LayoutDashboard },
  { label: "My Listings", href: "/dashboard/seller/listings", icon: ListOrdered },
  { label: "Create Listing", href: "/dashboard/seller/listings/new", icon: PlusCircle },
  { label: "Reviews", href: "/dashboard/seller/reviews", icon: Star },
  { label: "Settings", href: "/dashboard/seller/settings", icon: Settings },
];

const buyerLinks: SidebarLink[] = [
  { label: "Overview", href: "/dashboard/buyer", icon: LayoutDashboard },
  { label: "My Purchases", href: "/dashboard/buyer/purchases", icon: ShoppingBag },
  { label: "Saved Listings", href: "/dashboard/buyer/saved", icon: Heart },
  { label: "My Reviews", href: "/dashboard/buyer/reviews", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/buyer/settings", icon: Settings },
];

/* ------------------------------------------------------------------ */
/* Tier badge variant mapping                                          */
/* ------------------------------------------------------------------ */
function getTierBadge(tier: string) {
  switch (tier) {
    case "GOLD":
      return { variant: "secondary" as const, label: "Gold" };
    case "SILVER":
      return { variant: "outline" as const, label: "Silver" };
    default:
      return { variant: "default" as const, label: "Bronze" };
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user.role === "SELLER" ? sellerLinks : buyerLinks;
  const tierBadge = getTierBadge(user.tier);

  const isActive = (href: string) => {
    if (href === "/dashboard/seller" || href === "/dashboard/buyer") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  /* Shared sidebar content */
  const sidebarContent = (
    <>
      {/* User profile section */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} src={user.image} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            {user.role === "SELLER" && (
              <Badge variant={tierBadge.variant} className="mt-1.5">
                {tierBadge.label} Seller
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="p-4 flex-1">
        <ul className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                    active
                      ? "bg-white/10 text-white"
                      : "text-neutral-400 hover:bg-neutral-950 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      active ? "text-white" : "text-neutral-400",
                    )}
                  />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800">
        <p className="text-xs text-neutral-400 text-center">
          ReMemberX Dashboard
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-[72px] bg-neutral-900 border-r border-neutral-800 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-[72px] left-0 right-0 z-30 bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} src={user.image} size="sm" />
          <span className="font-semibold text-sm text-white truncate">
            {user.name}
          </span>
          {user.role === "SELLER" && (
            <Badge variant={tierBadge.variant} className="text-[10px]">
              {tierBadge.label}
            </Badge>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-neutral-900 shadow-xl transition-transform duration-300 ease-in-out pt-[72px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

DashboardSidebar.displayName = "DashboardSidebar";

export { DashboardSidebar };
