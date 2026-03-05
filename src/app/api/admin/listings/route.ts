import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/* PATCH /api/admin/listings — Admin actions on listings               */
/* ------------------------------------------------------------------ */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { listingId, action } = body;

    if (!listingId || !action) {
      return NextResponse.json(
        { error: "listingId and action are required" },
        { status: 400 },
      );
    }

    switch (action) {
      case "approve": {
        const listing = await prisma.listing.update({
          where: { id: listingId },
          data: { status: "ACTIVE" },
        });
        return NextResponse.json({ listing });
      }

      case "reject": {
        const listing = await prisma.listing.update({
          where: { id: listingId },
          data: { status: "REJECTED" },
        });
        return NextResponse.json({ listing });
      }

      case "feature": {
        const listing = await prisma.listing.update({
          where: { id: listingId },
          data: { featured: true },
        });
        return NextResponse.json({ listing });
      }

      case "unfeature": {
        const listing = await prisma.listing.update({
          where: { id: listingId },
          data: { featured: false },
        });
        return NextResponse.json({ listing });
      }

      case "delete": {
        // Delete related records first
        await prisma.savedListing.deleteMany({ where: { listingId } });
        await prisma.review.deleteMany({ where: { listingId } });
        await prisma.transaction.deleteMany({ where: { listingId } });
        await prisma.listing.delete({ where: { id: listingId } });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("[API] PATCH /api/admin/listings error:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 },
    );
  }
}
