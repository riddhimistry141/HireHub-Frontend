import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  User,
  UserRoundX,
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

const mockUsers = {
  "1": {
    id: "1",
    name: "Rahul Patel",
    email: "rahul.patel@gmail.com",
    role: "USER",
    status: "ACTIVE",
    location: "Ahmedabad, Gujarat",
    joinedDate: "January 12, 2026",
    applications: 8,
    interviews: 2,
    hired: 1,
  },
  "2": {
    id: "2",
    name: "Priya Shah",
    email: "priya.shah@gmail.com",
    role: "USER",
    status: "ACTIVE",
    location: "Surat, Gujarat",
    joinedDate: "February 04, 2026",
    applications: 5,
    interviews: 1,
    hired: 0,
  },
  "3": {
    id: "3",
    name: "Amit Kumar",
    email: "amit.kumar@gmail.com",
    role: "RECRUITER",
    status: "ACTIVE",
    location: "Ahmedabad, Gujarat",
    joinedDate: "January 22, 2026",
    applications: 0,
    interviews: 0,
    hired: 0,
  },
};

function AdminUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const user = mockUsers[id];

  const [status, setStatus] = useState(
    user?.status || "ACTIVE"
  );

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <User className="h-10 w-10 text-muted-foreground" />

        <h2 className="mt-4 text-xl font-semibold">
          User not found
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          The requested user does not exist.
        </p>

        <Button
          className="mt-4"
          onClick={() => navigate("/admin/users")}
        >
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

  const handleToggleStatus = () => {
    setStatus((current) =>
      current === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
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
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {initials}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {user.name}
                </h1>

                <Badge variant="outline">
                  {user.role}
                </Badge>

                <Badge
                  className={
                    status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {status}
                </Badge>
              </div>

              <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>

                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>

              <Button
                variant={
                  status === "ACTIVE"
                    ? "destructive"
                    : "default"
                }
                onClick={handleToggleStatus}
              >
                {status === "ACTIVE" ? (
                  <>
                    <UserRoundX className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activate
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
            <p className="text-sm text-muted-foreground">
              Applications
            </p>

            <p className="mt-1 text-2xl font-bold">
              {user.applications}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Interviews
            </p>

            <p className="mt-1 text-2xl font-bold">
              {user.interviews}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Hired
            </p>

            <p className="mt-1 text-2xl font-bold">
              {user.hired}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Basic information about this account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Full Name
                </p>

                <p className="text-sm font-medium">
                  {user.name}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Email
                </p>

                <p className="text-sm font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Location
                </p>

                <p className="text-sm font-medium">
                  {user.location}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Joined
                </p>

                <p className="text-sm font-medium">
                  {user.joinedDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role */}
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
                <div className="rounded-lg bg-primary/10 p-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="font-semibold">
                    {user.role}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Standard platform access
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {[
                "Apply for jobs",
                "Manage own profile",
                "Manage resume",
                "Track applications",
              ].map((permission) => (
                <div
                  key={permission}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {permission}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminUserDetails;