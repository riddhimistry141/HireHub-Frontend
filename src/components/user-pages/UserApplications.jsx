import { useMemo, useState, useEffect } from "react";
import {
  Search,
  CalendarDays,
  MapPin,
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  Video,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function getStatusLabel(status) {
  const labels = {
    APPLIED: "Applied",
    REVIEWING: "Under Review",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    REJECTED: "Rejected",
    HIRED: "Hired",
  };

  return labels[status] || status;
}

function getStatusClasses(status) {
  const classes = {
    APPLIED:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",

    REVIEWING:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",

    SHORTLISTED:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",

    INTERVIEW:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",

    REJECTED:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",

    HIRED:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
    Withdrawn:
      "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300",

  };

  return classes[status] || "";
}

function UserApplications() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${BASE_URL}/applications/my`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch applications");
        }

        setApplications(data.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [BASE_URL, navigate]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        application.job.title.toLowerCase().includes(searchText) ||
        application.job.company.name.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications,search, statusFilter]);

  const totalApplications = applications.length;

  const reviewingCount = applications.filter(
    (item) => item.status === "REVIEWING",
  ).length;

  const shortlistedCount = applications.filter(
    (item) => item.status === "SHORTLISTED",
  ).length;

  const interviewCount = applications.filter(
    (item) => item.status === "INTERVIEW",
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-14 text-center">
          <h3 className="font-semibold">Failed to load applications</h3>

          <p className="mt-1 text-sm text-muted-foreground">{error}</p>

          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= PAGE HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your job applications.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <BriefcaseBusiness className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>

            <p className="mt-1 text-xs text-muted-foreground">
              All applications
            </p>
          </CardContent>
        </Card>

        {/* Reviewing */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Clock3 className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{reviewingCount}</div>

            <p className="mt-1 text-xs text-muted-foreground">Being reviewed</p>
          </CardContent>
        </Card>

        {/* Shortlisted */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <CheckCircle2 className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{shortlistedCount}</div>

            <p className="mt-1 text-xs text-muted-foreground">
              Applications shortlisted
            </p>
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Video className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{interviewCount}</div>

            <p className="mt-1 text-xs text-muted-foreground">
              Interview stage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ================= SEARCH + FILTER ================= */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by job title or company..."
                className="pl-9"
              />
            </div>

            {/* Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Applications</SelectItem>

                <SelectItem value="APPLIED">Applied</SelectItem>

                <SelectItem value="REVIEWING">Under Review</SelectItem>

                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>

                <SelectItem value="INTERVIEW">Interview</SelectItem>

                <SelectItem value="REJECTED">Rejected</SelectItem>

                <SelectItem value="HIRED">Hired</SelectItem>

                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ================= APPLICATION LIST ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Applications</h2>

            <p className="text-sm text-muted-foreground">
              Showing {filteredApplications.length} of {applications.length}{" "}
              applications
            </p>
          </div>
        </div>

        {/* Empty state */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <Search className="size-5 text-muted-foreground" />
              </div>

              <h3 className="font-semibold">No applications found</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                We couldn't find any applications matching your search or
                selected filter.
              </p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card
              key={application.id}
              className="transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Job information */}
                  <div className="flex min-w-0 gap-4">
                    <div className="hidden size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
                      <BriefcaseBusiness className="size-5" />
                    </div>

                    <div className="min-w-0 space-y-2">
                      <div>
                        <h3 className="truncate font-semibold">
                          {application.job.title}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {application.job.company.name}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {application.job.location}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" />
                          Applied{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status + action */}
                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <Badge
                      variant="outline"
                      className={getStatusClasses(application.status)}
                    >
                      {getStatusLabel(application.status)}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/applications/${application.id}`)
                      }
                    >
                      View Details
                      <ArrowRight className="ml-1 size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default UserApplications;
