import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { AdminCategoriesClient } from "./categories-client";

export const metadata = {
  title: "Manage Categories | Admin | ReMemberX",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { listings: true } },
    },
  });

  const serialized = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    description: c.description,
    isActive: c.isActive,
    listingsCount: c._count.listings,
  }));

  return (
    <div>
      <div className="border-b border-neutral-800/60 pb-6 mb-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-600 mb-1">Admin</p>
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-neutral-600">{categories.length} total</p>
        </div>
      </div>

      <Card className="p-0">
        <AdminCategoriesClient categories={serialized} />
      </Card>
    </div>
  );
}
