import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserCheck,
  UserRound,
  UserX,
  Users,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahul Patel",
      email: "rahul@example.com",
      role: "USER",
      status: "ACTIVE",
      joined: "Sep 01, 2026",
    },
    {
      id: 2,
      name: "Priya Shah",
      email: "priya@example.com",
      role: "USER",
      status: "ACTIVE",
      joined: "Aug 30, 2026",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@techcorp.com",
      role: "RECRUITER",
      status: "ACTIVE",
      joined: "Aug 28, 2026",
    },
    {
      id: 4,
      name: "Neha Patel",
      email: "neha@example.com",
      role: "USER",
      status: "INACTIVE",
      joined: "Aug 24, 2026",
    },
    {
      id: 5,
      name: "Vikram Shah",
      email: "vikram@innovatelabs.com",
      role: "RECRUITER",
      status: "ACTIVE",
      joined: "Aug 22, 2026",
    },
    {
      id: 6,
      name: "Riya Mehta",
      email: "riya@example.com",
      role: "USER",
      status: "ACTIVE",
      joined: "Aug 20, 2026",
    },
  ]);

  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;

  const recruiters = users.filter((user) => user.role === "RECRUITER").length;

  const inactiveUsers = users.filter(
    (user) => user.status === "INACTIVE",
  ).length;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getRoleBadge = (role) => {
    if (role === "RECRUITER") {
      return (
        <Badge>
          <ShieldCheck className="mr-1 h-3 w-3" />
          Recruiter
        </Badge>
      );
    }

    return (
      <Badge variant="secondary">
        <UserRound className="mr-1 h-3 w-3" />
        User
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    if (status === "ACTIVE") {
      return (
        <Badge variant="outline" className="border-green-500/30 text-green-600">
          <UserCheck className="mr-1 h-3 w-3" />
          Active
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-red-500/30 text-red-600">
        <UserX className="mr-1 h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  const toggleStatus = (id) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : user,
      ),
    );
  };

  const changeRole = (id, role) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              role,
            }
          : user,
      ),
    );
  };

  const deleteUser = (id) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />

          <span className="text-sm font-medium text-primary">
            User Management
          </span>
        </div>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Users
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage users and their access across HireHub.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Users</p>

            <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Active Users</p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {activeUsers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Recruiters</p>

            <p className="mt-2 text-3xl font-bold">{recruiters}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Inactive Users</p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {inactiveUsers}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>

                <SelectItem value="USER">Users</SelectItem>

                <SelectItem value="RECRUITER">Recruiters</SelectItem>

                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>

                <SelectItem value="ACTIVE">Active</SelectItem>

                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-12 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      {/* User */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-medium">{user.name}</p>

                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>{getRoleBadge(user.role)}</TableCell>

                      {/* Status */}
                      <TableCell>{getStatusBadge(user.status)}</TableCell>

                      {/* Joined */}
                      <TableCell className="text-sm text-muted-foreground">
                        {user.joined}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              />
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />

                            <span className="sr-only">Open actions</span>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>
                                User Actions
                              </DropdownMenuLabel>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/users/${user.id}`)
                                }
                              >
                                <UserRound className="mr-2 h-4 w-4" />
                                View User
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  changeRole(
                                    user.id,
                                    user.role === "USER" ? "RECRUITER" : "USER",
                                  )
                                }
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />

                                {user.role === "USER"
                                  ? "Promote to Recruiter"
                                  : "Change to User"}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => toggleStatus(user.id)}
                              >
                                {user.status === "ACTIVE" ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Deactivate User
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Activate User
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground" />

                        <p className="font-medium">No users found</p>

                        <p className="text-sm text-muted-foreground">
                          Try changing your search or filters.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Result count */}
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{users.length}</span>{" "}
            users
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminUsers;
