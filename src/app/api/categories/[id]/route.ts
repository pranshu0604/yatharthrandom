import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* PATCH /api/categories/[id] — Update a category (admin only)         */
/* ------------------------------------------------------------------ */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, icon, description, isActive } = body;

    const data: Record<string, unknown> = {};

    if (name !== undefined) {
      data.name = name;
      data.slug = slugify(name);
    }
    if (icon !== undefined) data.icon = icon;
    if (description !== undefined) data.description = description;
    if (typeof isActive === "boolean") data.isActive = isActive;

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("[API] PATCH /api/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/* DELETE /api/categories/[id] — Delete a category (admin only)        */
/* ------------------------------------------------------------------ */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Check if any listings use this category
    const listingsCount = await prisma.listing.count({
      where: { categoryId: id },
    });

    if (listingsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category with ${listingsCount} associated listing(s). Deactivate it instead.`,
        },
        { status: 400 },
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
