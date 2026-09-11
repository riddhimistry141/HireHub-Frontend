import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
  ShieldCheck,
  Users,
  UserRoundCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function AdminDashboard() {
  const storedUser = JSON.parse(
    localStorage.getItem("user")
  );

  const adminName =
    storedUser?.data?.name || "Admin";

  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      change: "+12 this month",
      icon: Users,
    },
    {
      title: "Recruiters",
      value: "86",
      change: "+5 this month",
      icon: UserRoundCheck,
    },
    {
      title: "Active Jobs",
      value: "324",
      change: "+18 this week",
      icon: BriefcaseBusiness,
    },
    {
      title: "Applications",
      value: "2,847",
      change: "+126 this week",
      icon: FileText,
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Rahul Patel",
      email: "rahul@example.com",
      role: "USER",
    },
    {
      id: 2,
      name: "Priya Shah",
      email: "priya@example.com",
      role: "USER",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@techcorp.com",
      role: "RECRUITER",
    },
    {
      id: 4,
      name: "Neha Patel",
      email: "neha@example.com",
      role: "USER",
    },
  ];

  const recentJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp",
      status: "ACTIVE",
    },
    {
      id: 2,
      title: "React Developer",
      company: "InnovateLabs",
      status: "PENDING",
    },
    {
      id: 3,
      title: "Node.js Developer",
      company: "CodeWorks",
      status: "ACTIVE",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />

            <span className="text-sm font-medium text-primary">
              Administration
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {adminName}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage your HireHub platform.
          </p>
        </div>

        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-green-600">
                      {stat.change}
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Pending Approvals</CardTitle>

              <CardDescription>
                Items that require administrator attention.
              </CardDescription>
            </div>

            <Badge variant="secondary">
              Action Required
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-500/10 p-2">
                  <BriefcaseBusiness className="h-5 w-5 text-yellow-600" />
                </div>

                <div>
                  <p className="font-medium">
                    Jobs awaiting approval
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Review newly submitted jobs
                  </p>
                </div>
              </div>

              <div className="text-xl font-bold">
                12
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <UserRoundCheck className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="font-medium">
                    Recruiters awaiting review
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Verify recruiter accounts
                  </p>
                </div>
              </div>

              <div className="text-xl font-bold">
                4
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>

                <CardDescription>
                  Recently registered accounts.
                </CardDescription>
              </div>

              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentUsers.map((user) => {
              const initials = user.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      user.role === "RECRUITER"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Jobs</CardTitle>

                <CardDescription>
                  Latest jobs across the platform.
                </CardDescription>
              </div>

              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {job.title}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {job.company}
                  </p>
                </div>

                <Badge
                  variant={
                    job.status === "ACTIVE"
                      ? "default"
                      : "secondary"
                  }
                >
                  {job.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Platform Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>

          <CardDescription>
            Current HireHub platform statistics.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            <div className="rounded-lg border p-4">
              <Users className="h-5 w-5 text-primary" />

              <p className="mt-3 text-2xl font-bold">
                1,248
              </p>

              <p className="text-sm text-muted-foreground">
                Users
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <UserRoundCheck className="h-5 w-5 text-primary" />

              <p className="mt-3 text-2xl font-bold">
                86
              </p>

              <p className="text-sm text-muted-foreground">
                Recruiters
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <BriefcaseBusiness className="h-5 w-5 text-primary" />

              <p className="mt-3 text-2xl font-bold">
                324
              </p>

              <p className="text-sm text-muted-foreground">
                Active Jobs
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <FileText className="h-5 w-5 text-primary" />

              <p className="mt-3 text-2xl font-bold">
                2,847
              </p>

              <p className="text-sm text-muted-foreground">
                Applications
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />

              <p className="mt-3 text-2xl font-bold">
                73
              </p>

              <p className="text-sm text-muted-foreground">
                Hired
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  );
}

export default AdminDashboard;