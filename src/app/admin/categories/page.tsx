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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Categories</h1>
        <p className="text-neutral-500 mt-1">
          Manage listing categories. {categories.length} total categories.
        </p>
      </div>

      <Card className="p-0">
        <AdminCategoriesClient categories={serialized} />
      </Card>
    </div>
  );
}
