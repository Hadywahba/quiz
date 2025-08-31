import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-amber-100">
      <main className="flex-1">
        <Outlet /> {/* هنا هتظهر أي صفحة جوة الـ Layout */}
      </main>
    </div>
  );
}
