import Sidebar from "@/app/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <div className="flex min-h-screen max-w-screen bg-(--dashboard-bg)">
      <Sidebar />
      <main className="w-full px-10">{children}</main>
    </div>
    </>
  );
}
