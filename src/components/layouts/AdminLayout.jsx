import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import AdminSidebar from "./AdminSidebar";
import AppHeader from "./AppHeader";

function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <AppHeader />

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminLayout;