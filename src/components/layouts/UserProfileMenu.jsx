import {
  Check,
  FileText,
  Laptop,
  LogOut,
  MoreVertical,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme/theme-context";

function UserProfileMenu() {
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  const user = JSON.parse(localStorage.getItem("user"));

  const name = user?.name || "User";
  const email = user?.email || "user@example.com";
  const role = user?.roleName || "USER";
  const normalizedRole = role.toLowerCase();

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg p-2 text-left outline-none hover:bg-sidebar-accent">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name}</p>

          <p className="truncate text-xs text-muted-foreground">{role}</p>
        </div>

        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={8}
        className="w-64"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="text-sm font-semibold">{name}</p>

            <p className="text-xs font-normal text-muted-foreground">{email}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Profile */}
        <DropdownMenuItem
          onClick={() => {
            if (normalizedRole === "admin") {
              navigate("/admin/profile");
            } else if (normalizedRole === "recruiter") {
              navigate("/recruiter/profile");
            } else {
              navigate("/profile");
            }
          }}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        {/* Settings submenu */}

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="w-52">
            {normalizedRole === "user" && (
              <DropdownMenuItem onClick={() => navigate("/resume")}>
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </DropdownMenuItem>
            )}
            {/* Theme subMenu  */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sun className="mr-2 h-4 w-4" />
                Theme
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent className="w-40">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                  {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                  {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Laptop className="mr-2 h-4 w-4" />
                  System
                  {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserProfileMenu;
