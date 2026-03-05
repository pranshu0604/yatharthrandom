import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "SELLER") {
    redirect("/dashboard/seller");
  }

  if (session.user.role === "BUYER") {
    redirect("/dashboard/buyer");
  }

  /* Fallback for ADMIN (layout should catch this, but just in case) */
  redirect("/admin");
}
