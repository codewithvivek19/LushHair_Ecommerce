'use client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // No auth checks - direct access to admin
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 