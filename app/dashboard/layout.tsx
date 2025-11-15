import Sidebar from "@/app/components/sidebar";
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/firebase/verify';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }
  
  return (
    <>
    <div className="flex min-h-screen max-w-screen bg-(--dashboard-bg)">
      <Sidebar />
      <main className="w-full px-10">{children}</main>
    </div>
    </>
  );
}
