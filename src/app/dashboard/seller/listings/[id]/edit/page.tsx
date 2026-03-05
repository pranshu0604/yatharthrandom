import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditListingForm } from "./edit-listing-form";

/* ------------------------------------------------------------------ */
/* Server component — fetch listing & categories, then render form     */
/* ------------------------------------------------------------------ */
export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SELLER") redirect("/dashboard");

  const { id } = await params;

  const [listing, categories] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!listing) notFound();

  /* Only the owner can edit their listing */
  if (listing.sellerId !== session.user.id) {
    redirect("/dashboard/seller/listings");
  }

  /* Serialize dates for client component */
  const serializedListing = {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    originalPrice: listing.originalPrice,
    askingPrice: listing.askingPrice,
    categoryId: listing.categoryId,
    city: listing.city,
    state: listing.state,
    membershipType: listing.membershipType,
    duration: listing.duration ?? "",
    expiryDate: listing.expiryDate
      ? listing.expiryDate.toISOString().split("T")[0]
      : "",
    images: listing.images,
    status: listing.status,
  };

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <EditListingForm
      listing={serializedListing}
      categories={categoryOptions}
    />
  );
}
