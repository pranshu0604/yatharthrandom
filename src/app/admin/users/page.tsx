import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AdminUsersClient } from "./users-client";

export const metadata = {
  title: "Manage Users | Admin | ReMemberX",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const roleFilter = params.role ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const limit = 20;

  // Build where clause
  const where: Prisma.UserWhereInput = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ];
  }

  if (roleFilter && ["BUYER", "SELLER", "ADMIN"].includes(roleFilter)) {
    where.role = roleFilter as "BUYER" | "SELLER" | "ADMIN";
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        tier: true,
        city: true,
        isActive: true,
        createdAt: true,
        _count: { select: { listings: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const serialized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image,
    role: u.role,
    tier: u.tier,
    city: u.city ?? "N/A",
    isActive: u.isActive,
    createdAt: formatDate(u.createdAt),
    listingsCount: u._count.listings,
  }));

  return (
    <div>
      <div className="border-b border-neutral-800/60 pb-6 mb-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-600 mb-1">Admin</p>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-neutral-600">{total} registered</p>
        </div>
      </div>

      <Card className="p-0">
        <AdminUsersClient
          users={serialized}
          query={query}
          roleFilter={roleFilter}
          page={page}
          totalPages={totalPages}
          total={total}
        />
      </Card>
    </div>
  );
}
