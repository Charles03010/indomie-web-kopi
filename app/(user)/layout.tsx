
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="bg-(--primary-bg)">
        {children}
      </main>
  );
}