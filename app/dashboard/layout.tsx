import Sidebar from "@/components/SideBar";
import ProfileMenu from "@/components/ProfileMenu";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const userId = await getSessionUserId();

  let name = "User";

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (user?.name) {
      name = user.name;
    }
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <div className="flex justify-end items-center px-6 py-4 border-b bg-white">

          <ProfileMenu name={name} />

        </div>

        <main className="p-8 flex-1">
          {children}
        </main>

      </div>

    </div>
  );
}