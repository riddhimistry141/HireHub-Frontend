import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
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

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminDashboard() {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("Admin");

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [usersResponse, jobsResponse, applicationsResponse] =
        await Promise.all([
          fetch(`${BASE_URL}/admin/users`, {
            headers,
          }),

          fetch(`${BASE_URL}/admin/jobs`, {
            headers,
          }),

          fetch(`${BASE_URL}/admin/applications`, {
            headers,
          }),
        ]);

      const usersResult = await usersResponse.json();
      const jobsResult = await jobsResponse.json();
      const applicationsResult = await applicationsResponse.json();

      if (!usersResponse.ok) {
        throw new Error(usersResult.message || "Failed to fetch users");
      }

      if (!jobsResponse.ok) {
        throw new Error(jobsResult.message || "Failed to fetch jobs");
      }

      if (!applicationsResponse.ok) {
        throw new Error(
          applicationsResult.message || "Failed to fetch applications",
        );
      }

      setUsers(usersResult.data || []);
      setJobs(jobsResult.data || []);
      setApplications(applicationsResult.data || []);
    } catch (error) {
      setError(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    setAdminName(storedUser?.data?.name || storedUser?.name || "Admin");

    fetchDashboardData();
  }, []);

  const totalUsers = users.length;

  const totalRecruiters = users.filter(
    (user) => user.role === "RECRUITER",
  ).length;

  const activeJobs = jobs.filter((job) => job.status === "ACTIVE").length;

  const totalApplications = applications.length;

  const hiredApplications = applications.filter(
    (application) => application.status === "HIRED",
  ).length;

  const pendingRecruiters = users.filter(
    (user) => user.role === "RECRUITER" && user.status === "PENDING",
  ).length;

  const draftJobs = jobs.filter((job) => job.status === "DRAFT").length;

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      change: `${totalUsers} registered accounts`,
      icon: Users,
    },
    {
      title: "Recruiters",
      value: totalRecruiters,
      change: `${pendingRecruiters} pending review`,
      icon: UserRoundCheck,
    },
    {
      title: "Active Jobs",
      value: activeJobs,
      change: `${draftJobs} draft jobs`,
      icon: BriefcaseBusiness,
    },
    {
      title: "Applications",
      value: totalApplications,
      change: `${hiredApplications} hired`,
      icon: FileText,
    },
  ];

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[500px] w-full max-w-7xl items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="mt-3 text-sm text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[500px] w-full max-w-7xl items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <ShieldCheck className="h-10 w-10 text-destructive" />

            <h2 className="mt-4 text-xl font-semibold">
              Failed to load dashboard
            </h2>

            <p className="mt-2 text-sm text-destructive">{error}</p>

            <Button className="mt-5" onClick={() => fetchDashboardData()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

        <Button
          variant="outline"
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
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

                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
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
              <CardTitle>Pending Review</CardTitle>

              <CardDescription>
                Items that may require administrator attention.
              </CardDescription>
            </div>

            {(pendingRecruiters > 0 || draftJobs > 0) && (
              <Badge variant="secondary">Action Required</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Draft Jobs */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-500/10 p-2">
                  <BriefcaseBusiness className="h-5 w-5 text-yellow-600" />
                </div>

                <div>
                  <p className="font-medium">Draft jobs</p>

                  <p className="text-sm text-muted-foreground">
                    Jobs currently in draft status
                  </p>
                </div>
              </div>

              <div className="text-xl font-bold">{draftJobs}</div>
            </div>

            {/* Pending Recruiters */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <UserRoundCheck className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="font-medium">Recruiters awaiting review</p>

                  <p className="text-sm text-muted-foreground">
                    Review pending recruiter accounts
                  </p>
                </div>
              </div>

              <div className="text-xl font-bold">{pendingRecruiters}</div>
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

                <CardDescription>Recently registered accounts.</CardDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/users")}
              >
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No users found.
              </p>
            ) : (
              recentUsers.map((user) => {
                const initials = user.name
                  ?.split(" ")
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
                        <AvatarFallback>{initials || "U"}</AvatarFallback>
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
                      variant="outline"
                      className={
                        user.role === "RECRUITER"
                          ? "border-blue-500/30 text-blue-600"
                          : user.role === "ADMIN"
                            ? "border-purple-500/30 text-purple-600"
                            : "border-muted-foreground/30 text-muted-foreground"
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                );
              })
            )}
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

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/jobs")}
              >
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentJobs.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No jobs found.
              </p>
            ) : (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{job.title}</p>

                    <p className="text-xs text-muted-foreground">
                      {job.company?.name}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      job.status === "ACTIVE"
                        ? "border-green-500/30 text-green-600"
                        : job.status === "CLOSED"
                          ? "border-red-500/30 text-red-600"
                          : "border-yellow-500/30 text-yellow-600"
                    }
                  >
                    {job.status}
                  </Badge>
                </div>
              ))
            )}
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

              <p className="mt-3 text-2xl font-bold">{totalUsers}</p>

              <p className="text-sm text-muted-foreground">Users</p>
            </div>

            <div className="rounded-lg border p-4">
              <UserRoundCheck className="h-5 w-5 text-primary" />

              <p className="mt-3 text-2xl font-bold">{totalRecruiters}</p>

              <p className="text-sm text-muted-foreground">Recruiters</p>
            </div>

            <div className="rounded-lg border p-4">
              <BriefcaseBusiness className="h-5 w-5 text-primary" />

              <p className="mt-3 text-2xl font-bold">{activeJobs}</p>

              <p className="text-sm text-muted-foreground">Active Jobs</p>
            </div>

            <div className="rounded-lg border p-4">
              <FileText className="h-5 w-5 text-primary" />

              <p className="mt-3 text-2xl font-bold">{totalApplications}</p>

              <p className="text-sm text-muted-foreground">Applications</p>
            </div>

            <div className="rounded-lg border p-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />

              <p className="mt-3 text-2xl font-bold">{hiredApplications}</p>

              <p className="text-sm text-muted-foreground">Hired</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
