import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/navigation/Navbar";
import Sidebar from "../components/navigation/Sidebar";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onOpenSidebar={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}