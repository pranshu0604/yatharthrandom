import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export const metadata = {
  title: "Dashboard | ReMemberX",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  /* Admin users should use the admin panel */
  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <DashboardSidebar
        user={{
          name: user.name ?? "User",
          email: user.email ?? "",
          image: user.image,
          role: user.role,
          tier: user.tier,
        }}
      />

      {/* Main content area */}
      <main className="lg:pl-64">
        {/* Spacer for mobile header */}
        <div className="lg:hidden h-[52px]" />
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
