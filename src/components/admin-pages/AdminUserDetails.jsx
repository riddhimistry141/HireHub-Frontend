import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  ShieldCheck,
  User,
  UserRoundX,
  UserCheck,
  UserX,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState(false);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch user details");
      }

      setUser(result.data || null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const handleStatusClick = () => {
    setConfirmDialog(true);
  };

  const updateUserStatus = async () => {
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

      setUser((currentUser) => ({
        ...currentUser,
        status: result.data?.status || newStatus,
      }));

      setConfirmDialog(false);
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

          <p className="mt-3 text-sm text-muted-foreground">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-7xl items-center justify-center">
        <Card className="w-full max-w-lg border-destructive/30">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <UserX className="h-10 w-10 text-destructive" />

            <h2 className="mt-4 text-xl font-semibold">Failed to load user</h2>

            <p className="mt-1 text-sm text-destructive">{error}</p>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/users")}
              >
                Back to Users
              </Button>

              <Button onClick={fetchUserDetails}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <User className="h-10 w-10 text-muted-foreground" />

        <h2 className="mt-4 text-xl font-semibold">User not found</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          The requested user does not exist.
        </p>

        <Button className="mt-4" onClick={() => navigate("/admin/users")}>
          Back to Users
        </Button>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "-";

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
        <User className="mr-1 h-3 w-3" />
        User
      </Badge>
    );
  };

  const getStatusBadge = (currentStatus) => {
    if (currentStatus === "ACTIVE" || currentStatus === "APPROVED") {
      return (
        <Badge variant="outline" className="border-green-500/30 text-green-600">
          <UserCheck className="mr-1 h-3 w-3" />
          {currentStatus === "APPROVED" ? "Approved" : "Active"}
        </Badge>
      );
    }

    if (currentStatus === "PENDING") {
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

    if (currentStatus === "REJECTED") {
      return (
        <Badge variant="outline" className="border-red-500/30 text-red-600">
          <UserX className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-red-500/30 text-red-600">
        <UserX className="mr-1 h-3 w-3" />
        Suspended
      </Badge>
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => navigate("/admin/users")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      {/* Header */}
      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {user.name}
                </h1>

                {getRoleBadge(user.role)}

                {getStatusBadge(user.status)}
              </div>

              <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Joined {joinedDate}
                </span>
              </div>
            </div>

            <div className="flex shrink-0">
              <Button
                variant={user.status === "ACTIVE" ? "destructive" : "default"}
                onClick={handleStatusClick}
                disabled={actionLoading}
              >
                {user.status === "ACTIVE" ? (
                  <>
                    <UserRoundX className="mr-2 h-4 w-4" />
                    Suspend User
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activate User
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Applications</p>

            <p className="mt-1 text-2xl font-bold">{user.applications}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Interviews</p>

            <p className="mt-1 text-2xl font-bold">{user.interviews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Hired</p>

            <p className="mt-1 text-2xl font-bold">{user.hired}</p>
          </CardContent>
        </Card>
      </div>

      {/* Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>

            <CardDescription>
              Basic information about this account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Full Name</p>

                <p className="text-sm font-medium">{user.name}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>

                <p className="break-all text-sm font-medium">{user.email}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Location</p>

                <p className="text-sm font-medium">{user.location}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Joined</p>

                <p className="text-sm font-medium">{joinedDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role & Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Role & Permissions</CardTitle>

            <CardDescription>
              Current access level for this account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="font-semibold">{user.role}</p>

                  <p className="text-sm text-muted-foreground">
                    {user.role === "ADMIN"
                      ? "Full platform administration access"
                      : user.role === "RECRUITER"
                        ? "Recruitment and job management access"
                        : "Standard job seeker access"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {(user.role === "ADMIN"
                ? [
                    "Manage users",
                    "Manage jobs",
                    "Manage applications",
                    "Manage platform access",
                  ]
                : user.role === "RECRUITER"
                  ? [
                      "Manage company profile",
                      "Create and manage jobs",
                      "Manage applicants",
                      "Manage interviews",
                    ]
                  : [
                      "Apply for jobs",
                      "Manage own profile",
                      "Manage resume",
                      "Track applications",
                    ]
              ).map((permission) => (
                <div
                  key={permission}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                  {permission}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={confirmDialog}
        onOpenChange={(open) => {
          if (!open && !actionLoading) {
            setConfirmDialog(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.status === "ACTIVE" ? "Suspend User?" : "Activate User?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {user.status === "ACTIVE" ? (
                <>
                  Are you sure you want to suspend{" "}
                  <span className="font-medium text-foreground">
                    {user.name}
                  </span>
                  ? The user will no longer have active access.
                </>
              ) : (
                <>
                  Are you sure you want to activate{" "}
                  <span className="font-medium text-foreground">
                    {user.name}
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
                updateUserStatus();
              }}
              className={
                user.status === "ACTIVE"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {actionLoading
                ? "Processing..."
                : user.status === "ACTIVE"
                  ? "Suspend User"
                  : "Activate User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminUserDetails;
