import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-white dark:bg-[#0A0A0A] overflow-x-hidden">

      {/* SIDEBAR */}
      <AdminSidebar open={open} setOpen={setOpen} />

      {/* MAIN */}
      <div className="flex-1 lg:ml-[260px]">

        {/* HEADER (ONLY HERE) */}
        <AdminHeader onMenuClick={() => setOpen(true)} />

        {/* PAGE CONTENT */}
        <main className="pt-[72px] px-4 sm:px-6 w-full">
          {children}
        </main>

      </div>
    </div>
  );
}
