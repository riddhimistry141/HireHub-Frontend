import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserCheck,
  UserRound,
  UserX,
  Users,
  Trash2,
  Clock3,
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ITEMS_PER_PAGE = 4;

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    user: null,
  });

  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch users");
      }

      setUsers(result.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;

  const recruiters = users.filter((user) => user.role === "RECRUITER").length;

  const suspendedUsers = users.filter(
    (user) => user.status === "SUSPENDED",
  ).length;

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const startResult =
    filteredUsers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endResult = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredUsers.length,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
        <Badge variant="outline" className="border-blue-500/30 text-blue-600">
          <ShieldCheck className="mr-1 h-3 w-3" />
          Recruiter
        </Badge>
      );
    }

    if (role === "ADMIN") {
      return (
        <Badge
          variant="outline"
          className="border-purple-500/30 text-purple-600"
        >
          <ShieldCheck className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="border-muted-foreground/30 text-muted-foreground"
      >
        <UserRound className="mr-1 h-3 w-3" />
        User
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    if (status === "ACTIVE" || status === "APPROVED") {
      return (
        <Badge variant="outline" className="border-green-500/30 text-green-600">
          <UserCheck className="mr-1 h-3 w-3" />
          {status === "APPROVED" ? "Approved" : "Active"}
        </Badge>
      );
    }

    if (status === "PENDING") {
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/30 text-yellow-600"
        >
          <Clock3 className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-red-500/30 text-red-600">
        <UserX className="mr-1 h-3 w-3" />
        {status === "SUSPENDED" ? "Suspended" : "Rejected"}
      </Badge>
    );
  };

  // ========================================
  // Update User Status
  // ========================================

  const toggleStatus = async (user) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    setConfirmDialog({
      open: true,
      type: newStatus === "SUSPENDED" ? "suspend" : "activate",
      user,
    });
  };

  /* try {
      setActionLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/admin/users/${user.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user status");
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                status: result.data?.status || newStatus,
              }
            : currentUser,
        ),
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  }; */
  const confirmStatusChange = async () => {
    const user = confirmDialog.user;

    if (!user) {
      return;
    }

    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    try {
      setActionLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/admin/users/${user.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user status");
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                status: result.data?.status || newStatus,
              }
            : currentUser,
        ),
      );

      setConfirmDialog({
        open: false,
        type: "",
        user: null,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ========================================
  // Update User Role
  // ========================================

  const changeRole = async (user) => {
    let newRole;

    if (user.role === "USER") {
      newRole = "RECRUITER";
    } else if (user.role === "RECRUITER") {
      newRole = "USER";
    } else {
      return;
    }

    const confirmed = window.confirm(
      `Change ${user.name}'s role from ${user.role} to ${newRole}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/users/${user.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: newRole,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user role");
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                role: result.data?.role || newRole,
              }
            : currentUser,
        ),
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ========================================
  // Delete User
  // ========================================

  /* const deleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== user.id),
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };
 */
  const deleteUser = (user) => {
    setConfirmDialog({
      open: true,
      type: "delete",
      user,
    });
  };
  const confirmDeleteUser = async () => {
    const user = confirmDialog.user;

    if (!user) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== user.id),
      );

      setConfirmDialog({
        open: false,
        type: "",
        user: null,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-7xl items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="mt-3 text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

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

      {error && (
        <Card className="border-destructive/30">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-destructive">{error}</p>

            <Button variant="outline" size="sm" onClick={fetchUsers}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

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
            <p className="text-sm text-muted-foreground">Suspended Users</p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {suspendedUsers}
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
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
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
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <p className="font-medium">{user.name}</p>

                            <p className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{getRoleBadge(user.role)}</TableCell>

                      <TableCell>{getStatusBadge(user.status)}</TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={actionLoading}
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

                              {user.role !== "ADMIN" && (
                                <DropdownMenuItem
                                  onClick={() => changeRole(user)}
                                >
                                  <ShieldCheck className="mr-2 h-4 w-4" />

                                  {user.role === "USER"
                                    ? "Promote to Recruiter"
                                    : "Change to User"}
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                onClick={() => toggleStatus(user)}
                              >
                                {user.status === "ACTIVE" ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Suspend User
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
                              onClick={() => deleteUser(user)}
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

          {/* Results + Pagination */}
          {filteredUsers.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {startResult}–{endResult}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredUsers.length}
                </span>{" "}
                users
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />

                    <span className="sr-only">Previous page</span>
                  </Button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />

                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => {
          if (!open && !actionLoading) {
            setConfirmDialog({
              open: false,
              type: "",
              user: null,
            });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "delete"
                ? "Delete User?"
                : confirmDialog.type === "suspend"
                  ? "Suspend User?"
                  : "Activate User?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {confirmDialog.type === "delete" ? (
                <>
                  Are you sure you want to permanently delete{" "}
                  <span className="font-medium text-foreground">
                    {confirmDialog.user?.name}
                  </span>
                  ? This action cannot be undone.
                </>
              ) : confirmDialog.type === "suspend" ? (
                <>
                  Are you sure you want to suspend{" "}
                  <span className="font-medium text-foreground">
                    {confirmDialog.user?.name}
                  </span>
                  ? The user will no longer have active access.
                </>
              ) : (
                <>
                  Are you sure you want to activate{" "}
                  <span className="font-medium text-foreground">
                    {confirmDialog.user?.name}
                  </span>
                  ?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={actionLoading}
              onClick={(event) => {
                event.preventDefault();

                if (confirmDialog.type === "delete") {
                  confirmDeleteUser();
                  return;
                }

                confirmStatusChange();
              }}
              className={
                confirmDialog.type === "delete" ||
                confirmDialog.type === "suspend"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {actionLoading
                ? "Processing..."
                : confirmDialog.type === "delete"
                  ? "Delete User"
                  : confirmDialog.type === "suspend"
                    ? "Suspend User"
                    : "Activate User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminUsers;
