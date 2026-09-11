import { NavLink, /* useNavigate */ } from "react-router-dom";
import { Home, BriefcaseBusiness } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  /* SidebarGroupLabel, */
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import UserProfileMenu from "@/components/layouts/UserProfileMenu"; /*  */

function AppSidebar() {
  //const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.roleName;

  /* const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  }; */

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="px-2 text-xl font-bold">HireHub</h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Menu</SidebarGroupLabel> */}

          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard *
              <SidebarMenuItem>
                <SidebarMenuButton render={<NavLink to="/dashboard" end />}>
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem> */}

              {/* USER */}
              {role === "USER" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/jobs" end />}>
                      <Home className="size-4" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/dashboard" />}>
                      <BriefcaseBusiness className="size-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/applications" />}>
                      My Applications
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/resume" />}>
                      Resume
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
                </>
              )}

              {/* RECRUITER */}
              {role === "RECRUITER" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/recruiter/dashboard" />}>
                      Dashboard
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/recruiter/company" />}>
                      Company
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/recruiter/jobs" />}>
                      MyJob
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* ADMIN */}
              {role === "ADMIN" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/users" />}>
                      Users
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/roles" />}>
                      Roles
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/admin/jobs" />}>
                      Jobs
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        {/* <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      {/* ================= FOOTER ================= */}
      <SidebarFooter className="border-t p-2">
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
