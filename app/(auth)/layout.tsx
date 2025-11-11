
export default function AuthLayout({
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