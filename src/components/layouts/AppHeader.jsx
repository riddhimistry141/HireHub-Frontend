import { useLocation } from "react-router-dom";

import {
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

function AppHeader() {
  const location = useLocation();

  const pageInfo = {
    "/jobs": {
      title: "Home",
      /* description: "Discover your next opportunity", */
    },

    "/dashboard": {
      title: "Dashboard",
      /* description: "Overview of your career activity", */
    },

    "/applications": {
      title: "My Applications",
      /* description: "Track your job applications", */
    },

    "/profile": {
      title: "Profile",
      /* description: "Manage your personal information", */
    },

    "/resume": {
      title: "Resume",
      /* description: "Manage your professional resume", */
    },
  };

  const currentPage = pageInfo[location.pathname] || {
    title: "HireHub",
    /* description: "Manage your career", */
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4">
      {/* Sidebar Toggle */}
      <SidebarTrigger className="-ml-1" />

      <Separator
        orientation="vertical"
        className="h-6"
      />

      {/* Page Information */}
      <div className="flex flex-col">
        <h1 className="text-sm font-semibold sm:text-base">
          {currentPage.title}
        </h1>

        <p className="hidden text-xs text-muted-foreground sm:block">
          {currentPage.description}
        </p>
      </div>
    </header>
  );
}

export default AppHeader;