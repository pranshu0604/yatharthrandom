import { prisma } from "@/lib/prisma";
import SectionHeading from "@/components/landing/section-heading";
import CategoryCard from "@/components/landing/category-card";

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { listings: { where: { status: "ACTIVE" } } } },
      },
      orderBy: { name: "asc" },
    });
    return categories;
  } catch {
    return [];
  }
}

const fallbackCategories = [
  { name: "Gym & Fitness", slug: "gym-fitness", icon: "Dumbbell" },
  { name: "Club Memberships", slug: "club-memberships", icon: "Building2" },
  { name: "Resorts & Hotels", slug: "resorts-hotels", icon: "Palmtree" },
  { name: "Holiday Packages", slug: "holiday-packages", icon: "Plane" },
  { name: "Sports Clubs", slug: "sports-clubs", icon: "Trophy" },
  { name: "Pool & Spa", slug: "pool-spa", icon: "Waves" },
  { name: "Educational", slug: "educational", icon: "GraduationCap" },
  { name: "Wellness", slug: "wellness", icon: "Heart" },
];

export default async function Categories() {
  const categories = await getCategories();

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <SectionHeading
            title="Browse by Category"
            subtitle="Find the perfect membership from our curated categories across India"
          />
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                slug={category.slug}
                icon={category.icon}
                listingCount={category._count.listings}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {fallbackCategories.map((cat, index) => (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                slug={cat.slug}
                icon={cat.icon}
                listingCount={0}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
